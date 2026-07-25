from io import BytesIO
import base64
from typing import List

import barcode
from barcode.writer import ImageWriter

from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse

from app.database import SessionLocal
from app.models.product import Product
from app.schemas.barcode import BarcodePrintItem

router = APIRouter(prefix="/barcode", tags=["Barcode"])


@router.get("/products/list")
def barcode_products():
    db = SessionLocal()

    products = (
        db.query(Product)
        .order_by(Product.product_name)
        .all()
    )

    db.close()

    return products


@router.get("/{product_id}", response_class=HTMLResponse)
def print_barcode(product_id: int):
    db = SessionLocal()

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    db.close()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    code128 = barcode.get(
        "code128",
        product.barcode,
        writer=ImageWriter(),
    )

    buffer = BytesIO()

    code128.write(
        buffer,
        options={
            "write_text": False,
            "module_width": 0.35,
            "module_height": 18,
            "quiet_zone": 2,
        },
    )

    image = base64.b64encode(buffer.getvalue()).decode()

    html = f"""
<!DOCTYPE html>
<html>

<head>

<title>Barcode</title>

<style>

body {{
    font-family: Arial;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f5f5f5;
}}

.label {{
    width: 260px;
    border: 1px solid black;
    padding: 15px;
    text-align: center;
    background: white;
}}

.shop {{
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}}

.barcode {{
    width: 220px;
}}

.number {{
    font-size: 18px;
    font-weight: bold;
    margin-top: 8px;
}}

.price {{
    font-size: 22px;
    font-weight: bold;
    margin-top: 10px;
}}

@media print {{

body {{
    background: white;
}}

.label {{
    border: none;
}}

}}

</style>

</head>

<body onload="window.print()">

<div class="label">

<div class="shop">
Sri Annur Readymades
</div>

<img
class="barcode"
src="data:image/png;base64,{image}"
>

<div class="number">
{product.barcode}
</div>

<div class="price">
₹{product.selling_price}
</div>

</div>

</body>

</html>
"""

    return HTMLResponse(html)


@router.post("/print-labels", response_class=HTMLResponse)
def print_multiple_labels(items: List[BarcodePrintItem]):
    db = SessionLocal()

    labels = ""

    for item in items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if product is None:
            continue

        code128 = barcode.get(
            "code128",
            product.barcode,
            writer=ImageWriter(),
        )

        buffer = BytesIO()

        code128.write(
            buffer,
            options={
                "write_text": False,
                "module_width": 0.35,
                "module_height": 18,
                "quiet_zone": 2,
            },
        )

        image = base64.b64encode(buffer.getvalue()).decode()

        for _ in range(item.copies):
            labels += f"""
<div class="label">

<div class="shop">
Sri Annur Readymades
</div>

<img
class="barcode"
src="data:image/png;base64,{image}"
>

<div class="number">
{product.barcode}
</div>

<div class="price">
₹{product.selling_price}
</div>

</div>
"""

    db.close()

    html = f"""
<!DOCTYPE html>
<html>

<head>

<title>Print Labels</title>

<style>

body {{
    margin: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    font-family: Arial;
}}

.label {{
    width: 240px;
    border: 1px solid black;
    padding: 10px;
    text-align: center;
    page-break-inside: avoid;
}}

.shop {{
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
}}

.barcode {{
    width: 210px;
}}

.number {{
    font-size: 16px;
    font-weight: bold;
    margin-top: 5px;
}}

.price {{
    font-size: 22px;
    font-weight: bold;
    margin-top: 8px;
}}

@media print {{

.label {{
    border: none;
}}

}}

</style>

</head>

<body onload="window.print()">

{labels}

</body>

</html>
"""

    return HTMLResponse(html)