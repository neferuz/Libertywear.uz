from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class PaymeTransactionBase(BaseModel):
    payme_transaction_id: str
    merchant_transaction_id: Optional[str] = None
    user_id: int
    order_id: Optional[int] = None
    amount: int  # В тийинах
    state: int = 0
    reason: Optional[int] = None
    create_time: int
    perform_time: Optional[int] = None
    cancel_time: Optional[int] = None
    account: Optional[Dict[str, Any]] = None

class PaymeTransactionCreate(PaymeTransactionBase):
    pass

class PaymeTransactionResponse(PaymeTransactionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Payme API Request/Response schemas
class PaymeRequest(BaseModel):
    method: str
    params: Dict[str, Any]

class PaymeResponse(BaseModel):
    result: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, Any]] = None

class CheckPerformTransactionParams(BaseModel):
    amount: int
    account: Dict[str, Any]

class CreateTransactionParams(BaseModel):
    id: str
    time: int
    amount: int
    account: Dict[str, Any]

class PerformTransactionParams(BaseModel):
    id: str

class CancelTransactionParams(BaseModel):
    id: str
    reason: Optional[int] = None

class CheckTransactionParams(BaseModel):
    id: str

