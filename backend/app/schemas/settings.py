from pydantic import BaseModel


class SettingsBase(BaseModel):
    boutique_name: str
    owner_name: str
    address: str
    phone: str
    email: str
    gst_number: str


class SettingsUpdate(SettingsBase):
    pass


class SettingsResponse(SettingsBase):
    id: int

    class Config:
        from_attributes = True