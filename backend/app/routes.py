from fastapi.responses import FileResponse
from models import User
from schemas import UserCreate, UserResponse
import pandas as pd

from reportlab.platypus import (
    SimpleDocTemplate,
    Table
)
from models import (
    Transaction,
    Budget,
    SavingsGoal
)

from schemas import (
    TransactionCreate,
    TransactionResponse,
    BudgetCreate,
    BudgetResponse,
    SavingsGoalCreate,
    SavingsGoalResponse
)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Transaction
from schemas import TransactionCreate, TransactionResponse

router = APIRouter()


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


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
        payment_method=data.payment_method,
        transaction_type=data.transaction_type
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction


@router.get(
    "/transactions",
    response_model=list[TransactionResponse]
)
def get_transactions(
    db: Session = Depends(get_db)
):
    transactions = (
        db.query(Transaction)
        .order_by(Transaction.id.desc())
        .all()
    )

    return transactions


@router.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    transaction = (
        db.query(Transaction)
        .filter(Transaction.id == transaction_id)
        .first()
    )

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    db.delete(transaction)
    db.commit()

    return {
        "message": "Transaction deleted successfully"
    }
@router.put(
    "/transactions/{transaction_id}",
    response_model=TransactionResponse
)
def update_transaction(
    transaction_id: int,
    data: TransactionCreate,
    db: Session = Depends(get_db)
):
    transaction = (
        db.query(Transaction)
        .filter(Transaction.id == transaction_id)
        .first()
    )

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    transaction.category = data.category
    transaction.amount = data.amount
    transaction.merchant = data.merchant
    transaction.payment_method = data.payment_method
    transaction.transaction_type = data.transaction_type

    db.commit()
    db.refresh(transaction)

    return transaction
from models import Budget, SavingsGoal
from schemas import (
    BudgetCreate,
    BudgetResponse,
    SavingsGoalCreate,
    SavingsGoalResponse
)


# ------------------------
# BUDGET
# ------------------------

@router.post(
    "/budget",
    response_model=BudgetResponse
)
def set_budget(
    data: BudgetCreate,
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).first()

    if budget:
        budget.monthly_budget = data.monthly_budget
    else:
        budget = Budget(
            monthly_budget=data.monthly_budget
        )
        db.add(budget)

    db.commit()
    db.refresh(budget)

    return budget


@router.get(
    "/budget",
    response_model=BudgetResponse
)
def get_budget(
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).first()

    if not budget:
        budget = Budget(
            monthly_budget=0
        )

        db.add(budget)
        db.commit()
        db.refresh(budget)

    return budget


# ------------------------
# SAVINGS GOAL
# ------------------------

@router.post(
    "/goal",
    response_model=SavingsGoalResponse
)
def set_goal(
    data: SavingsGoalCreate,
    db: Session = Depends(get_db)
):
    goal = db.query(SavingsGoal).first()

    if goal:
        goal.goal_amount = data.goal_amount
    else:
        goal = SavingsGoal(
            goal_amount=data.goal_amount
        )

        db.add(goal)

    db.commit()
    db.refresh(goal)

    return goal


@router.get(
    "/goal",
    response_model=SavingsGoalResponse
)
def get_goal(
    db: Session = Depends(get_db)
):
    goal = db.query(SavingsGoal).first()

    if not goal:
        goal = SavingsGoal(
            goal_amount=0
        )

        db.add(goal)
        db.commit()
        db.refresh(goal)

    return goal


# ------------------------
# ANALYTICS
# ------------------------

@router.get("/analytics")
def analytics(
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).all()

    income = sum(
        t.amount
        for t in transactions
        if t.transaction_type == "Income"
    )

    expense = sum(
        t.amount
        for t in transactions
        if t.transaction_type == "Expense"
    )

    balance = income - expense

    return {
        "income": income,
        "expense": expense,
        "balance": balance
    }


# ------------------------
# HEALTH SCORE
# ------------------------

