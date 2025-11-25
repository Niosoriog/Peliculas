# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Usaremos SQLite. Se creará un archivo movies.db en la carpeta del proyecto
DATABASE_URL = "sqlite:///./movies.db"

# Motor de conexión a la base de datos
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Sesiones para interactuar con la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base de la que heredarán nuestros modelos (tablas)
Base = declarative_base()