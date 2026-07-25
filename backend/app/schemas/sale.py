from datetime import datetime
from decimal import Decimal
from typing import List

from pydantic import BaseModel, ConfigDict


class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal


class SaleCreate(BaseModel):
    subtotal: Decimal
    total_amount: Decimal
    payment_method: str
    items: List[SaleItemCreate]


class SaleItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    model_config = ConfigDict(from_attributes=True)


class SaleResponse(BaseModel):
    id: int
    invoice_number: str
    subtotal: Decimal
    total_amount: Decimal
    payment_method: str
    created_at: datetime
    items: List[SaleItemResponse]

    model_config = ConfigDict(from_attributes=True)