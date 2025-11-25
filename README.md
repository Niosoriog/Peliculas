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

Una pequeña muestra : 
<img width="1363" height="555" alt="image" src="https://github.com/user-attachments/assets/b8cbff5c-f984-4554-9889-1618c4ba0f3e" />
<img width="1356" height="378" alt="image" src="https://github.com/user-attachments/assets/3cd04884-d998-427a-871e-217ceb4d8045" />
<img width="1290" height="672" alt="image" src="https://github.com/user-attachments/assets/c3222aba-94f8-4f8c-a12f-fe780b27c42d" />


