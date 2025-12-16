from sqlalchemy.orm import Session
from models import User
from auth import hash_password

def create_user(db: Session, name, email, password):
    user = User(
        name=name,
        email=email,
        hashed_password=hash_password(password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email):
    return db.query(User).filter(User.email == email).first()

def get_user_by_token(db: Session, token):
    return db.query(User).filter(User.token == token).first()

def get_users(db: Session):
    return db.query(User).all()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def update_user(db: Session, user: User, *, name=None, email=None, password=None):
    updated = False
    if name is not None:
        user.name = name
        updated = True
    if email is not None:
        user.email = email
        updated = True
    if password is not None:
        user.hashed_password = hash_password(password)
        updated = True
    if updated:
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def delete_user(db: Session, user: User):
    db.delete(user)
    db.commit()


def signout_user(db: Session, user: User):
    user.token = None
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
