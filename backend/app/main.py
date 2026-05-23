from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.upload import csv_router
from app.api.analysis import analyze_router
from app.api.planner import planner_router
from app.api.data_preview import preview_router
from app.api.delete_data import rm_file_router
import uvicorn

app = FastAPI()
app.include_router(router=csv_router, prefix="/api/v1")
app.include_router(router=analyze_router, prefix="/api/v1")
app.include_router(router=planner_router, prefix="/api/v1")
app.include_router(router=preview_router, prefix="/api/v1")
app.include_router(router=rm_file_router, prefix="/api/v1")

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
