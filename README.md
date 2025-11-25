Aplicación web que permite a cada usuario registrarse, iniciar sesión y gestionar su propio catálogo de películas.
Las películas se agregan automáticamente consultando la API pública OMDb, recuperando información como título, año, director, género y póster.

Librerias y herramientas usadas: 
Backend: FastAPI, SQLAlchemy, JWT, OAuth2, SQLite
Frontend: HTML + JavaScript + TailwindCSS
API externa: OMDb API
Autenticación: JWT (Bearer Token)
Base de datos: SQLite

Para correrlo vamos a usar : uvicorn main:app --reload, Es importante inicializar esto, podemos comprobar su estado entrando a : http://127.0.0.1:8000
y vamos a ir a la carpeta de frontend y abrimos index.html.
