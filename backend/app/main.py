from typing import Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.upload import csv_router
import uvicorn

app = FastAPI()
app.include_router(router=csv_router, prefix="/api/v1")

# 1. Define allowed origins
origins = [
    "http://localhost:3000",   # React default
    "http://localhost:8000",   # React default
    "http://localhost:5173",   # React default
    "https://yourdomain.com",
]

# 2. Add the middleware to your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # List of allowed origins
    allow_credentials=True,           # Allow cookies and auth headers
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # Allow all headers
)

@app.get("/health")
async def health_check() -> dict[str,str]:
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("app.main:app",reload=True)
