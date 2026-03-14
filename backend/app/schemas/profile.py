from pydantic import BaseModel, Field


class ProfileUpsertRequest(BaseModel):
    age: int = Field(ge=13, le=55)
    pregnancy_week: int = Field(ge=1, le=42)
    diet_preference: str
    allergies: list[str] = []
    medical_conditions: list[str] = []
    doctor_restrictions: str = ""


class ProfileResponse(BaseModel):
    age: int
    pregnancy_week: int
    trimester: int
    diet_preference: str
    allergies: list[str]
    medical_conditions: list[str]
    doctor_restrictions: str
