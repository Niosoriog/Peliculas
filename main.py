from fastapi import FastAPI
from database import Base, engine
import modelo

from auth import router as auth_router
from sec_users import router as register_router
from ruta_movies import router as movies_router  
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(auth_router)       # /auth/login
app.include_router(register_router)   # /auth/register
app.include_router(movies_router)     # /movies/*

@app.get("/")
def root():
    return {"message": "API Catálogo de Películas funcionando"}