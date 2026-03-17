document.addEventListener('DOMContentLoaded', function () {

    const container = document.querySelector('.page-wrapper');
    if (!container) return;

    fetch('/frontend/public/views/components/result_traction.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initTraction();
        })
        .catch(function (err) {
            console.error('Error cargando result_traction:', err);
            initTraction(); /* intentar con el DOM existente */
        });
});

function initTraction() {

    /* ── Leer datos guardados por pay.js ── */
    let result = {};
    try { result = JSON.parse(localStorage.getItem('payment_result')) || {}; } catch (e) {}

    /* ── Helpers ── */
    function set(cls, value) {
        const el = document.querySelector(cls);
        if (el) el.textContent = value || '—';
    }

    /* ── Rellenar recibo ── */
    set('.rt-nombre',      result.nombre      || '—');
    set('.rt-finca',       result.finca       || '—');
    set('.rt-nit',         result.nit         || '—');
    set('.rt-id-tx',       result.idTx        || generarIdTx());
    set('.rt-valor',       result.valor       || '—');
    set('.rt-descripcion', result.descripcion || '—');
    set('.rt-ref',         'Ref:' + (result.ref || '100'));
    set('.rt-banco',       result.banco       || 'Bancolombia');
    set('.rt-telefono',    result.telefono    || '—');
    set('.rt-fecha',       result.fecha       || fechaActual());

    /* ── Botón Ir al inicio ── */
    const btnInicio = document.querySelector('.btnIrAlInicio');
    if (btnInicio) {
        btnInicio.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/index_user.html';
        });
    }

    /* ── Botón Imprimir → descarga PDF ── */
    const btnImprimir = document.querySelector('.btnImprimir');
    if (btnImprimir) {
        btnImprimir.addEventListener('click', function () {
            window.print();
        });
    }
}

/* ── Utilidades ── */
function generarIdTx() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function fechaActual() {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const hora  = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
    return fecha + ', ' + hora;
}