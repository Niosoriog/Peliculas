const API_BASE = "http://127.0.0.1:8000";

const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const authStatus = document.getElementById("auth-status");

const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

const movieForm = document.getElementById("movie-form");
const movieError = document.getElementById("movie-error");
const moviesGrid = document.getElementById("movies-grid");
const logoutBtn = document.getElementById("logout-btn");
const loginTitle = document.getElementById("login-title");
const nameGroup = document.getElementById("name-group");
const passwordConfirmGroup = document.getElementById("password-confirm-group");
const toggleModeBtn = document.getElementById("toggle-mode");
const loginSubmitBtn = document.getElementById("login-submit");

let isRegisterMode = false;
let accessToken = null;

// --------- Helpers ---------

function setAuthenticated(state, email = "") {
  if (state) {
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    authStatus.textContent = `Conectado como ${email}`;
    logoutBtn.classList.remove("hidden");  // ← Mostrar botón
  } else {
    loginSection.classList.remove("hidden");
    appSection.classList.add("hidden");
    authStatus.textContent = "No autenticado";
    logoutBtn.classList.add("hidden");     // ← Ocultar botón
  }
}
function getAuthHeader() {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

function renderMovies(movies) {
  moviesGrid.innerHTML = "";

  if (!movies.length) {
    moviesGrid.innerHTML =
      '<p class="text-gray-400 col-span-full">Aún no hay películas registradas.</p>';
    return;
  }

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className =
      "bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col";

    const poster =
      movie.poster_url && movie.poster_url !== "N/A"
        ? movie.poster_url
        : "https://via.placeholder.com/300x450?text=Sin+Póster";

    card.innerHTML = `
      <img
        src="${poster}"
        alt="${movie.title}"
        class="w-full h-64 object-cover"
      />
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-semibold mb-1">${movie.title}</h3>
          <p class="text-sm text-gray-300 mb-1">
            <span class="font-semibold">Año:</span> ${movie.year || "-"}
          </p>
          <p class="text-sm text-gray-300 mb-1">
            <span class="font-semibold">Director:</span> ${movie.director || "-"}
          </p>
          <p class="text-xs text-gray-400 mb-2">
            <span class="font-semibold">Género:</span> ${movie.genre || "-"}
          </p>
          ${
            movie.imdb_id
              ? `<a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank" class="text-xs text-yellow-400 hover:underline">Ver en IMDb</a>`
              : ""
          }
        </div>
        <div class="mt-3 flex justify-end">
          <button
            onclick="deleteMovie(${movie.id})"
            class="text-xs px-3 py-1 rounded bg-red-500 text-white hover:bg-red-400 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    `;
    moviesGrid.appendChild(card);
  });
}
// --------- Peticiones a la API ---------

async function login(email, password) {
  loginError.classList.add("hidden");
  loginError.textContent = "";

  const body = new URLSearchParams({
    username: email, // OAuth2PasswordRequestForm usa "username"
    password: password,
  });

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    loginError.textContent = "Credenciales incorrectas";
    loginError.classList.remove("hidden");
    throw new Error("Login failed");
  }

  const data = await res.json();
  accessToken = data.access_token;
  localStorage.setItem("token", accessToken);
  localStorage.setItem("email", email);
  setAuthenticated(true, email);
  await loadMovies();
}
async function register(name, email, password) {
  loginError.classList.add("hidden");
  loginError.textContent = "";

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const txt = await res.text();
    loginError.textContent =
      res.status === 400
        ? "El correo ya está registrado."
        : "No se pudo crear la cuenta.";
    loginError.classList.remove("hidden");
    console.error("Error register:", txt);
    throw new Error("Register failed");
  }
}

async function loadMovies() {
  movieError.classList.add("hidden");
  movieError.textContent = "";

  const res = await fetch(`${API_BASE}/movies/`, {
    headers: {
      ...getAuthHeader(),
    },
  });

  if (res.status === 401) {
    setAuthenticated(false);
    return;
  }

  const data = await res.json();
  renderMovies(data);
}

async function addMovie(title) {
  movieError.classList.add("hidden");
  movieError.textContent = "";

  const body = {
    title: title,
    year: 0,
    director: "",
    genre: "",
  };

  const res = await fetch(`${API_BASE}/movies/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    movieError.textContent = "No se pudo agregar la película.";
    movieError.classList.remove("hidden");
    throw new Error("Add movie failed");
  }

  await loadMovies();
}
async function deleteMovie(movieId) {
  movieError.classList.add("hidden");
  movieError.textContent = "";

  const confirmar = confirm("¿Seguro que deseas eliminar esta película?");
  if (!confirmar) return;

  const res = await fetch(`${API_BASE}/movies/${movieId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    movieError.textContent = "No se pudo eliminar la película.";
    movieError.classList.remove("hidden");
    console.error("Error al eliminar:", await res.text());
    return;
  }

  // Recargar la lista después de eliminar
  await loadMovies();
}

// --------- Eventos ---------

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const passwordConfirm = document
    .getElementById("password-confirm")
    .value.trim();

  try {
    if (isRegisterMode) {
      if (!name) {
        loginError.textContent = "El nombre es obligatorio.";
        loginError.classList.remove("hidden");
        return;
      }
      if (password !== passwordConfirm) {
        loginError.textContent = "Las contraseñas no coinciden.";
        loginError.classList.remove("hidden");
        return;
      }

      await register(name, email, password);
      // Después de registrar, iniciamos sesión automáticamente
      await login(email, password);
    } else {
      await login(email, password);
    }
  } catch (err) {
    console.error(err);
  }
});

movieForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titleInput = document.getElementById("movie-title");
  const title = titleInput.value.trim();
  if (!title) return;
  try {
    await addMovie(title);
    titleInput.value = "";
  } catch (err) {
    console.error(err);
  }
});

// --------- Auto-login si hay token guardado ---------

window.addEventListener("DOMContentLoaded", async () => {
  const savedToken = localStorage.getItem("token");
  const savedEmail = localStorage.getItem("email");
  if (savedToken && savedEmail) {
    accessToken = savedToken;
    setAuthenticated(true, savedEmail);
    await loadMovies();
  }
});

// Salir de la sesion 
logoutBtn.addEventListener("click", () => {
  // Borrar token y email del navegador
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  accessToken = null;

  // Volver al estado inicial
  setAuthenticated(false);

  // Limpiar películas mostradas
  moviesGrid.innerHTML = "";

  alert("Sesión cerrada correctamente");
});
// Inicios de sesion ? 
toggleModeBtn.addEventListener("click", () => {
  isRegisterMode = !isRegisterMode;

  if (isRegisterMode) {
    loginTitle.textContent = "Crear cuenta";
    loginSubmitBtn.textContent = "Registrarme";
    toggleModeBtn.textContent = "¿Ya tienes cuenta? Inicia sesión";
    nameGroup.classList.remove("hidden");
    passwordConfirmGroup.classList.remove("hidden");
  } else {
    loginTitle.textContent = "Iniciar sesión";
    loginSubmitBtn.textContent = "Ingresar";
    toggleModeBtn.textContent = "¿No tienes cuenta? Crear cuenta";
    nameGroup.classList.add("hidden");
    passwordConfirmGroup.classList.add("hidden");
  }
  loginError.classList.add("hidden");
  loginError.textContent = "";
});
