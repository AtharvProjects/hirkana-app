import re
from typing import Any

import httpx
import pytesseract
import torch
from PIL import Image
from torchvision import transforms
from torchvision.models import EfficientNet_B0_Weights, efficientnet_b0

from app.core.config import settings

_IMAGE_MODEL = None
_IMAGE_CATEGORIES: list[str] = []
_PREPROCESS = transforms.Compose(
    [
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
    ]
)

_CLASS_HINTS = {
    "espresso": ["coffee", "caffeine"],
    "latte": ["milk", "coffee", "caffeine"],
    "pizza": ["refined flour", "cheese", "salt"],
    "cheeseburger": ["bun", "processed meat", "salt"],
    "caesar salad": ["lettuce", "dressing", "egg"],
    "ice cream": ["milk", "sugar"],
    "sushi": ["raw fish", "rice"],
}


def _ensure_model_loaded():
    global _IMAGE_MODEL, _IMAGE_CATEGORIES, _PREPROCESS
    if _IMAGE_MODEL is not None:
        return

    try:
        weights = EfficientNet_B0_Weights.DEFAULT
        _IMAGE_MODEL = efficientnet_b0(weights=weights)
        _IMAGE_MODEL.eval()
        _PREPROCESS = weights.transforms()
        _IMAGE_CATEGORIES = list(weights.meta.get("categories", []))
    except Exception:
        _IMAGE_MODEL = efficientnet_b0(weights=None)
        _IMAGE_MODEL.eval()
        _IMAGE_CATEGORIES = []


def _parse_ingredients(text: str) -> list[str]:
    parts = re.split(r"[,;.]", text.lower())
    return [p.strip() for p in parts if p.strip()]


def _extract_nutrients_from_text(text: str) -> dict[str, float]:
    t = text.lower()

    def find_num(pattern: str) -> float:
        m = re.search(pattern, t)
        return float(m.group(1)) if m else 0.0

    return {
        "sugar_g": find_num(r"sugar\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g"),
        "sodium_mg": find_num(r"sodium\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*mg"),
        "caffeine_mg": find_num(r"caffeine\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*mg"),
        "trans_fat_g": find_num(r"trans\s*fat\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g"),
        "vitamin_a_mcg": find_num(r"vitamin\s*a\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:mcg|µg)"),
    }


async def barcode_stage(barcode: str) -> dict[str, Any] | None:
    url = f"{settings.openfoodfacts_base_url}/product/{barcode}.json"
    async with httpx.AsyncClient(timeout=2.0) as client:
        resp = await client.get(url)
    if resp.status_code != 200:
        return None

    data = resp.json()
    product = data.get("product") or {}
    if not product:
        return None

    ingredients_text = product.get("ingredients_text", "")
    nutriments = product.get("nutriments", {})

    return {
        "detected_food": product.get("product_name", "Unknown Product"),
        "ingredients": _parse_ingredients(ingredients_text),
        "nutrients": {
            "sugar_g": float(nutriments.get("sugars_100g") or 0),
            "sodium_mg": float(nutriments.get("sodium_100g") or 0) * 1000,
            "caffeine_mg": float(nutriments.get("caffeine_100g") or 0),
            "trans_fat_g": float(nutriments.get("trans-fat_100g") or 0),
            "vitamin_a_mcg": float(nutriments.get("vitamin-a_100g") or 0),
        },
        "additives": product.get("additives_tags", []),
        "source": "openfoodfacts",
    }


def ocr_stage(image_path: str) -> dict[str, Any] | None:
    try:
        text = pytesseract.image_to_string(Image.open(image_path))
    except Exception:
        return None

    if not text.strip():
        return None

    ingredients = _parse_ingredients(text)
    nutrients = _extract_nutrients_from_text(text)
    return {
        "detected_food": "Scanned Label Food",
        "ingredients": ingredients,
        "nutrients": nutrients,
        "additives": [i for i in ingredients if i.startswith("e") and len(i) <= 6],
        "source": "ocr",
    }


def image_stage(image_path: str) -> dict[str, Any] | None:
    _ensure_model_loaded()

    try:
        image = Image.open(image_path).convert("RGB")
        tensor = _PREPROCESS(image).unsqueeze(0)
        with torch.no_grad():
            output = _IMAGE_MODEL(tensor)
            top_idx = int(output.argmax(dim=1).item())
        label = _IMAGE_CATEGORIES[top_idx].lower() if _IMAGE_CATEGORIES and top_idx < len(_IMAGE_CATEGORIES) else "prepared food"
    except Exception:
        label = "prepared food"

    chosen = "prepared food"
    for k in _CLASS_HINTS:
        if k in label:
            chosen = k
            break

    ingredients = _CLASS_HINTS.get(chosen, ["mixed ingredients", "salt", "oil"])

    nutrients = {
        "sugar_g": 8 if "ice cream" in chosen else 4,
        "sodium_mg": 800 if "pizza" in chosen or "burger" in chosen else 450,
        "caffeine_mg": 140 if "espresso" in chosen or "latte" in chosen else 0,
        "trans_fat_g": 1.2 if "burger" in chosen else 0.3,
        "vitamin_a_mcg": 250,
    }

    return {
        "detected_food": chosen.title(),
        "ingredients": ingredients,
        "nutrients": nutrients,
        "additives": [],
        "source": "vision",
    }
