from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine
from app.routers.products import router as product_router

app = FastAPI(
    title="Sri Annur Readymades POS",
    version="1.0.0"
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


app.include_router(product_router)