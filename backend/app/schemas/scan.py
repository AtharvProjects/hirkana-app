from datetime import datetime
from pydantic import BaseModel


class ScanAnalyzeRequest(BaseModel):
    scan_type: str  # barcode|ocr|image
    payload: str


class ScanResultResponse(BaseModel):
    id: int
    detected_food: str
    classification: str
    explanation: str
    nutrient_insights: list[dict]
    references: list[dict]
    alternatives: list[str]
    rule_hits: list[dict]
    created_at: datetime


class ScanHistoryItem(BaseModel):
    id: int
    detected_food: str
    classification: str
    explanation: str
    created_at: datetime
