from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from schemas import Signup, Login, UserOut
import crud
from auth import verify_password, generate_token
from fastapi.middleware.cors import CORSMiddleware
import os
from schemas import UpdateUser

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI Raw Auth")

# Configure CORS origins from environment with safe defaults for development.
# Set FRONTEND_ORIGINS env var as a comma-separated list if you need to allow other origins.
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
origins = os.getenv("FRONTEND_ORIGINS")
if origins:
    allow_origins = [o.strip() for o in origins.split(",") if o.strip()]
else:
    allow_origins = default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# SIGNUP
@app.post("/signup", response_model=UserOut)
def signup(data: Signup, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, data.email):
        raise HTTPException(400, "Email already exists")
    return crud.create_user(db, data.name, data.email, data.password)

# LOGIN (RAW TOKEN)
@app.post("/login")
def login(data: Login, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")

    token = generate_token()
    user.token = token
    db.commit()

    return {"token": token}


# Get current user
@app.get("/me", response_model=UserOut)
def me(token: str = Header(...), db: Session = Depends(get_db)):
    user = crud.get_user_by_token(db, token)
    if not user:
        raise HTTPException(401, "Invalid token")
    return user


# Update current user
@app.put("/users/me", response_model=UserOut)
def update_me(data: UpdateUser, token: str = Header(...), db: Session = Depends(get_db)):
    user = crud.get_user_by_token(db, token)
    if not user:
        raise HTTPException(401, "Invalid token")
    # only allow updating own record
    updated = crud.update_user(db, user, name=data.name, email=data.email, password=data.password)
    return updated


# Delete current user
@app.delete("/users/me")
def delete_me(token: str = Header(...), db: Session = Depends(get_db)):
    user = crud.get_user_by_token(db, token)
    if not user:
        raise HTTPException(401, "Invalid token")
    crud.delete_user(db, user)
    return {"ok": True}


# Signout (invalidate token)
@app.post("/signout")
def signout(token: str = Header(...), db: Session = Depends(get_db)):
    user = crud.get_user_by_token(db, token)
    if not user:
        raise HTTPException(401, "Invalid token")
    crud.signout_user(db, user)
    return {"ok": True}

# PROTECTED – LIST USERS
@app.get("/users", response_model=list[UserOut])
def users(
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_token(db, token)
    if not user:
        raise HTTPException(401, "Invalid token")

    return crud.get_users(db)
