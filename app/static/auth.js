function displayError(msg) {
    if (typeof msg === "object") msg = JSON.stringify(msg);
    const el = document.getElementById("error");
    if (el) el.textContent = msg;
}

async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        displayError("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            displayError(data.detail || "Login failed.");
            return;
        }

        localStorage.setItem("token", data.access_token);
        window.location.href = "/dashboard";
    } catch (err) {
        displayError("Connection error.");
    }
}

async function registerUser() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (!username || !email || !password) {
        displayError("Please fill in all fields.");
        return;
    }

    if (username.length < 3) {
        displayError("Username must be at least 3 characters.");
        return;
    }

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, role })
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            displayError(data.detail || "Registration failed.");
            return;
        }

        window.location.href = "/login";
    } catch (err) {
        displayError("Connection error.");
    }
}

// Mostrar username no dashboard
async function loadUserInfo() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch("/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            window.location.href = "/login";
            return;
        }

        const el = document.getElementById("userInfo");
        if (el) {
            const roleIcon = data.data.role === "MASTER" ? "📖" : "⚔️";
            el.innerHTML = `${roleIcon} <strong style="color:var(--text)">${data.data.username || data.data.email}</strong>`;
        }
    } catch (err) {
        window.location.href = "/login";
    }
}

// Chamar ao carregar o dashboard
if (document.getElementById("userInfo") !== null) {
    loadUserInfo();
}