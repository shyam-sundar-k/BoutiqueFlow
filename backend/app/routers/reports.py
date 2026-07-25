from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.sale import Sale, SaleItem

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/summary")
def get_report_summary(
    db: Session = Depends(get_db),
):
    now = datetime.now()

    today_start = datetime(now.year, now.month, now.day)

    week_start = today_start - timedelta(days=today_start.weekday())

    month_start = datetime(now.year, now.month, 1)

    # -------------------------
    # Sales Amount
    # -------------------------

    today_sales = (
        db.query(func.coalesce(func.sum(Sale.total_amount), 0))
        .filter(Sale.sale_date >= today_start)
        .scalar()
    )

    week_sales = (
        db.query(func.coalesce(func.sum(Sale.total_amount), 0))
        .filter(Sale.sale_date >= week_start)
        .scalar()
    )

    month_sales = (
        db.query(func.coalesce(func.sum(Sale.total_amount), 0))
        .filter(Sale.sale_date >= month_start)
        .scalar()
    )

    # -------------------------
    # Items Sold
    # -------------------------

    today_items = (
        db.query(func.coalesce(func.sum(SaleItem.quantity), 0))
        .join(Sale)
        .filter(Sale.sale_date >= today_start)
        .scalar()
    )

    week_items = (
        db.query(func.coalesce(func.sum(SaleItem.quantity), 0))
        .join(Sale)
        .filter(Sale.sale_date >= week_start)
        .scalar()
    )

    month_items = (
        db.query(func.coalesce(func.sum(SaleItem.quantity), 0))
        .join(Sale)
        .filter(Sale.sale_date >= month_start)
        .scalar()
    )

    return {
        "today_sales": float(today_sales),
        "week_sales": float(week_sales),
        "month_sales": float(month_sales),
        "today_items": today_items,
        "week_items": week_items,
        "month_items": month_items,
    }