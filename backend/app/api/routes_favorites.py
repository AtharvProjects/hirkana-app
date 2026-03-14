from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.favorite import FavoriteFood
from app.models.user import User

router = APIRouter(prefix="/favorites", tags=["favorites"])


class FavoriteCreate(BaseModel):
    food_name: str
    last_classification: str


@router.post("")
def add_favorite(
    payload: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    fav = FavoriteFood(
        user_id=current_user.id,
        food_name=payload.food_name,
        last_classification=payload.last_classification,
    )
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return {"id": fav.id}


@router.get("")
def list_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(FavoriteFood)
        .filter(FavoriteFood.user_id == current_user.id)
        .order_by(FavoriteFood.created_at.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "food_name": r.food_name,
            "last_classification": r.last_classification,
            "created_at": r.created_at,
        }
        for r in rows
    ]


@router.delete("/{favorite_id}")
def delete_favorite(
    favorite_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = db.query(FavoriteFood).filter(FavoriteFood.id == favorite_id, FavoriteFood.user_id == current_user.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(row)
    db.commit()
    return {"ok": True}
