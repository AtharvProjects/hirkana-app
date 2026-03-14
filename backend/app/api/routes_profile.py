import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.profile import PregnancyProfile
from app.models.user import User
from app.schemas.profile import ProfileResponse, ProfileUpsertRequest
from app.services.profile_service import trimester_for_week
from app.utils.crypto import field_crypto

router = APIRouter(prefix="/profile", tags=["profile"])


@router.put("", response_model=ProfileResponse)
def upsert_profile(
    payload: ProfileUpsertRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trimester = trimester_for_week(payload.pregnancy_week)
    profile = db.query(PregnancyProfile).filter(PregnancyProfile.user_id == current_user.id).first()

    enc_allergies = field_crypto.encrypt(json.dumps(payload.allergies))
    enc_conditions = field_crypto.encrypt(json.dumps(payload.medical_conditions))
    enc_restrictions = field_crypto.encrypt(payload.doctor_restrictions)

    if profile is None:
        profile = PregnancyProfile(
            user_id=current_user.id,
            age=payload.age,
            pregnancy_week=payload.pregnancy_week,
            trimester=trimester,
            diet_preference=payload.diet_preference,
            allergies=enc_allergies,
            medical_conditions=enc_conditions,
            doctor_restrictions=enc_restrictions,
        )
        db.add(profile)
    else:
        profile.age = payload.age
        profile.pregnancy_week = payload.pregnancy_week
        profile.trimester = trimester
        profile.diet_preference = payload.diet_preference
        profile.allergies = enc_allergies
        profile.medical_conditions = enc_conditions
        profile.doctor_restrictions = enc_restrictions

    db.commit()

    return ProfileResponse(
        age=profile.age,
        pregnancy_week=profile.pregnancy_week,
        trimester=profile.trimester,
        diet_preference=profile.diet_preference,
        allergies=payload.allergies,
        medical_conditions=payload.medical_conditions,
        doctor_restrictions=payload.doctor_restrictions,
    )


@router.get("", response_model=ProfileResponse | None)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(PregnancyProfile).filter(PregnancyProfile.user_id == current_user.id).first()
    if profile is None:
        return None

    allergies = json.loads(field_crypto.decrypt(profile.allergies) or "[]")
    conditions = json.loads(field_crypto.decrypt(profile.medical_conditions) or "[]")
    restrictions = field_crypto.decrypt(profile.doctor_restrictions)

    return ProfileResponse(
        age=profile.age,
        pregnancy_week=profile.pregnancy_week,
        trimester=profile.trimester,
        diet_preference=profile.diet_preference,
        allergies=allergies,
        medical_conditions=conditions,
        doctor_restrictions=restrictions,
    )
