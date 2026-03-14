from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class ScanRecord(Base):
    __tablename__ = "scan_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    scan_type: Mapped[str] = mapped_column(String(30), nullable=False)  # barcode|ocr|image
    input_value: Mapped[str] = mapped_column(Text, nullable=False)
    detected_food: Mapped[str] = mapped_column(String(255), nullable=False)
    ingredients: Mapped[dict] = mapped_column(JSON, default=list)
    nutrients: Mapped[dict] = mapped_column(JSON, default=dict)
    additives: Mapped[dict] = mapped_column(JSON, default=list)

    classification: Mapped[str] = mapped_column(String(20), nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    rule_hits: Mapped[dict] = mapped_column(JSON, default=list)
    alternatives: Mapped[dict] = mapped_column(JSON, default=list)

    references: Mapped[dict] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="scans")
