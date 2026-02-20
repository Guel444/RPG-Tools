// -----------------------------
// script.js - Dice, NPC & Dashboard
// -----------------------------

function getToken() {
    return localStorage.getItem("token");
}

let currentNPC = null;
const rollHistory = [];
const MAX_HISTORY = 10;

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

        // Adicionar ao histórico
        rollHistory.unshift({ expression, rolls: data.rolls, modifier: data.modifier, total: data.total });
        if (rollHistory.length > MAX_HISTORY) rollHistory.pop();
        renderHistory();

    } catch (err) {
        console.error(err);
        toast.error("Connection error.");
    }
}

function renderHistory() {
    const el = document.getElementById("rollHistory");
    if (!el) return;

    if (rollHistory.length === 0) {
        el.innerHTML = '<div class="history-empty">No rolls yet this session</div>';
        return;
    }

    el.innerHTML = rollHistory.map((r, i) => {
        const modStr = r.modifier !== 0 ? ` ${r.modifier > 0 ? '+' : ''}${r.modifier}` : '';
        return `
            <div class="history-item ${i === 0 ? 'latest' : ''}">
                <span class="history-expr">${r.expression}</span>
                <span class="history-rolls">[${r.rolls.join(', ')}]${modStr}</span>
                <span class="history-total">${r.total}</span>
            </div>
        `;
    }).join('');
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
                <div class="npc-card-actions">
                    <button class="edit-btn" onclick="editNPC(${npc.id}, '${npc.name}', '${npc.race}', '${npc.class_name}', '${npc.trait}', '${npc.goal}', \`${npc.backstory || ''}\`)">✎ EDIT</button>
                    <button class="delete-btn" onclick="deleteNPC(${npc.id})">✕ DELETE</button>
                </div>
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

function deleteNPC(id) {
    showConfirm("Are you sure you want to delete this NPC?", async () => {
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
    });
}

// Modal de confirmação
function showConfirm(message, onConfirm) {
    // Remove modal existente se houver
    const existing = document.getElementById('confirm-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'confirm-modal';
    modal.style.cssText = `
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: #141418;
            border: 1px solid rgba(201,168,76,0.3);
            border-radius: 4px;
            padding: 32px;
            max-width: 360px;
            width: 90%;
            text-align: center;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
            animation: fadeUp 0.2s ease;
        ">
            <div style="font-size: 32px; margin-bottom: 16px;">💀</div>
            <h3 style="font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 2px; color: #c9a84c; margin-bottom: 12px;">CONFIRM ACTION</h3>
            <p style="color: #8a8070; font-size: 16px; margin-bottom: 28px; line-height: 1.5;">${message}</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button onclick="document.getElementById('confirm-modal').remove()" style="
                    background: none;
                    border: 1px solid rgba(201,168,76,0.2);
                    border-radius: 2px;
                    padding: 10px 24px;
                    color: #8a8070;
                    font-family: 'Cinzel', serif;
                    font-size: 11px;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: all 0.2s;
                " onmouseover="this.style.borderColor='rgba(201,168,76,0.5)';this.style.color='#e8e0d0'"
                   onmouseout="this.style.borderColor='rgba(201,168,76,0.2)';this.style.color='#8a8070'">
                    CANCEL
                </button>
                <button id="confirm-btn" style="
                    background: linear-gradient(135deg, #8b1a1a, #c0392b);
                    border: none;
                    border-radius: 2px;
                    padding: 10px 24px;
                    color: white;
                    font-family: 'Cinzel', serif;
                    font-size: 11px;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: all 0.2s;
                " onmouseover="this.style.boxShadow='0 0 15px rgba(192,57,43,0.4)'"
                   onmouseout="this.style.boxShadow='none'">
                    DELETE
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Fechar ao clicar fora
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.remove();
    });

    document.getElementById('confirm-btn').addEventListener('click', () => {
        modal.remove();
        onConfirm();
    });
}

// -----------------------------
// Logout
// -----------------------------
function logoutDashboard() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}

// -----------------------------
// Editar NPC
// -----------------------------
function editNPC(id, name, race, class_name, trait, goal, backstory) {
    const existing = document.getElementById('edit-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'edit-modal';
    modal.style.cssText = `
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
    `;

    modal.innerHTML = `
        <div style="
            background: #141418;
            border: 1px solid rgba(201,168,76,0.3);
            border-radius: 4px;
            padding: 32px;
            max-width: 480px;
            width: 90%;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
            max-height: 90vh;
            overflow-y: auto;
        ">
            <h3 style="font-family:'Cinzel',serif;font-size:14px;letter-spacing:3px;color:#c9a84c;margin-bottom:24px;text-align:center;">EDIT ADVENTURER</h3>

            ${editField('Name', 'edit-name', name)}
            ${editField('Race', 'edit-race', race)}
            ${editField('Class', 'edit-class', class_name)}
            ${editField('Trait', 'edit-trait', trait)}
            ${editField('Goal', 'edit-goal', goal)}
            ${editField('Backstory', 'edit-backstory', backstory, true)}

            <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:24px;">
                <button onclick="document.getElementById('edit-modal').remove()" style="
                    background:none;border:1px solid rgba(201,168,76,0.2);border-radius:2px;
                    padding:10px 20px;color:#8a8070;font-family:'Cinzel',serif;
                    font-size:11px;letter-spacing:2px;cursor:pointer;
                ">CANCEL</button>
                <button onclick="saveEditNPC(${id})" style="
                    background:linear-gradient(135deg,#b8912a,#c9a84c);border:none;border-radius:2px;
                    padding:10px 20px;color:#0d0d0f;font-family:'Cinzel',serif;
                    font-size:11px;letter-spacing:2px;font-weight:700;cursor:pointer;
                ">SAVE</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

function editField(label, id, value, isTextarea = false) {
    const inputStyle = `
        width:100%;background:#1c1c22;border:1px solid rgba(201,168,76,0.15);
        border-radius:2px;padding:10px 14px;color:#e8e0d0;
        font-family:'Crimson Text',serif;font-size:15px;outline:none;
        ${isTextarea ? 'resize:vertical;min-height:80px;' : ''}
    `;
    const tag = isTextarea ? 'textarea' : 'input';
    const valueAttr = isTextarea ? '' : `value="${value}"`;
    const content = isTextarea ? value : '';

    return `
        <div style="margin-bottom:16px;">
            <label style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:#8a8070;display:block;margin-bottom:6px;">${label.toUpperCase()}</label>
            <${tag} id="${id}" style="${inputStyle}" ${valueAttr}>${content}</${tag}>
        </div>
    `;
}

async function saveEditNPC(id) {
    const payload = {
        name: document.getElementById('edit-name').value.trim(),
        race: document.getElementById('edit-race').value.trim(),
        class_name: document.getElementById('edit-class').value.trim(),
        trait: document.getElementById('edit-trait').value.trim(),
        goal: document.getElementById('edit-goal').value.trim(),
        backstory: document.getElementById('edit-backstory').value.trim() || null,
    };

    if (!payload.name || !payload.race || !payload.class_name || !payload.trait || !payload.goal) {
        toast.error("Please fill in all required fields.");
        return;
    }

    try {
        const response = await fetch(`/npc/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            let msg = data.detail || "Error updating NPC";
            if (typeof msg === "object") msg = JSON.stringify(msg);
            toast.error(msg);
            return;
        }

        document.getElementById('edit-modal').remove();
        toast.success("NPC updated successfully!");
        showMyNPCs();

    } catch (err) {
        console.error(err);
        toast.error("Connection error.");
    }
}