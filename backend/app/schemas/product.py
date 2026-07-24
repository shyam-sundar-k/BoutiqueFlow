from pydantic import BaseModel
from decimal import Decimal


class ProductCreate(BaseModel):
    product_name: str
    category: str
    size: str
    purchase_price: Decimal
    selling_price: Decimal
    stock_quantity: int

class ProductUpdate(BaseModel):
    product_name: str
    category: str
    size: str
    purchase_price: Decimal
    selling_price: Decimal
    stock_quantity: int

class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True