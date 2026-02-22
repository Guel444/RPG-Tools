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

    // Resetar busca
    const search = document.getElementById('npcSearch');
    const count = document.getElementById('searchCount');
    if (search) search.value = '';
    if (count) count.textContent = '';

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

// -----------------------------
// Busca e filtro de NPCs
// -----------------------------
function filterNPCs() {
    const query = document.getElementById('npcSearch').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.saved-npc-card');
    let visible = 0;

    cards.forEach(card => {
        const name = card.querySelector('.npc-name')?.textContent.toLowerCase() || '';
        const fields = card.querySelectorAll('.npc-field span');
        const race = fields[0]?.textContent.toLowerCase() || '';
        const cls = fields[1]?.textContent.toLowerCase() || '';

        const match = !query || name.includes(query) || race.includes(query) || cls.includes(query);
        card.classList.toggle('npc-hidden', !match);
        if (match) visible++;
    });

    const count = document.getElementById('searchCount');
    if (count) {
        count.textContent = query ? `${visible} found` : `${cards.length} adventurers`;
    }
}

// -----------------------------
// Master Notes
// -----------------------------
let noteSaveTimer = null;

async function loadNotes() {
    try {
        const response = await fetch("/notes", {
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('notesContent').value = data.content;
        }
    } catch (err) {
        console.error(err);
    }
}

async function saveNotes() {
    const content = document.getElementById('notesContent').value;
    const status = document.getElementById('noteSaveStatus');

    try {
        const response = await fetch("/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify({ content })
        });
        const data = await response.json();

        if (data.success) {
            if (status) status.textContent = "SAVED ✓";
            setTimeout(() => { if (status) status.textContent = ""; }, 2000);
        } else {
            toast.error("Error saving notes.");
        }
    } catch (err) {
        toast.error("Connection error.");
    }
}

function scheduleNoteSave() {
    const status = document.getElementById('noteSaveStatus');
    if (status) status.textContent = "UNSAVED...";
    clearTimeout(noteSaveTimer);
    noteSaveTimer = setTimeout(saveNotes, 2000);
}

// -----------------------------
// Campaigns
// -----------------------------
let allCampaignsData = [];
let currentCampaignFilter = 'ALL';

async function loadCampaigns() {
    const container = document.getElementById('campaignsList');
    container.innerHTML = `<div style="color:var(--text-muted);font-style:italic;padding:20px">Loading campaigns...</div>`;

    try {
        const [campRes, npcRes] = await Promise.all([
            fetch('/campaigns', { headers: { 'Authorization': `Bearer ${getToken()}` } }),
            fetch('/npc/my', { headers: { 'Authorization': `Bearer ${getToken()}` } })
        ]);

        const campData = await campRes.json();
        const npcData = await npcRes.json();

        if (!campData.success) { toast.error("Error loading campaigns."); return; }

        allCampaignsData = { campaigns: campData.data, npcs: npcData.data || [] };
        renderCampaigns();

    } catch (err) {
        console.error(err);
        toast.error("Connection error.");
    }
}

function filterCampaigns(status) {
    currentCampaignFilter = status;
    ['ALL', 'ACTIVE', 'PAUSED', 'COMPLETED'].forEach(s => {
        const btn = document.getElementById(`cf-${s.toLowerCase()}`);
        if (btn) btn.style.borderColor = s === status ? 'var(--gold)' : '';
    });
    renderCampaigns();
}

