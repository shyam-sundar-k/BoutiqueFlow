from sqlalchemy import Column, Integer, String

from app.database import Base


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)

    boutique_name = Column(String, nullable=False, default="")

    owner_name = Column(String, nullable=True, default="")

    address = Column(String, nullable=True, default="")

    phone = Column(String, nullable=True, default="")

    email = Column(String, nullable=True, default="")

    gst_number = Column(String, nullable=True, default="")