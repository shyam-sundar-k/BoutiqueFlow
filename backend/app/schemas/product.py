from decimal import Decimal

from pydantic import BaseModel


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


class ProductResponse(BaseModel):
    id: int
    product_name: str
    category: str
    size: str
    barcode: str
    purchase_price: Decimal
    selling_price: Decimal
    stock_quantity: int

    class Config:
        from_attributes = True