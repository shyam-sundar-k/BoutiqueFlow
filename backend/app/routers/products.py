from typing import List

from fastapi import APIRouter, HTTPException
from app.database import SessionLocal
from app.models.product import Product
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("")
def create_product(product: ProductCreate):
    db = SessionLocal()

    new_product = Product(
        product_name=product.product_name,
        category=product.category,
        size=product.size,
        purchase_price=product.purchase_price,
        selling_price=product.selling_price,
        stock_quantity=product.stock_quantity,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    db.close()

    return {
        "message": "Product added successfully!",
        "product_id": new_product.id
    }


@router.get("", response_model=List[ProductResponse])
def get_products():
    db = SessionLocal()

    products = db.query(Product).all()

    db.close()

    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int):
    db = SessionLocal()

    product = db.query(Product).filter(Product.id == product_id).first()

    db.close()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, updated_product: ProductUpdate):
    db = SessionLocal()

    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.product_name = updated_product.product_name
    product.category = updated_product.category
    product.size = updated_product.size
    product.purchase_price = updated_product.purchase_price
    product.selling_price = updated_product.selling_price
    product.stock_quantity = updated_product.stock_quantity

    db.commit()
    db.refresh(product)
    db.close()

    return product


@router.delete("/{product_id}")
def delete_product(product_id: int):
    db = SessionLocal()

    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()
    db.close()

    return {
        "message": "Product deleted successfully!"
    }