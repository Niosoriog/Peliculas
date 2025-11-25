import requests
import os
from dotenv import load_dotenv

load_dotenv()

OMDB_API_KEY = os.getenv("OMDB_API_KEY")  # Coloca tu API KEY en .env

def fetch_movie_details(title: str):
    url = f"http://www.omdbapi.com/?t={title}&apikey={OMDB_API_KEY}"
    response = requests.get(url)
    data = response.json()

    if data.get("Response") == "True":
        return {
            "title": data.get("Title"),
            "year": int(data.get("Year")),
            "director": data.get("Director"),
            "genre": data.get("Genre"),
            "poster_url": data.get("Poster"),
            "imdb_id": data.get("imdbID")
        }
    return None