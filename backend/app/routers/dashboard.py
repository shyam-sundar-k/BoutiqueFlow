from fastapi import APIRouter
from sqlalchemy import text

from app.database import engine

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard")
def get_dashboard():
    with engine.connect() as connection:

        summary = connection.execute(
            text("""
                SELECT
                    COUNT(*) AS total_products,
                    COALESCE(SUM(stock_quantity),0) AS total_stock,
                    COALESCE(SUM(stock_quantity * selling_price),0) AS inventory_value,
                    COUNT(CASE WHEN stock_quantity < 5 THEN 1 END) AS low_stock
                FROM products
            """)
        ).mappings().first()

        low_stock_products = connection.execute(
            text("""
                SELECT
                    id,
                    product_name,
                    stock_quantity
                FROM products
                WHERE stock_quantity < 5
                ORDER BY stock_quantity ASC
            """)
        ).mappings().all()

        recent_products = connection.execute(
            text("""
                SELECT
                    id,
                    product_name,
                    created_at
                FROM products
                ORDER BY created_at DESC
                LIMIT 5
            """)
        ).mappings().all()

    return {
        "summary": summary,
        "low_stock_products": low_stock_products,
        "recent_products": recent_products,
    }