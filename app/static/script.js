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
    const expression = document.getElementById("diceInput").value.trim();
    if (!expression) return;

    const resultEl = document.getElementById("diceResult");

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
            let msg = data.detail || "Error rolling dice";
            if (typeof msg === "object") msg = JSON.stringify(msg);
            toast.error(msg);
            return;
        }

        const rollsStr = data.rolls.join(" + ");
        const modStr = data.modifier !== 0 ? ` ${data.modifier > 0 ? '+' : ''}${data.modifier}` : '';

        resultEl.innerHTML = `
            <div class="dice-rolls">${expression} → [ ${rollsStr} ]${modStr}</div>
            <div class="dice-total">${data.total}</div>
        `;
        resultEl.classList.add("visible");

    } catch (err) {
        console.error(err);
        toast.error("Connection error.");
    }
}

// -----------------------------
// NPC
// -----------------------------
async function generateNPC() {
    const resultEl = document.getElementById("npcResult");
    resultEl.innerHTML = `<div style="color:var(--text-muted);font-style:italic;padding:12px">Summoning adventurer...</div>`;

    try {
        const response = await fetch("/npc", {
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            let msg = data.detail || "Error generating NPC";
            if (typeof msg === "object") msg = JSON.stringify(msg);
            toast.error(msg);
            resultEl.innerHTML = '';
            return;
        }

        currentNPC = data.data;
        renderNPC(currentNPC, "npcResult");

    } catch (err) {
        console.error(err);
        toast.error("Connection error.");
    }
}

function renderNPC(npc, containerId) {
    const el = document.getElementById(containerId);
    el.innerHTML = `
        <div class="npc-card">
            <div class="npc-name">${npc.name}</div>
            <div class="npc-grid">
                <div class="npc-field">
                    <label>Race</label>
                    <span>${npc.race}</span>
                </div>
                <div class="npc-field">
                    <label>Class</label>
                    <span>${npc.class || npc.class_name}</span>
                </div>
                <div class="npc-field">
                    <label>Trait</label>
                    <span>${npc.trait}</span>
                </div>
                <div class="npc-field">
                    <label>Goal</label>
                    <span>${npc.goal}</span>
                </div>
            </div>
            ${npc.backstory ? `<div class="npc-backstory">"${npc.backstory}"</div>` : ''}
        </div>
    `;
}

async function saveNPC() {
    if (!currentNPC) {
        toast.info("Generate an NPC first!");
        return;
    }
    try {
        const payload = {
            name: currentNPC.name,
            race: currentNPC.race,
            class_name: currentNPC.class || currentNPC.class_name,
            trait: currentNPC.trait,
            goal: currentNPC.goal,
            backstory: currentNPC.backstory || null
        };

        const response = await fetch("/npc/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            let msg = data.detail || "Error saving NPC";
            if (typeof msg === "object") msg = JSON.stringify(msg);
            toast.error(msg);
            return;
        }

        toast.success("NPC saved successfully!");
        showSection('myNpcs');

    } catch (err) {
        console.error(err);
        toast.error("Connection error.");
    }
}

async function showMyNPCs() {
    const container = document.getElementById("myNpcsList");
    container.innerHTML = `<div style="color:var(--text-muted);font-style:italic;padding:20px">Loading your adventurers...</div>`;

    try {
        const response = await fetch("/npc/my", {
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            let msg = data.detail || "Error loading NPCs";
            if (typeof msg === "object") msg = JSON.stringify(msg);
            toast.error(msg);
            return;
        }

        const npcs = data.data;

        if (npcs.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📜</span>
                    <p>No adventurers saved yet.<br>Generate and save your first NPC!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `<div class="my-npcs-grid"></div>`;
        const grid = container.querySelector('.my-npcs-grid');

        npcs.forEach(npc => {
            const card = document.createElement("div");
            card.className = "saved-npc-card";
            card.innerHTML = `
                <button class="delete-btn" onclick="deleteNPC(${npc.id})">✕ DELETE</button>
                <div class="npc-name">${npc.name}</div>
                <div class="npc-grid">
                    <div class="npc-field">
                        <label>Race</label>
                        <span>${npc.race}</span>
                    </div>
                    <div class="npc-field">
                        <label>Class</label>
                        <span>${npc.class_name}</span>
                    </div>
                    <div class="npc-field">
                        <label>Trait</label>
                        <span>${npc.trait}</span>
                    </div>
                    <div class="npc-field">
                        <label>Goal</label>
                        <span>${npc.goal}</span>
                    </div>
                </div>
                ${npc.backstory ? `<div class="npc-backstory">"${npc.backstory}"</div>` : ''}
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        toast.error("Connection error.");
    }
}

async function deleteNPC(id) {
    async function deleteNPC(id) {
    toast.info("Click again to confirm deletion.");
    
    const btn = document.querySelector(`button[onclick="deleteNPC(${id})"]`);
    if (btn) {
        btn.textContent = "✕ CONFIRM";
        btn.style.color = "#e74c3c";
        btn.style.borderColor = "#e74c3c";
        btn.onclick = async () => {
            try {
                const response = await fetch(`/npc/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${getToken()}` }
                });
                const data = await response.json();

                if (!response.ok || !data.success) {
                    let msg = data.detail || "Error deleting NPC";
                    if (typeof msg === "object") msg = JSON.stringify(msg);
                    toast.error(msg);
                    return;
                }

                toast.success("NPC deleted.");
                showMyNPCs();

            } catch (err) {
                console.error(err);
                toast.error("Connection error.");
            }
        };

        // Cancela após 3 segundos se não confirmar
        setTimeout(() => showMyNPCs(), 3000);
    }
}

    try {
        const response = await fetch(`/npc/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            let msg = data.detail || "Error deleting NPC";
            if (typeof msg === "object") msg = JSON.stringify(msg);
            toast.error(msg);
            return;
        }

        toast.success("NPC deleted.");
        showMyNPCs();

    } catch (err) {
        console.error(err);
        toast.error("Connection error.");
    }
}

// -----------------------------
// Logout
// -----------------------------
function logoutDashboard() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}