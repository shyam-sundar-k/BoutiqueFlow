from sqlalchemy import (
    Column,
    Integer,
    Numeric,
    DateTime,
    ForeignKey,
    text,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)

    # Total before discount
    subtotal = Column(
        Numeric(10, 2),
        nullable=False,
    )

    # Final amount after discount
    total_amount = Column(
        Numeric(10, 2),
        nullable=False,
    )

    sale_date = Column(
        DateTime,
        server_default=text("CURRENT_TIMESTAMP"),
    )

    items = relationship(
        "SaleItem",
        back_populates="sale",
        cascade="all, delete-orphan",
    )


class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(Integer, primary_key=True, index=True)

    sale_id = Column(
        Integer,
        ForeignKey("sales.id", ondelete="CASCADE"),
        nullable=False,
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
    )

    price = Column(
        Numeric(10, 2),
        nullable=False,
    )

    sale = relationship(
        "Sale",
        back_populates="items",
    )