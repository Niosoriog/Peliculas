from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud_movies import create_movie, get_movies_by_user, get_movie, update_movie, delete_movie
from plantilla import MovieCreate, MovieResponse
from security import get_current_user
from database import SessionLocal

router = APIRouter(prefix="/movies", tags=["Movies"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=MovieResponse)
def add_movie(movie: MovieCreate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return create_movie(db, movie, user.id)


@router.get("/", response_model=list[MovieResponse])
def list_movies(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return get_movies_by_user(db, user.id)


@router.get("/{movie_id}", response_model=MovieResponse)
def get_movie_details(movie_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    db_movie = get_movie(db, movie_id, user.id)
    if not db_movie:
        raise HTTPException(status_code=404, detail="Película no encontrada.")
    return db_movie


@router.put("/{movie_id}", response_model=MovieResponse)
def update_movie_details(movie_id: int, updates: MovieCreate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    db_movie = get_movie(db, movie_id, user.id)
    if not db_movie:
        raise HTTPException(status_code=404, detail="Película no encontrada.")
    return update_movie(db, db_movie, updates)


@router.delete("/{movie_id}")
def remove_movie(movie_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    db_movie = get_movie(db, movie_id, user.id)
    if not db_movie:
        raise HTTPException(status_code=404, detail="Película no encontrada.")
    delete_movie(db, db_movie)
    return {"detail": "Película eliminada correctamente."}