from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.extensions import get_db
from app.user.models import User
from app.user.schemas import UserCreate, UserRead
from app.auth.utils import create_access_token, create_refresh_token, decode_token

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Signup
@router.post("/signup", response_model=UserRead)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = pwd_context.hash(user.password)
    new_user = User(email=user.email, password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# Login
@router.post("/login")
def login(user: UserCreate, response: Response, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": str(db_user.id)})
    refresh_token = create_refresh_token({"sub": str(db_user.id)})

    # Set HttpOnly cookies
    response.set_cookie("access_token", access_token, httponly=True, samesite="lax")
    response.set_cookie("refresh_token", refresh_token, httponly=True, samesite="lax")
    return {"message": "logged in"}


# Refresh token
@router.post("/refresh")
def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    payload = decode_token(token)
    if not payload or payload.get("scope") != "refresh_token":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_access_token({"sub": payload["sub"]})
    response.set_cookie("access_token", new_access_token, httponly=True, samesite="lax")
    return {"message": "token refreshed"}


# Protected route
@router.get("/me", response_model=UserRead)
def me(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")

    user = db.query(User).get(int(payload["sub"]))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
