from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.settings import Settings
from app.schemas.settings import (
    SettingsUpdate,
    SettingsResponse,
)

router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


@router.get(
    "/",
    response_model=SettingsResponse,
)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(Settings).first()

    if not settings:
        settings = Settings(
            boutique_name="Sri Annur Readymades",
            owner_name="",
            address="",
            phone="",
            email="",
            gst_number="",
        )

        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings


@router.put(
    "/",
    response_model=SettingsResponse,
)
def update_settings(
    data: SettingsUpdate,
    db: Session = Depends(get_db),
):
    settings = db.query(Settings).first()

    if not settings:
        settings = Settings()

        db.add(settings)

    settings.boutique_name = data.boutique_name
    settings.owner_name = data.owner_name
    settings.address = data.address
    settings.phone = data.phone
    settings.email = data.email
    settings.gst_number = data.gst_number

    db.commit()
    db.refresh(settings)

    return settings