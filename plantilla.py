from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True
class MovieCreate(BaseModel):
    title: str
    year: int
    director: str
    genre: str

class MovieResponse(MovieCreate):
    id: int
    poster_url: str | None = None
    imdb_id: str | None = None

    class Config:
        orm_mode = True