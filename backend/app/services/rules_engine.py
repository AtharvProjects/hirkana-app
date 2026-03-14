from dataclasses import dataclass


SAFE = "SAFE"
CAUTION = "CONSUME_WITH_CAUTION"
AVOID = "AVOID_DURING_PREGNANCY"


@dataclass
class RuleHit:
    key: str
    severity: str
    message: str


def _contains_any(text_blob: str, terms: list[str]) -> bool:
    t = text_blob.lower()
    return any(term in t for term in terms)


def evaluate_pregnancy_safety(
    ingredients: list[str],
    nutrients: dict,
    profile: dict,
) -> tuple[str, list[RuleHit], list[dict], list[str]]:
    text_blob = " ".join(ingredients)
    rule_hits: list[RuleHit] = []

    caffeine_mg = float(nutrients.get("caffeine_mg", 0) or 0)
    sugar_g = float(nutrients.get("sugar_g", 0) or 0)
    sodium_mg = float(nutrients.get("sodium_mg", 0) or 0)
    vit_a_mcg = float(nutrients.get("vitamin_a_mcg", 0) or 0)
    trans_fat_g = float(nutrients.get("trans_fat_g", 0) or 0)

    diabetes = "diabetes" in [c.lower() for c in profile.get("medical_conditions", [])]

    if caffeine_mg > 200 or _contains_any(text_blob, ["guarana", "energy blend"]):
        rule_hits.append(RuleHit("high_caffeine", AVOID, "High caffeine should be avoided in pregnancy."))

    if _contains_any(text_blob, ["alcohol", "ethanol", "beer", "wine", "rum"]):
        rule_hits.append(RuleHit("alcohol", AVOID, "Alcohol is not safe during pregnancy."))

    if _contains_any(text_blob, ["saccharin", "aspartame", "sucralose"]):
        rule_hits.append(RuleHit("artificial_sweeteners", CAUTION, "Artificial sweeteners should be limited."))

    if _contains_any(text_blob, ["sodium benzoate", "nitrite", "nitrate", "msg"]):
        rule_hits.append(RuleHit("preservatives", CAUTION, "High preservative foods should be limited."))

    if _contains_any(text_blob, ["raw egg", "runny egg", "raw meat", "unpasteurized"]):
        rule_hits.append(RuleHit("raw_animal_food", AVOID, "Raw or unpasteurized foods may increase infection risk."))

    if _contains_any(text_blob, ["shark", "swordfish", "king mackerel", "tilefish"]):
        rule_hits.append(RuleHit("high_mercury_fish", AVOID, "High-mercury fish should be avoided."))

    if trans_fat_g >= 1:
        rule_hits.append(RuleHit("trans_fat", CAUTION, "Trans fats should be minimized during pregnancy."))

    if sugar_g > 25 or (diabetes and sugar_g > 15):
        sev = AVOID if diabetes else CAUTION
        msg = "High sugar may worsen gestational glucose control." if diabetes else "High sugar intake should be limited."
        rule_hits.append(RuleHit("excess_sugar", sev, msg))

    if sodium_mg > 700:
        rule_hits.append(RuleHit("high_sodium", CAUTION, "High sodium foods may worsen fluid retention and blood pressure."))

    if vit_a_mcg > 900:
        rule_hits.append(RuleHit("excess_vitamin_a", CAUTION, "Excess vitamin A from certain foods/supplements should be avoided."))

    if any(r.severity == AVOID for r in rule_hits):
        final = AVOID
    elif any(r.severity == CAUTION for r in rule_hits):
        final = CAUTION
    else:
        final = SAFE

    nutrient_insights = [
        {"name": "Iron", "benefit": "Supports oxygen transport and baby brain development."},
        {"name": "Folic Acid", "benefit": "Helps neural tube development."},
        {"name": "Calcium", "benefit": "Supports strong bones for mother and baby."},
    ]

    alternatives = ["Milk", "Coconut water", "Fresh fruit bowl", "Homemade yogurt"] if final != SAFE else []

    return final, rule_hits, nutrient_insights, alternatives