function renderCampaigns() {
    const container = document.getElementById('campaignsList');
    const { campaigns, npcs } = allCampaignsData;

    const filtered = currentCampaignFilter === 'ALL'
        ? campaigns
        : campaigns.filter(c => c.status === currentCampaignFilter);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🗺️</span>
                <p>${campaigns.length === 0 ? 'No campaigns yet.<br>Create your first adventure!' : 'No campaigns with this status.'}</p>
            </div>`;
        return;
    }

    container.innerHTML = `<div class="campaigns-grid"></div>`;
    const grid = container.querySelector('.campaigns-grid');
    filtered.forEach(c => renderCampaignCard(c, npcs, grid));
}

function statusBadge(status) {
    const map = {
        'ACTIVE':    ['badge-active', '⚔️ ACTIVE'],
        'PAUSED':    ['badge-paused', '⏸ PAUSED'],
        'COMPLETED': ['badge-completed', '✓ COMPLETED']
    };
    const [cls, label] = map[status] || ['badge-active', status];
    return `<span class="campaign-badge ${cls}">${label}</span>`;
}

function renderCampaignCard(c, allNpcs, grid) {
    const card = document.createElement('div');
    card.className = 'campaign-card';
    card.id = `campaign-${c.id}`;

    const npcTags = c.npcs.map(n => `
        <span class="campaign-npc-tag">
            ${n.name}
            <button onclick="removeNPCFromCampaign('${c.id}', ${n.id})" title="Remove">✕</button>
        </span>
    `).join('');

    const availableNpcs = allNpcs.filter(n => !c.npcs.find(cn => cn.id === n.id));
    const npcOptions = availableNpcs.map(n =>
        `<option value="${n.id}">${n.name} (${n.race} ${n.class_name})</option>`
    ).join('');

    card.innerHTML = `
        <div class="campaign-header">
            <div class="campaign-name">${c.name}</div>
            <div class="campaign-actions">
                <button class="edit-btn" onclick="showCampaignModal('${c.id}')">✎ EDIT</button>
                <button class="delete-btn" onclick="deleteCampaign('${c.id}')">✕</button>
            </div>
        </div>

        <div class="campaign-meta">
            ${statusBadge(c.status)}
            <span class="campaign-session">📖 SESSION ${c.current_session}</span>
            ${c.location ? `<span class="campaign-session">📍 ${c.location}</span>` : ''}
        </div>

        ${c.description ? `<div class="campaign-desc">${c.description}</div>` : ''}

        ${c.session_notes ? `
            <div class="campaign-section-label">SESSION NOTES</div>
            <div class="campaign-session-notes">${c.session_notes}</div>
        ` : ''}

        <div class="campaign-section-label">ADVENTURERS</div>
        <div class="campaign-npc-list">
            ${npcTags || '<span style="color:var(--text-muted);font-size:13px;font-style:italic">No adventurers yet</span>'}
        </div>

        ${availableNpcs.length > 0 ? `
            <div class="campaign-add-npc">
                <select id="npc-select-${c.id}">
                    <option value="">Add adventurer...</option>
                    ${npcOptions}
                </select>
                <button class="btn btn-outline" style="padding:7px 14px;font-size:10px;flex-shrink:0" onclick="addNPCToCampaign('${c.id}')">ADD</button>
            </div>
        ` : ''}
    `;

    grid.appendChild(card);
}

function showCampaignModal(id = null) {
    const existing = document.getElementById('campaign-modal');
    if (existing) existing.remove();

    const isEdit = !!id;
    let c = null;
    if (isEdit && allCampaignsData.campaigns) {
        c = allCampaignsData.campaigns.find(x => x.id === id);
    }

    const modal = document.createElement('div');
    modal.id = 'campaign-modal';
    modal.style.cssText = `
        position:fixed;inset:0;z-index:99999;
        display:flex;align-items:center;justify-content:center;
        background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);
        overflow-y:auto;padding:20px;
    `;

    const fieldStyle = `width:100%;box-sizing:border-box;background:#1c1c22;border:1px solid rgba(201,168,76,0.15);border-radius:2px;padding:10px 14px;color:#e8e0d0;font-family:'Crimson Text',serif;font-size:15px;outline:none;`;
    const textareaStyle = `width:100%;box-sizing:border-box;overflow-x:hidden;overflow-wrap:break-word;word-break:break-word;background:#1c1c22;border:1px solid rgba(201,168,76,0.15);border-radius:2px;padding:10px 14px;color:#e8e0d0;font-family:'Crimson Text',serif;font-size:15px;outline:none;`;
    const labelStyle = `font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:#8a8070;display:block;margin-bottom:6px;`;

    modal.innerHTML = `
        <div style="background:#141418;border:1px solid rgba(201,168,76,0.3);border-radius:4px;padding:32px;max-width:500px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.6);">
            <h3 style="font-family:'Cinzel',serif;font-size:14px;letter-spacing:3px;color:#c9a84c;margin-bottom:24px;text-align:center;">
                ${isEdit ? 'EDIT CAMPAIGN' : 'NEW CAMPAIGN'}
            </h3>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
                <div style="grid-column:1/-1;">
                    <label style="${labelStyle}">NAME *</label>
                    <input id="c-name" value="${c?.name || ''}" style="${fieldStyle}">
                </div>
                <div>
                    <label style="${labelStyle}">STATUS</label>
                    <select id="c-status" style="${fieldStyle}">
                        <option value="ACTIVE" ${c?.status === 'ACTIVE' || !c ? 'selected' : ''}>⚔️ Active</option>
                        <option value="PAUSED" ${c?.status === 'PAUSED' ? 'selected' : ''}>⏸ Paused</option>
                        <option value="COMPLETED" ${c?.status === 'COMPLETED' ? 'selected' : ''}>✓ Completed</option>
                    </select>
                </div>
                <div>
                    <label style="${labelStyle}">SESSION #</label>
                    <input id="c-session" type="number" min="1" value="${c?.current_session || 1}" style="${fieldStyle}">
                </div>
                <div style="grid-column:1/-1;">
                    <label style="${labelStyle}">CURRENT LOCATION</label>
                    <input id="c-location" value="${c?.location || ''}" placeholder="e.g. The Tavern of the Broken Staff" style="${fieldStyle}">
                </div>
                <div style="grid-column:1/-1;">
                    <label style="${labelStyle}">DESCRIPTION</label>
                    <textarea id="c-desc" style="${textareaStyle}resize:vertical;min-height:60px;">${c?.description || ''}</textarea>
                </div>
                <div style="grid-column:1/-1;">
                    <label style="${labelStyle}">SESSION NOTES</label>
                    <textarea id="c-notes" style="${textareaStyle}resize:vertical;min-height:80px;" placeholder="What happened this session?">${c?.session_notes || ''}</textarea>
                </div>
            </div>

            <div style="display:flex;gap:12px;justify-content:flex-end;">
                <button onclick="document.getElementById('campaign-modal').remove()" style="background:none;border:1px solid rgba(201,168,76,0.2);border-radius:2px;padding:10px 20px;color:#8a8070;font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;cursor:pointer;">CANCEL</button>
                <button onclick="${isEdit ? `saveCampaignEdit('${id}')` : 'createCampaign()'}" style="background:linear-gradient(135deg,#b8912a,#c9a84c);border:none;border-radius:2px;padding:10px 20px;color:#0d0d0f;font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;font-weight:700;cursor:pointer;">${isEdit ? 'SAVE' : 'CREATE'}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.getElementById('c-name').focus();
}

function getCampaignFormData() {
    return {
        name: document.getElementById('c-name').value.trim(),
        status: document.getElementById('c-status').value,
        current_session: parseInt(document.getElementById('c-session').value) || 1,
        location: document.getElementById('c-location').value.trim() || null,
        description: document.getElementById('c-desc').value.trim() || null,
        session_notes: document.getElementById('c-notes').value.trim() || null,
    };
}

async function createCampaign() {
    const data = getCampaignFormData();
    if (!data.name) { toast.error("Campaign name is required."); return; }

    try {
        const response = await fetch('/campaigns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data)
        });
        const res = await response.json();
        if (!res.success) { toast.error(res.detail || "Error creating campaign."); return; }
        document.getElementById('campaign-modal').remove();
        toast.success("Campaign created!");
        loadCampaigns();
    } catch (err) {
        toast.error("Connection error.");
    }
}

async function saveCampaignEdit(id) {
    const data = getCampaignFormData();
    if (!data.name) { toast.error("Campaign name is required."); return; }

    try {
        const response = await fetch(`/campaigns/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify(data)
        });
        const res = await response.json();
        if (!res.success) { toast.error(res.detail || "Error updating campaign."); return; }
        document.getElementById('campaign-modal').remove();
        toast.success("Campaign updated!");
        loadCampaigns();
    } catch (err) {
        toast.error("Connection error.");
    }
}

