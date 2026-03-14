from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class PregnancyProfile(Base):
    __tablename__ = "pregnancy_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)

    age: Mapped[int] = mapped_column(Integer, nullable=False)
    pregnancy_week: Mapped[int] = mapped_column(Integer, nullable=False)
    trimester: Mapped[int] = mapped_column(Integer, nullable=False)
    diet_preference: Mapped[str] = mapped_column(String(20), nullable=False)
    allergies: Mapped[str] = mapped_column(Text, default="")
    medical_conditions: Mapped[str] = mapped_column(Text, default="")
    doctor_restrictions: Mapped[str] = mapped_column(Text, default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")
