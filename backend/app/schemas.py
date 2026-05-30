from pydantic import BaseModel
from datetime import datetime


class TransactionCreate(BaseModel):
    category: str
    amount: float
    merchant: str
    payment_method: str


class TransactionResponse(TransactionCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True