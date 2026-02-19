// -----------------------------
// auth.js - Login/Register
// -----------------------------

function saveToken(token) {
    localStorage.setItem("token", token);
}

function getToken() {
    return localStorage.getItem("token");
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}

// -----------------------------
// Login
// -----------------------------
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorElem = document.getElementById("error");

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            let message = data.detail || "Erro ao autenticar";
            if (typeof message === "object") message = JSON.stringify(message);
            errorElem.innerText = message;
            return;
        }

        saveToken(data.access_token);
        window.location.href = "/dashboard";
    } catch (err) {
        console.error(err);
        errorElem.innerText = "Erro ao conectar com o servidor";
    }
}

// -----------------------------
// Registro
// -----------------------------
async function registerUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorElem = document.getElementById("error");

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role: "PLAYER" })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            let message = data.detail || "Erro ao registrar usuário";
            if (typeof message === "object") message = JSON.stringify(message);
            errorElem.innerText = message;
            return;
        }

        alert(data.detail || "Conta criada com sucesso!");
        window.location.href = "/login";
    } catch (err) {
        console.error(err);
        errorElem.innerText = "Erro ao conectar com o servidor";
    }
}

// -----------------------------
// Checa autenticação
// -----------------------------
async function checkAuth() {
    const token = getToken();
    if (!token) {
        logout();
        return;
    }

    try {
        const response = await fetch("/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) {
            logout();
            return;
        }
        const userData = await response.json();
        const infoElem = document.getElementById("userInfo");
        if (infoElem && userData.data) {
            infoElem.innerText = `Logged as ${userData.data.email} (${userData.data.role})`;
        }
    } catch (err) {
        console.error(err);
        logout();
    }
}

// Redireciona se já estiver logado
if (window.location.pathname === "/login" && getToken()) {
    window.location.href = "/dashboard";
}

document.addEventListener("DOMContentLoaded", () => {
    const publicPages = ["/login", "/register"];
    if (!publicPages.includes(window.location.pathname)) {
        checkAuth();
    }
});
