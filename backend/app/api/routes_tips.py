from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.profile import PregnancyProfile
from app.models.user import User

router = APIRouter(prefix="/tips", tags=["tips"])

TIPS = {
    1: [
        "Take folic acid-rich foods daily.",
        "Avoid raw foods and unpasteurized dairy.",
    ],
    2: [
        "Increase iron and protein intake.",
        "Stay hydrated and monitor caffeine intake.",
    ],
    3: [
        "Focus on calcium and omega-3 rich meals.",
        "Limit high-sodium processed foods.",
    ],
}


@router.get("")
def daily_tips(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(PregnancyProfile).filter(PregnancyProfile.user_id == current_user.id).first()
    trimester = profile.trimester if profile else 2
    return {"trimester": trimester, "tips": TIPS.get(trimester, TIPS[2])}
