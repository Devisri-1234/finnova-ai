from pydantic import BaseModel
from datetime import datetime


class TransactionCreate(BaseModel):
    category: str
    amount: float
    merchant: str
    payment_method: str
    transaction_type: str


class TransactionResponse(TransactionCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# -----------------------
# Budget
# -----------------------

class BudgetCreate(BaseModel):
    monthly_budget: float


class BudgetResponse(BudgetCreate):
    id: int

    class Config:
        from_attributes = True


# -----------------------
# Savings Goal
# -----------------------

class SavingsGoalCreate(BaseModel):
    goal_amount: float


class SavingsGoalResponse(SavingsGoalCreate):
    id: int

    class Config:
        from_attributes = True
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True