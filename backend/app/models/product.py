from sqlalchemy import Column, Integer, String, Numeric, DateTime, text
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    product_name = Column(String(100), nullable=False)
    category = Column(String(50))
    size = Column(String(20))

    # NEW
    barcode = Column(String(50), unique=True, nullable=False)

    purchase_price = Column(Numeric(10, 2))
    selling_price = Column(Numeric(10, 2), nullable=False)

    stock_quantity = Column(Integer, nullable=False, default=0)

    created_at = Column(
        DateTime,
        server_default=text("CURRENT_TIMESTAMP"),
    )