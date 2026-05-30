from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Transaction
from schemas import TransactionCreate, TransactionResponse

router = APIRouter()


# DATABASE SESSION
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ADD TRANSACTION API
@router.post(
    "/transactions",
    response_model=TransactionResponse
)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db)
):
    transaction = Transaction(
        category=data.category,
        amount=data.amount,
        merchant=data.merchant,
        payment_method=data.payment_method
    )

    db.add(transaction)

    db.commit()

    db.refresh(transaction)

    return transaction


# GET ALL TRANSACTIONS API
@router.get(
    "/transactions",
    response_model=list[TransactionResponse]
)
def get_transactions(
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).all()

    return transactions