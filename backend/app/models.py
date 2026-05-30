from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    category = Column(String)

    amount = Column(Float)

    merchant = Column(String)

    payment_method = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)