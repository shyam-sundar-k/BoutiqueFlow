from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import Base, engine

# Import models so SQLAlchemy registers them
from app.models.product import Product
from app.models.sale import Sale, SaleItem
from app.models.settings import Settings   # NEW

from app.routers.products import router as product_router
from app.routers.dashboard import router as dashboard_router
from app.routers.sales import router as sales_router
from app.routers.barcode import router as barcode_router
from app.routers import reports
from app.routers import settings          # NEW

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sri Annur Readymades POS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # We'll tighten this later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to Sri Annur Readymades POS!"
    }


@app.get("/test-db")
def test_database():
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT 'Database Connected Successfully!'")
        )
        return {"message": result.scalar()}


app.include_router(dashboard_router)
app.include_router(product_router)
app.include_router(sales_router)
app.include_router(reports.router)
app.include_router(settings.router)       # NEW
app.include_router(barcode_router)