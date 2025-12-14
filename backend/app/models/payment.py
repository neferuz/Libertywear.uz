from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, BigInteger, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class PaymeTransaction(Base):
    __tablename__ = "payme_transactions"

    id = Column(Integer, primary_key=True, index=True)
    payme_transaction_id = Column(String, unique=True, nullable=False, index=True)  # ID от Payme
    merchant_transaction_id = Column(String, unique=True, nullable=True, index=True)  # ID в нашей системе
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    amount = Column(BigInteger, nullable=False)  # Сумма в тийинах
    state = Column(Integer, default=0)  # Состояние транзакции: 0-создана, 1-забронирована, 2-выполнена, -1/-2-отменена
    reason = Column(Integer, nullable=True)  # Причина отмены
    create_time = Column(BigInteger, nullable=False)  # Timestamp создания
    perform_time = Column(BigInteger, nullable=True)  # Timestamp выполнения
    cancel_time = Column(BigInteger, nullable=True)  # Timestamp отмены
    account = Column(JSON, nullable=True)  # Данные счета (phone, order_id и т.д.)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="payme_transactions")
    order = relationship("Order", backref="payme_transactions")

