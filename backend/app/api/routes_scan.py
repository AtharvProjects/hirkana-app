import os
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.redis_client import cache_get, cache_set
from app.db.session import get_db
from app.models.profile import PregnancyProfile
from app.models.scan import ScanRecord
from app.models.user import User
from app.schemas.scan import ScanAnalyzeRequest, ScanHistoryItem, ScanResultResponse
from app.services.explainer import generate_simple_explanation
from app.services.food_pipeline import barcode_stage, image_stage, ocr_stage
from app.services.rules_engine import evaluate_pregnancy_safety
from app.utils.crypto import field_crypto

router = APIRouter(prefix="/scan", tags=["scan"])

REFERENCES = [
    {"title": "WHO maternal nutrition guidance", "url": "https://www.who.int/health-topics/pregnancy"},
    {"title": "ICMR dietary guidelines", "url": "https://www.icmr.gov.in"},
    {"title": "FSSAI standards", "url": "https://www.fssai.gov.in"},
]


def _profile_dict(db: Session, user_id: int) -> dict:
    profile = db.query(PregnancyProfile).filter(PregnancyProfile.user_id == user_id).first()
    if not profile:
        return {"medical_conditions": []}
    conditions = field_crypto.decrypt(profile.medical_conditions)
    return {
        "medical_conditions": __import__("json").loads(conditions or "[]"),
        "diet_preference": profile.diet_preference,
        "trimester": profile.trimester,
    }


def _store_scan(db: Session, current_user: User, payload: str, scan_type: str, data: dict):
    profile = _profile_dict(db, current_user.id)
    classification, rule_hits, nutrient_insights, alternatives = evaluate_pregnancy_safety(
        data["ingredients"], data["nutrients"], profile
    )

    rule_hit_dicts = [{"key": r.key, "severity": r.severity, "message": r.message} for r in rule_hits]
    explanation = generate_simple_explanation(classification, rule_hit_dicts)

    rec = ScanRecord(
        user_id=current_user.id,
        scan_type=scan_type,
        input_value=payload,
        detected_food=data["detected_food"],
        ingredients=data["ingredients"],
        nutrients=data["nutrients"],
        additives=data.get("additives", []),
        classification=classification,
        explanation=explanation,
        rule_hits=rule_hit_dicts,
        alternatives=alternatives,
        references=REFERENCES,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

    return ScanResultResponse(
        id=rec.id,
        detected_food=rec.detected_food,
        classification=rec.classification,
        explanation=rec.explanation,
        nutrient_insights=nutrient_insights,
        references=rec.references,
        alternatives=rec.alternatives,
        rule_hits=rec.rule_hits,
        created_at=rec.created_at,
    )


@router.post("/analyze", response_model=ScanResultResponse)
async def analyze_scan(
    payload: ScanAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.scan_type not in {"barcode", "ocr", "image"}:
        raise HTTPException(status_code=400, detail="Invalid scan type")

    cache_key = f"scan:{payload.scan_type}:{payload.payload.strip().lower()}"
    data = cache_get(cache_key)

    if data is None:
        if payload.scan_type == "barcode":
            data = await barcode_stage(payload.payload)
        if data is None and payload.scan_type in {"ocr", "image"}:
            import re

            t = payload.payload.lower()

            def find_num(pattern: str) -> float:
                m = re.search(pattern, t)
                return float(m.group(1)) if m else 0.0

            data = {
                "detected_food": "Manual Text Food",
                "ingredients": [s.strip() for s in payload.payload.split(",") if s.strip()],
                "nutrients": {
                    "sugar_g": find_num(r"sugar\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g"),
                    "sodium_mg": find_num(r"sodium\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*mg"),
                    "caffeine_mg": find_num(r"caffeine\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*mg"),
                    "trans_fat_g": find_num(r"trans\s*fat\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g"),
                    "vitamin_a_mcg": find_num(r"vitamin\s*a\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:mcg|µg)"),
                },
                "additives": [],
                "source": "text",
            }
        if data is None:
            raise HTTPException(status_code=404, detail="Unable to identify product")
        cache_set(cache_key, data)

    return _store_scan(db, current_user, payload.payload, payload.scan_type, data)


@router.post("/upload", response_model=ScanResultResponse)
async def analyze_uploaded_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    suffix = os.path.splitext(file.filename or "scan.jpg")[-1]
    with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        data = ocr_stage(tmp_path)
        scan_type = "ocr"
        if data is None:
            data = image_stage(tmp_path)
            scan_type = "image"

        return _store_scan(db, current_user, file.filename or "upload", scan_type, data)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@router.get("/history", response_model=list[ScanHistoryItem])
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(ScanRecord)
        .filter(ScanRecord.user_id == current_user.id)
        .order_by(ScanRecord.created_at.desc())
        .limit(100)
        .all()
    )
    return [
        ScanHistoryItem(
            id=r.id,
            detected_food=r.detected_food,
            classification=r.classification,
            explanation=r.explanation,
            created_at=r.created_at,
        )
        for r in rows
    ]
