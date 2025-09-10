from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.extensions import init_db
from app.user.controller import router as user_router

app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB setup
init_db(app)

# Routers
app.include_router(user_router, prefix="/api/users", tags=["users"])
