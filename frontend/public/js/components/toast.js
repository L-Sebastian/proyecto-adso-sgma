// toast.js - Módulo de notificaciones reutilizable
const ToastModule = (function () {

    let toast     = null;
    let toastIcon = null;
    let toastText = null;
    let timeoutId = null;

    function init() {
        toast     = document.querySelector('.toastMessage');
        toastIcon = document.querySelector('.toastIcon');
        toastText = document.querySelector('.toastText');

        if (!toast) {
            /* Crear e insertar el toast dinámicamente si no existe en el DOM */
            const el = document.createElement('div');
            el.className = 'toast-notification toastMessage';
            el.setAttribute('role', 'alert');
            el.setAttribute('aria-live', 'assertive');
            el.innerHTML = '<span class="toast-icon toastIcon"></span>' +
                           '<span class="toast-text toastText"></span>';
            document.body.appendChild(el);
            toast     = el;
            toastIcon = el.querySelector('.toastIcon');
            toastText = el.querySelector('.toastText');
        }

        return true;
    }

    function show(message, type, duration) {
        type     = type     || 'error';
        duration = duration || 3000;

        if (!toast) init();

        if (timeoutId) clearTimeout(timeoutId);

        const icons = { error: '❌', success: '✅', warning: '⚠️', info: 'ℹ️' };
        toastIcon.textContent = icons[type] || '⚠️';
        toastText.textContent = message;
        toast.className = 'toast-notification toastMessage ' + type;
        toast.classList.add('show');

        timeoutId = setTimeout(function () {
            toast.classList.remove('show');
            timeoutId = null;
        }, duration);
    }

    function hide() {
        if (toast) {
            toast.classList.remove('show');
            if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
        }
    }

    return {
        init:    init,
        show:    show,
        hide:    hide,
        error:   function (msg) { show(msg, 'error');   },
        success: function (msg) { show(msg, 'success'); },
        warning: function (msg) { show(msg, 'warning'); },
        info:    function (msg) { show(msg, 'info');    }
    };
})();