// -----------------------------
// toast.js - Sistema de notificações
// -----------------------------

(function() {
    // Injetar estilos
    const style = document.createElement('style');
    style.textContent = `
        #toast-container {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        }

        .toast {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px 18px;
            border-radius: 3px;
            min-width: 280px;
            max-width: 380px;
            pointer-events: all;
            font-family: 'Crimson Text', serif;
            font-size: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            animation: toastIn 0.3s ease both;
            position: relative;
            overflow: hidden;
        }

        .toast.hiding {
            animation: toastOut 0.3s ease both;
        }

        .toast::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 1px;
        }

        .toast-success {
            background: #0f1f16;
            border: 1px solid rgba(76,175,125,0.3);
            color: #a8dfc0;
        }
        .toast-success::before { background: linear-gradient(to right, transparent, #4caf7d, transparent); }

        .toast-error {
            background: #1f0f0f;
            border: 1px solid rgba(192,57,43,0.3);
            color: #e8a8a8;
        }
        .toast-error::before { background: linear-gradient(to right, transparent, #c0392b, transparent); }

        .toast-info {
            background: #0f141f;
            border: 1px solid rgba(201,168,76,0.3);
            color: #e8d8a8;
        }
        .toast-info::before { background: linear-gradient(to right, transparent, #c9a84c, transparent); }

        .toast-icon {
            font-size: 18px;
            flex-shrink: 0;
            margin-top: 1px;
        }

        .toast-body { flex: 1; }

        .toast-title {
            font-family: 'Cinzel', serif;
            font-size: 11px;
            letter-spacing: 2px;
            margin-bottom: 2px;
            opacity: 0.7;
        }

        .toast-success .toast-title { color: #4caf7d; }
        .toast-error .toast-title { color: #c0392b; }
        .toast-info .toast-title { color: #c9a84c; }

        .toast-msg { line-height: 1.4; }

        .toast-close {
            background: none;
            border: none;
            color: inherit;
            opacity: 0.4;
            cursor: pointer;
            font-size: 16px;
            padding: 0;
            flex-shrink: 0;
            transition: opacity 0.2s;
            font-family: inherit;
        }
        .toast-close:hover { opacity: 1; }

        .toast-progress {
            position: absolute;
            bottom: 0; left: 0;
            height: 2px;
            animation: toastProgress linear both;
        }
        .toast-success .toast-progress { background: #4caf7d; }
        .toast-error .toast-progress { background: #c0392b; }
        .toast-info .toast-progress { background: #c9a84c; }

        @keyframes toastIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes toastOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(20px); }
        }

        @keyframes toastProgress {
            from { width: 100%; }
            to { width: 0%; }
        }
    `;
    document.head.appendChild(style);

    // Criar container
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);

    const ICONS = { success: '⚔️', error: '💀', info: '📜' };
    const TITLES = { success: 'SUCCESS', error: 'FAILED', info: 'NOTICE' };
    const DURATION = { success: 3000, error: 4000, info: 3000 };

    window.toast = function(message, type = 'info') {
        const el = document.createElement('div');
        el.className = `toast toast-${type}`;
        const dur = DURATION[type] || 3000;

        el.innerHTML = `
            <span class="toast-icon">${ICONS[type]}</span>
            <div class="toast-body">
                <div class="toast-title">${TITLES[type]}</div>
                <div class="toast-msg">${message}</div>
            </div>
            <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>
            <div class="toast-progress" style="animation-duration: ${dur}ms"></div>
        `;

        container.appendChild(el);

        setTimeout(() => {
            el.classList.add('hiding');
            setTimeout(() => el.remove(), 300);
        }, dur);
    };

    window.toast.success = msg => window.toast(msg, 'success');
    window.toast.error = msg => window.toast(msg, 'error');
    window.toast.info = msg => window.toast(msg, 'info');
})();