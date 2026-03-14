from app.services.rules_engine import SAFE


def generate_simple_explanation(classification: str, rule_hits: list[dict]) -> str:
    if classification == SAFE:
        return "This food appears safe for pregnancy in moderate portions based on the scanned data."

    if not rule_hits:
        return "This food needs careful review during pregnancy."

    top = rule_hits[0]
    return top.get("message", "This food has risk factors that should be limited during pregnancy.")
