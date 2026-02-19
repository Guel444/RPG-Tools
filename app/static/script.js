// -----------------------------
// script.js - Dice, NPC & Dashboard
// -----------------------------

function getToken() {
    return localStorage.getItem("token");
}

let currentNPC = null;

// -----------------------------
// Dice Roller
// -----------------------------
async function rollDice() {
    const expression = document.getElementById("diceInput").value;
    try {
        const response = await fetch("/roll", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify({ expression })
        });
        const data = await response.json();
        if (!response.ok || data.detail) {
            let msg = data.detail || "Erro ao rolar dado";
            if (typeof msg === "object") msg = JSON.stringify(msg);
            alert(msg);
            return;
        }
        document.getElementById("diceResult").innerHTML =
            `🎲 ${data.rolls.join(", ")} | Total: ${data.total}`;
    } catch (err) {
        console.error(err);
        alert("Erro ao rolar o dado.");
    }
}

// -----------------------------
// NPC
// -----------------------------
async function generateNPC() {
    try {
        const response = await fetch("/npc", {
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            let msg = data.detail || "Erro ao gerar NPC";
            if (typeof msg === "object") msg = JSON.stringify(msg);
            alert(msg);
            return;
        }

        currentNPC = data.data;

        document.getElementById("npcResult").innerHTML = `
            <div class="section-card hover-glow">
                <h3 class="text-2xl font-bold text-yellow-400 mb-2">${currentNPC.name}</h3>
                <p><strong>Race:</strong> ${currentNPC.race}</p>
                <p><strong>Class:</strong> ${currentNPC.class}</p>
                <p><strong>Trait:</strong> ${currentNPC.trait}</p>
                <p><strong>Goal:</strong> ${currentNPC.goal}</p>
            </div>
        `;
    } catch (err) {
        console.error(err);
        alert("Erro ao gerar NPC.");
    }
}

async function saveNPC() {
    if (!currentNPC) {
        alert("Gere um NPC primeiro!");
        return;
    }
    try {
        const response = await fetch("/npc/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(currentNPC)
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            let msg = data.detail || "Erro ao salvar NPC";
            if (typeof msg === "object") msg = JSON.stringify(msg);
            alert(msg);
            return;
        }
        alert("NPC salvo com sucesso!");
        showMyNPCs();
    } catch (err) {
        console.error(err);
        alert("Erro ao salvar NPC.");
    }
}

async function showMyNPCs() {
    try {
        const response = await fetch("/npc/my", {
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            let msg = data.detail || "Erro ao carregar NPCs";
            if (typeof msg === "object") msg = JSON.stringify(msg);
            alert(msg);
            return;
        }

        const npcs = data.data;
        const container = document.getElementById("myNpcsList");
        container.innerHTML = "";

        npcs.forEach(npc => {
            const npcDiv = document.createElement("div");
            npcDiv.className = "section-card hover-glow";
            npcDiv.innerHTML = `
                <h3 class="text-xl font-bold text-yellow-400 mb-1">${npc.name}</h3>
                <p><strong>Race:</strong> ${npc.race}</p>
                <p><strong>Class:</strong> ${npc.class_name}</p>
                <p><strong>Trait:</strong> ${npc.trait}</p>
                <p><strong>Goal:</strong> ${npc.goal}</p>
                <button onclick="deleteNPC(${npc.id})" class="bg-red-500 px-2 py-1 rounded mt-2 hover:bg-red-400 transition">
                    Excluir
                </button>
            `;
            container.appendChild(npcDiv);
        });
    } catch (err) {
        console.error(err);
        alert("Erro ao carregar NPCs.");
    }
}

async function deleteNPC(id) {
    try {
        const response = await fetch(`/npc/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const data = await response.json();

        let msg = data.detail || "Erro ao deletar NPC";
        if (typeof msg === "object") msg = JSON.stringify(msg);
        alert(msg);

        showMyNPCs();
    } catch (err) {
        console.error(err);
        alert("Erro ao deletar NPC.");
    }
}

// -----------------------------
// Seções do dashboard
// -----------------------------
function showSection(section) {
    const sections = ["home", "dice", "npc", "myNpcs"];
    sections.forEach(s => document.getElementById(s + "Section").classList.add("hidden"));
    document.getElementById(section + "Section").classList.remove("hidden");

    if (section === "myNpcs") showMyNPCs();
}

// -----------------------------
// Logout
// -----------------------------
function logoutDashboard() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}