@router.get("/health-score")
def health_score(
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).all()

    income = sum(
        t.amount
        for t in transactions
        if t.transaction_type == "Income"
    )

    expense = sum(
        t.amount
        for t in transactions
        if t.transaction_type == "Expense"
    )

    if income == 0:
        score = 0
    else:
        score = max(
            0,
            min(
                100,
                int(((income - expense) / income) * 100)
            )
        )

    return {
        "score": score
    }
# ==================================
# BUDGET APIs
# ==================================

@router.post(
    "/budget",
    response_model=BudgetResponse
)
def set_budget(
    data: BudgetCreate,
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).first()

    if budget:
        budget.monthly_budget = data.monthly_budget
    else:
        budget = Budget(
            monthly_budget=data.monthly_budget
        )
        db.add(budget)

    db.commit()
    db.refresh(budget)

    return budget


@router.get(
    "/budget",
    response_model=BudgetResponse
)
def get_budget(
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).first()

    if not budget:
        budget = Budget(
            monthly_budget=0
        )

        db.add(budget)
        db.commit()
        db.refresh(budget)

    return budget


# ==================================
# SAVINGS GOAL APIs
# ==================================

@router.post(
    "/goal",
    response_model=SavingsGoalResponse
)
def set_goal(
    data: SavingsGoalCreate,
    db: Session = Depends(get_db)
):
    goal = db.query(SavingsGoal).first()

    if goal:
        goal.goal_amount = data.goal_amount
    else:
        goal = SavingsGoal(
            goal_amount=data.goal_amount
        )
        db.add(goal)

    db.commit()
    db.refresh(goal)

    return goal


@router.get(
    "/goal",
    response_model=SavingsGoalResponse
)
def get_goal(
    db: Session = Depends(get_db)
):
    goal = db.query(SavingsGoal).first()

    if not goal:
        goal = SavingsGoal(
            goal_amount=0
        )

        db.add(goal)
        db.commit()
        db.refresh(goal)

    return goal


# ==================================
# ANALYTICS API
# ==================================

@router.get("/analytics")
def analytics(
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).all()

    income = sum(
        t.amount
        for t in transactions
        if t.transaction_type == "Income"
    )

    expense = sum(
        t.amount
        for t in transactions
        if t.transaction_type == "Expense"
    )

    balance = income - expense

    return {
        "income": income,
        "expense": expense,
        "balance": balance
    }


# ==================================
# FINANCIAL HEALTH SCORE API
# ==================================

@router.get("/health-score")
def health_score(
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).all()

    income = sum(
        t.amount
        for t in transactions
        if t.transaction_type == "Income"
    )

    expense = sum(
        t.amount
        for t in transactions
        if t.transaction_type == "Expense"
    )

    if income == 0:
        score = 0
    else:
        score = max(
            0,
            min(
                100,
                int(
                    ((income - expense) / income)
                    * 100
                )
            )
        )

    return {
        "score": score
    }
@router.get("/export/excel")
def export_excel(
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).all()

    data = []

    for t in transactions:
        data.append({
            "Category": t.category,
            "Amount": t.amount,
            "Merchant": t.merchant,
            "Payment Method": t.payment_method,
            "Type": t.transaction_type,
            "Date": t.created_at
        })

    df = pd.DataFrame(data)

    file_name = "transactions.xlsx"

    df.to_excel(
        file_name,
        index=False
    )

    return FileResponse(
        file_name,
        filename=file_name
    )


@router.get("/export/pdf")
def export_pdf(
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).all()

    file_name = "transactions.pdf"

    pdf = SimpleDocTemplate(file_name)

    data = [[
        "Category",
        "Amount",
        "Merchant",
        "Type"
    ]]

    for t in transactions:
        data.append([
            t.category,
            str(t.amount),
            t.merchant,
            t.transaction_type
        ])

    table = Table(data)

    pdf.build([table])

    return FileResponse(
        file_name,
        filename=file_name
    )
@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    data: UserCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user = User(
        username=data.username,
        email=data.email,
        password=data.password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
@router.post("/login")
def login(
    data: UserCreate,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(
            User.email == data.email,
            User.password == data.password
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    return {
        "message": "Login Success",
        "user_id": user.id
    }