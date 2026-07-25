from pydantic import BaseModel


class BarcodePrintItem(BaseModel):
    product_id: int
    copies: int