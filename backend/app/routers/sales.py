from decimal import Decimal

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.models.sale import Sale, SaleItem
from app.schemas.sale import SaleCreate

router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)


@router.post("/")
def create_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db),
):
    calculated_subtotal = Decimal("0.00")

    # Create sale header
    new_sale = Sale(
        subtotal=sale.subtotal,
        total_amount=sale.total_amount,
    )

    db.add(new_sale)
    db.flush()

    # Save sale items
    for item in sale.items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found",
            )

        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.product_name}",
            )

        line_total = (
            Decimal(str(product.selling_price))
            * item.quantity
        )

        calculated_subtotal += line_total

        sale_item = SaleItem(
            sale_id=new_sale.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.selling_price,
        )

        db.add(sale_item)

        # Reduce stock
        product.stock_quantity -= item.quantity

    # Validate subtotal
    if calculated_subtotal != Decimal(str(sale.subtotal)):
        raise HTTPException(
            status_code=400,
            detail="Invalid subtotal.",
        )

    db.commit()
    db.refresh(new_sale)

    return {
        "message": "Sale completed successfully",
        "sale_id": new_sale.id,
        "invoice_number": f"INV-{new_sale.id:06d}",
        "subtotal": new_sale.subtotal,
        "total_amount": new_sale.total_amount,
    }


@router.get("/")
def get_all_sales(
    from_date: date | None = Query(None),
    to_date: date | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Sale)

    if from_date:
        query = query.filter(
            Sale.sale_date >= from_date
        )

    if to_date:
        query = query.filter(
            Sale.sale_date < (
                to_date.replace(day=to_date.day)  # keep date type
            )
        )

    sales = (
        query.order_by(Sale.sale_date.desc())
        .all()
    )

    result = []

    for sale in sales:

        total_items = sum(
            item.quantity for item in sale.items
        )

        result.append(
            {
                "id": sale.id,
                "invoice_number": f"INV-{sale.id:06d}",
                "sale_date": sale.sale_date,
                "total_items": total_items,
                "subtotal": sale.subtotal,
                "total_amount": sale.total_amount,
            }
        )

    return result

@router.get("/{sale_id}")
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
):
    sale = (
        db.query(Sale)
        .filter(Sale.id == sale_id)
        .first()
    )

    if not sale:
        raise HTTPException(
            status_code=404,
            detail="Sale not found",
        )

    items = []

    for item in sale.items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        items.append(
            {
                "product_id": item.product_id,
                "product_name": (
                    product.product_name
                    if product
                    else "Unknown Product"
                ),
                "quantity": item.quantity,
                "unit_price": item.price,
                "line_total": item.price * item.quantity,
            }
        )

    return {
        "id": sale.id,
        "invoice_number": f"INV-{sale.id:06d}",
        "subtotal": sale.subtotal,
        "total_amount": sale.total_amount,
        "sale_date": sale.sale_date,
        "items": items,
    }