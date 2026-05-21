from os import name
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# 1. Define allowed origins
origins = [
    "http://localhost:3000",   # React default
    "http://localhost:8000",   # React default
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

print("Setup Completed !")

if __name__ == "main":
    