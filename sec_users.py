from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from modelo import User
from plantilla import UserCreate, UserResponse
import bcrypt

router = APIRouter(prefix="/auth", tags=["Auth"])

def create_user(db: Session, user: UserCreate):
    # Verificar si el email ya existe
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        return None

    # Hashear la contraseña
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    # Crear objeto User
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password.decode('utf-8')
    )

    # Guardarlo en la BD
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user