function deleteCampaign(id) {
    showConfirm("Delete this campaign? NPCs won't be deleted.", async () => {
        try {
            const response = await fetch(`/campaigns/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const res = await response.json();
            if (!res.success) { toast.error(res.detail || "Error deleting campaign."); return; }
            toast.success("Campaign deleted.");
            loadCampaigns();
        } catch (err) {
            toast.error("Connection error.");
        }
    });
}

async function addNPCToCampaign(campaignId) {
    const select = document.getElementById(`npc-select-${campaignId}`);
    const npcId = select?.value;
    if (!npcId) { toast.info("Select an adventurer first."); return; }

    try {
        const response = await fetch(`/campaigns/${campaignId}/npcs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify({ npc_id: parseInt(npcId) })
        });
        const res = await response.json();
        if (!res.success) { toast.error(res.detail || "Error adding NPC."); return; }
        toast.success("Adventurer added!");
        loadCampaigns();
    } catch (err) {
        toast.error("Connection error.");
    }
}

async function removeNPCFromCampaign(campaignId, npcId) {
    try {
        const response = await fetch(`/campaigns/${campaignId}/npcs/${npcId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const res = await response.json();
        if (!res.success) { toast.error(res.detail || "Error removing NPC."); return; }
        toast.success("Adventurer removed.");
        loadCampaigns();
    } catch (err) {
        toast.error("Connection error.");
    }
}

// -----------------------------
// Profile
// -----------------------------
let currentRole = 'PLAYER';

async function loadProfile() {
    try {
        const response = await fetch('/profile', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await response.json();
        if (!data.success) { toast.error("Error loading profile."); return; }

        const d = data.data;

        // Preencher campos
        document.getElementById('profile-email').value = d.email;
        document.getElementById('profile-username').value = d.username || '';
        currentRole = d.role;
        selectRole(d.role, false);

        // Stats
        const statsEl = document.getElementById('profileStats');
        statsEl.innerHTML = `
            <div class="profile-stat">
                <div class="profile-stat-value">${d.npc_count}</div>
                <div class="profile-stat-label">NPCS CREATED</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-value">${d.campaign_count}</div>
                <div class="profile-stat-label">CAMPAIGNS</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-value" style="font-size:18px;padding-top:8px">${d.created_at}</div>
                <div class="profile-stat-label">MEMBER SINCE</div>
            </div>
        `;

    } catch (err) {
        console.error(err);
        toast.error("Connection error.");
    }
}

function selectRole(role, save = false) {
    currentRole = role;
    const master = document.getElementById('role-master');
    const player = document.getElementById('role-player');
    if (master) master.classList.toggle('selected', role === 'MASTER');
    if (player) player.classList.toggle('selected', role === 'PLAYER');
}

async function saveProfile() {
    const username = document.getElementById('profile-username').value.trim();

    if (!username) { toast.error("Username cannot be empty."); return; }
    if (username.length < 3) { toast.error("Username must be at least 3 characters."); return; }

    try {
        const response = await fetch('/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify({ username, role: currentRole })
        });
        const data = await response.json();
        if (!data.success) { toast.error(data.detail || "Error updating profile."); return; }
        toast.success("Profile updated!");

        // Atualizar nome no sidebar
        const userInfoEl = document.getElementById('userInfo');
        if (userInfoEl) {
            const roleIcon = data.data.role === 'MASTER' ? '📖' : '⚔️';
            userInfoEl.innerHTML = `
                <span style="font-size:18px;width:24px;text-align:center;display:inline-block;flex-shrink:0">${roleIcon}</span>
                <strong style="color:var(--text);font-weight:600;font-family:'Crimson Text',serif;font-size:16px">${data.data.username}</strong>
            `;
        }
    } catch (err) {
        toast.error("Connection error.");
    }
}

async function savePassword() {
    const current = document.getElementById('profile-current-pw').value;
    const newPw = document.getElementById('profile-new-pw').value;
    const confirm = document.getElementById('profile-confirm-pw').value;

    if (!current || !newPw || !confirm) { toast.error("Please fill in all password fields."); return; }
    if (newPw !== confirm) { toast.error("New passwords don't match."); return; }
    if (newPw.length < 6) { toast.error("Password must be at least 6 characters."); return; }

    try {
        const response = await fetch('/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify({ current_password: current, new_password: newPw })
        });
        const data = await response.json();
        if (!data.success) { toast.error(data.detail || "Error changing password."); return; }

        toast.success("Password changed successfully!");
        document.getElementById('profile-current-pw').value = '';
        document.getElementById('profile-new-pw').value = '';
        document.getElementById('profile-confirm-pw').value = '';
    } catch (err) {
        toast.error("Connection error.");
    }
}

// -----------------------------
// Encounter Generator
// -----------------------------
async function generateEncounter() {
    const level = parseInt(document.getElementById('enc-level').value);
    const party_size = parseInt(document.getElementById('enc-size').value);
    const difficulty = document.getElementById('enc-difficulty').value;
    const environment = document.getElementById('enc-environment').value;

    const result = document.getElementById('encounterResult');
    result.innerHTML = `<div style="color:var(--text-muted);font-style:italic;padding:20px">Rolling the bones of fate...</div>`;

    try {
        const response = await fetch('/encounter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify({ level, party_size, difficulty, environment })
        });
        const data = await response.json();
        if (!data.success) { toast.error(data.detail || "Error generating encounter."); return; }

        renderEncounter(data.data);
    } catch (err) {
        toast.error("Connection error.");
    }
}

function difficultyColor(diff) {
    const map = { 'Easy': '#4caf7d', 'Medium': '#e0a832', 'Hard': '#e07832', 'Deadly': '#c0392b' };
    return map[diff] || '#c9a84c';
}

function renderEncounter(enc) {
    const result = document.getElementById('encounterResult');

    const monsterCards = enc.monsters.map(m => `
        <div style="background:var(--dark-3);border:1px solid rgba(201,168,76,0.1);border-radius:4px;padding:20px;position:relative;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:12px;">
                <div>
                    <div style="font-family:'Cinzel',serif;font-size:16px;color:var(--gold);">
                        ${m.count > 1 ? `${m.count}× ` : ''}${m.name}
                    </div>
                    <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);margin-top:2px;">
                        CR ${m.cr} • ${m.type.toUpperCase()}
                    </div>
                </div>
                <div style="text-align:right;flex-shrink:0;">
                    <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);">XP EACH</div>
                    <div style="font-family:'Cinzel',serif;font-size:14px;color:var(--gold);">${m.xp_each.toLocaleString()}</div>
                </div>
            </div>

            <div style="display:flex;gap:16px;margin-bottom:12px;">
                <div style="background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.05);border-radius:2px;padding:6px 12px;text-align:center;">
                    <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);">HP</div>
                    <div style="font-family:'Cinzel',serif;font-size:16px;color:#c0392b;">${m.hp}</div>
                </div>
                <div style="background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.05);border-radius:2px;padding:6px 12px;text-align:center;">
                    <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);">AC</div>
                    <div style="font-family:'Cinzel',serif;font-size:16px;color:#4a90c9;">${m.ac}</div>
                </div>
            </div>

            <div style="font-size:14px;color:var(--text-muted);font-style:italic;margin-bottom:12px;line-height:1.5;border-left:2px solid rgba(201,168,76,0.2);padding-left:10px;">
                ${m.description}
            </div>

            <div style="margin-bottom:${m.tactics ? '10px' : '0'};">
                <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:rgba(201,168,76,0.4);margin-bottom:6px;">ATTACKS</div>
                ${m.attacks.map(a => `
                    <div style="font-size:13px;color:var(--text);padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04);">⚔️ ${a}</div>
                `).join('')}
            </div>

            ${m.tactics ? `
                <div style="margin-top:10px;background:rgba(201,168,76,0.04);border:1px solid rgba(201,168,76,0.1);border-radius:2px;padding:10px 12px;">
                    <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:rgba(201,168,76,0.5);margin-bottom:4px;">TACTICS</div>
                    <div style="font-size:13px;color:var(--text-muted);">🧠 ${m.tactics}</div>
                </div>
            ` : ''}
        </div>
    `).join('');

    const diffColor = difficultyColor(enc.difficulty_actual);

    result.innerHTML = `
        <!-- Resumo -->
        <div style="background:var(--dark-3);border:1px solid rgba(201,168,76,0.15);border-radius:4px;padding:20px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
                <div style="font-family:'Cinzel',serif;font-size:14px;letter-spacing:2px;color:var(--gold);">ENCOUNTER SUMMARY</div>
                <span style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;padding:4px 14px;border-radius:2px;background:${diffColor}18;color:${diffColor};border:1px solid ${diffColor}44;">
                    ${enc.difficulty_actual.toUpperCase()}
                </span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;">
                <div style="text-align:center;">
                    <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);">MONSTERS</div>
                    <div style="font-family:'Cinzel',serif;font-size:24px;color:var(--text);">${enc.monster_count}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);">TOTAL XP</div>
                    <div style="font-family:'Cinzel',serif;font-size:24px;color:var(--gold);">${enc.adjusted_xp.toLocaleString()}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);">XP/PLAYER</div>
                    <div style="font-family:'Cinzel',serif;font-size:24px;color:var(--green);">${enc.xp_per_player.toLocaleString()}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;color:var(--text-muted);">MULTIPLIER</div>
                    <div style="font-family:'Cinzel',serif;font-size:24px;color:var(--text);">×${enc.multiplier}</div>
                </div>
            </div>
        </div>

        <!-- Monstros -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;margin-bottom:20px;">
            ${monsterCards}
        </div>

        <!-- Gerar novo -->
        <button class="btn btn-outline" onclick="generateEncounter()" style="width:100%;">🎲 GENERATE ANOTHER</button>
    `;
}

// -----------------------------
// Initiative Tracker
// -----------------------------
let combatants = [];
let currentTurn = 0;
let currentRound = 1;
let nextId = 1;

function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}

function addCombatant() {
    const name = document.getElementById('cbt-name').value.trim();
    const hp = parseInt(document.getElementById('cbt-hp').value) || 10;
    const ac = parseInt(document.getElementById('cbt-ac').value) || 10;
    const type = document.getElementById('cbt-type').value;
    const rollInit = document.getElementById('cbt-roll-init').checked;
    const mod = parseInt(document.getElementById('cbt-init-mod').value) || 0;

    if (!name) { toast.error("Name is required."); return; }

    let initiative;
    if (rollInit) {
        const roll = rollD20();
        initiative = roll + mod;
        toast.info(`${name} rolled ${roll} + ${mod} = ${initiative} initiative!`);
    } else {
        initiative = parseInt(document.getElementById('cbt-init').value) || 0;
    }

    combatants.push({
        id: nextId++,
        name,
        initiative,
        hp,
        maxHp: hp,
        ac,
        type,
        conditions: [],
    });

    // Re-sort by initiative (ties broken by player > monster)
    sortCombatants();
    renderInitiativeList();

    // Limpar campos
    document.getElementById('cbt-name').value = '';
    document.getElementById('cbt-hp').value = '';
    document.getElementById('cbt-ac').value = '';
    document.getElementById('cbt-init').value = '';
    document.getElementById('cbt-init-mod').value = '0';
    document.getElementById('cbt-name').focus();
}

function sortCombatants() {
    combatants.sort((a, b) => {
        if (b.initiative !== a.initiative) return b.initiative - a.initiative;
        // Desempate: players primeiro
        const order = { player: 0, ally: 1, monster: 2 };
        return (order[a.type] || 0) - (order[b.type] || 0);
    });
}

function nextTurn() {
    if (combatants.length === 0) return;

    // Pula mortos
    let next = (currentTurn + 1) % combatants.length;
    let attempts = 0;
    while (combatants[next].hp <= 0 && attempts < combatants.length) {
        next = (next + 1) % combatants.length;
        attempts++;
    }

    if (next <= currentTurn && combatants.length > 1) {
        currentRound++;
        document.getElementById('roundCounter').textContent = currentRound;
        toast.info(`⚔️ Round ${currentRound} begins!`);
    }

    currentTurn = next;
    renderInitiativeList();
    updateTurnIndicator();

    // Scroll para o combatente ativo
    const active = document.querySelector('.combatant-row.active-turn');
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateTurnIndicator() {
    const el = document.getElementById('turnIndicator');
    if (combatants.length === 0) { el.textContent = '—'; return; }
    const c = combatants[currentTurn];
    if (c) el.textContent = c.name.toUpperCase();
}

function resetCombat() {
    showConfirm("Reset combat? All combatants will be cleared.", () => {
        combatants = [];
        currentTurn = 0;
        currentRound = 1;
        nextId = 1;
        document.getElementById('roundCounter').textContent = '1';
        document.getElementById('turnIndicator').textContent = '—';
        renderInitiativeList();
    });
}

function changeHp(id, delta) {
    const c = combatants.find(x => x.id === id);
    if (!c) return;
    c.hp = Math.max(0, Math.min(c.maxHp, c.hp + delta));
    renderInitiativeList();
}

function setHp(id, value) {
    const c = combatants.find(x => x.id === id);
    if (!c) return;
    const v = parseInt(value);
    if (!isNaN(v)) c.hp = Math.max(0, Math.min(c.maxHp, v));
    renderInitiativeList();
}

function removeCombatant(id) {
    const idx = combatants.findIndex(x => x.id === id);
    if (idx === -1) return;
    combatants.splice(idx, 1);
    if (currentTurn >= combatants.length) currentTurn = 0;
    renderInitiativeList();
    updateTurnIndicator();
}

function getHpStatus(hp, maxHp) {
    if (hp <= 0) return { label: 'DEAD', cls: 'hp-dead' };
    const pct = hp / maxHp;
    if (pct > 0.66) return { label: 'HEALTHY', cls: 'hp-healthy' };
    if (pct > 0.33) return { label: 'HURT', cls: 'hp-hurt' };
    return { label: 'CRITICAL', cls: 'hp-critical' };
}

function getTypeBadge(type) {
    const map = {
        player:  ['type-player',  '🧙 PLAYER'],
        monster: ['type-monster', '👹 MONSTER'],
        ally:    ['type-ally',    '🛡️ ALLY'],
    };
    const [cls, label] = map[type] || ['type-monster', type];
    return `<span class="combatant-type-badge ${cls}">${label}</span>`;
}

function renderInitiativeList() {
    const list = document.getElementById('initiativeList');
    const empty = document.getElementById('initiativeEmpty');

    if (!list) return;

    if (combatants.length === 0) {
        list.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }

    if (empty) empty.style.display = 'none';

    list.innerHTML = combatants.map((c, idx) => {
        const isActive = idx === currentTurn;
        const isDead = c.hp <= 0;
        const status = getHpStatus(c.hp, c.maxHp);
        const hpPct = Math.max(0, c.hp / c.maxHp * 100);

        return `
            <div class="combatant-row ${isActive ? 'active-turn' : ''} ${isDead ? 'dead' : ''}" id="cbt-row-${c.id}">
                <!-- Initiative -->
                <div class="initiative-badge">${c.initiative}</div>

                <!-- Name + type + HP bar -->
                <div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                        <span class="combatant-name">${c.name}</span>
                        ${getTypeBadge(c.type)}
                        <span style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;" class="${status.cls}">${status.label}</span>
                    </div>
                    <!-- HP Bar -->
                    <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;max-width:200px;">
                        <div style="height:100%;width:${hpPct}%;background:${hpPct > 66 ? '#4caf7d' : hpPct > 33 ? '#e0a832' : '#e74c3c'};transition:width 0.3s;border-radius:2px;"></div>
                    </div>
                </div>

                <!-- HP Tracker -->
                <div class="hp-tracker">
                    <button class="hp-btn" onclick="changeHp(${c.id}, -1)" title="−1 HP">−</button>
                    <button class="hp-btn" onclick="changeHp(${c.id}, -5)" title="−5 HP" style="font-size:11px;">−5</button>
                    <div class="hp-display ${status.cls}">
                        <input type="number" value="${c.hp}" min="0" max="${c.maxHp}"
                            onchange="setHp(${c.id}, this.value)"
                            style="width:36px;background:none;border:none;color:inherit;font-family:'Cinzel',serif;font-size:13px;text-align:center;outline:none;">
                        <span style="color:var(--text-muted);font-size:11px;">/ ${c.maxHp}</span>
                    </div>
                    <button class="hp-btn" onclick="changeHp(${c.id}, +5)" title="+5 HP" style="font-size:11px;">+5</button>
                    <button class="hp-btn" onclick="changeHp(${c.id}, +1)" title="+1 HP">+</button>
                </div>

                <!-- AC -->
                <div class="ac-display">
                    <div style="font-size:9px;letter-spacing:1px;font-family:'Cinzel',serif;color:var(--text-muted);">AC</div>
                    <div style="font-size:16px;color:var(--blue);">${c.ac}</div>
                </div>

                <!-- Ação de turno atual -->
                ${isActive ? `<button class="btn btn-gold" onclick="nextTurn()" style="padding:6px 12px;font-size:10px;flex-shrink:0;">▶ END TURN</button>` : '<div></div>'}

                <!-- Remover -->
                <button class="delete-btn" onclick="removeCombatant(${c.id})" title="Remove" style="padding:4px 8px;font-size:10px;">✕</button>
            </div>
        `;
    }).join('');

    updateTurnIndicator();
}

// Inicializar renderização quando a seção abre
document.addEventListener('DOMContentLoaded', () => {
    renderInitiativeList();
});