from sqlalchemy.orm import Session
from modelo import Movie
from plantilla import MovieCreate
from omdb_client import fetch_movie_details

def create_movie(db: Session, movie: MovieCreate, user_id: int):
    # Intentar obtener detalles reales desde OMDb
    api_data = fetch_movie_details(movie.title)

    if api_data:
        new_movie = Movie(
            title=api_data["title"],
            year=api_data["year"],
            director=api_data["director"],
            genre=api_data["genre"],
            poster_url=api_data["poster_url"],
            imdb_id=api_data["imdb_id"],
            owner_id=user_id
        )
    else:
        # Si no encuentra en OMDb, usa datos ingresados
        new_movie = Movie(**movie.dict(), owner_id=user_id)

    db.add(new_movie)
    db.commit()
    db.refresh(new_movie)
    return new_movie

def get_movies_by_user(db: Session, user_id: int):
    return db.query(Movie).filter(Movie.owner_id == user_id).all()

def get_movie(db: Session, movie_id: int, user_id: int):
    return db.query(Movie).filter(Movie.id == movie_id, Movie.owner_id == user_id).first()

def update_movie(db: Session, db_movie: Movie, updates: MovieCreate):
    for key, value in updates.dict().items():
        setattr(db_movie, key, value)
    db.commit()
    db.refresh(db_movie)
    return db_movie

def delete_movie(db: Session, db_movie: Movie):
    db.delete(db_movie)
    db.commit()