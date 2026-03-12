document.addEventListener('DOMContentLoaded', function () {

    const container = document.querySelector('.main-contentFa');
    if (!container) return;

    fetch('/frontend/public/views/components/farm_admin.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initFarmNew2();
        })
        .catch(function (err) {
            console.error('Error cargando farm_new2:', err);
        });
});

const FN2_UNA_HORA_MS = 60 * 60 * 1000;

const fn2IconEdit = '<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4l5 5L7 18H2v-5L11 4z"/><path d="M15 2l3 3"/></svg>';
const fn2IconTrash = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';

function fn2CargarFincas() {
    try { return JSON.parse(localStorage.getItem('misFincas')) || []; }
    catch (e) { return []; }
}
function fn2GuardarFincas(lista) {
    localStorage.setItem('misFincas', JSON.stringify(lista));
}

function fn2Clasificar() {
    let todas = fn2CargarFincas();
    let ahora = Date.now();
    const nuevas = [], maduras = [];
    todas.forEach(function (f) {
        const edad = ahora - (f.fechaCreacion ? new Date(f.fechaCreacion).getTime() : 0);
        (edad >= FN2_UNA_HORA_MS ? maduras : nuevas).push(f);
    });
    return { nuevas: nuevas, maduras: maduras };
}

function fn2BuildCard(f, esMia) {
    const nombre = f.nombreFinca || 'Sin nombre';
    const tipo = f.tipoProduccion || '';
    const depto = f.departamento || '';
    const propietario = [f.nombre, f.apellido].filter(Boolean).join(' ');
    const desc = f.descripcion || '';
    const foto = f.foto || '';
    const activo = f.activo !== false;

    const deleteBtn = esMia
        ? '<button class="fn2-btn-delete" data-id="' + f.id + '" title="Eliminar">' + fn2IconTrash + '</button>'
        : '';

    return '<div class="finca-card" data-id="' + f.id + '">'
        + deleteBtn
        + '<div class="finca-card-img-box">'
        + (foto
            ? '<img src="' + foto + '" alt="' + nombre + '" class="finca-card-img" onerror="this.style.opacity=\'0.3\'">'
            : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;">🌿</div>')
        + '</div>'
        + '<div class="finca-card-body">'
        + '<span class="finca-card-name">' + nombre + '</span>'
        + (tipo ? '<span class="finca-card-tipo">' + tipo + '</span>' : '')
        + (depto ? '<span class="finca-card-location">📍 ' + depto + '</span>' : '')
        + (propietario ? '<span class="finca-card-owner">👤 ' + propietario + '</span>' : '')
        + (desc ? '<span class="finca-card-desc">' + desc + '</span>' : '')
        + '<div class="finca-card-actions">'
        + '<button class="fn2-btn-edit" data-id="' + f.id + '">' + fn2IconEdit + ' Editar</button>'
        + '<button class="fn2-btn-disable' + (activo ? '' : ' fn2-disabled') + '" data-id="' + f.id + '">'
        + (activo ? 'Deshabilitar' : 'Habilitar')
        + '</button>'
        + '</div>'
        + '</div>'
        + '</div>';
}

/* ── Render grid "Fincas Nuevas" (< 1h) ── */
function fn2RenderNuevas(grid) {
    const c = fn2Clasificar();
    const nuevas = c.nuevas.filter(function (f) { return f.activo !== false; });

    grid.innerHTML = nuevas.length
        ? nuevas.map(function (f) { return fn2BuildCard(f, true); }).join('')
        : '<p style="text-align:center;color:#666;padding:24px;grid-column:1/-1;">No hay fincas nuevas recientes.</p>';
}

/* ── Render grid "Mis Fincas" (>= 1h) ── */
function fn2RenderMias(grid) {
    const c = fn2Clasificar();
    const mias = c.maduras;   /* todas — activas y deshabilitadas */

    grid.innerHTML = mias.length
        ? mias.map(function (f) { return fn2BuildCard(f, true); }).join('')
        : '<p style="text-align:center;color:#666;padding:24px;grid-column:1/-1;">Aún no tienes fincas registradas.</p>';
}

function initFarmNew2() {

    const gridNuevas = document.querySelector('.fincaGridNuevas');
    const gridMias = document.querySelector('.fincaGridMias');
    const btnCrear = document.querySelector('.btnCrearFinca');
    const btnBack = document.querySelector('.btnGoBackFinca');

    if (gridNuevas) {
        fn2RenderNuevas(gridNuevas);
        fn2ProgramarActualizacion(gridNuevas, gridMias);

        gridNuevas.addEventListener('click', function (e) {
            fn2HandleClick(e, gridNuevas, gridMias);
        });
    }

    if (gridMias) {
        fn2RenderMias(gridMias);

        gridMias.addEventListener('click', function (e) {
            fn2HandleClick(e, gridNuevas, gridMias);
        });
    }

    if (btnCrear) btnCrear.addEventListener('click', function () {
        window.location.href = '/frontend/public/views/views_create_farm.html';
    });
    if (btnBack) btnBack.addEventListener('click', function () { window.history.back(); });
}

function fn2HandleClick(e, gridNuevas, gridMias) {
    const btnEdit = e.target.closest('.fn2-btn-edit');
    const btnDisable = e.target.closest('.fn2-btn-disable');
    const btnDelete = e.target.closest('.fn2-btn-delete');
    const card = e.target.closest('.finca-card');
    let todas = fn2CargarFincas();

    if (btnDelete) {
        e.stopPropagation();
        if (confirm('¿Eliminar esta finca?')) {
            fn2GuardarFincas(todas.filter(function (f) { return f.id !== btnDelete.dataset.id; }));
            fn2RenderNuevas(gridNuevas);
            fn2RenderMias(gridMias);
        }

    } else if (btnEdit) {
        e.stopPropagation();
        window.location.href = '/frontend/public/views/views_edit_farm.html?id=' + btnEdit.dataset.id;

    } else if (btnDisable) {
        e.stopPropagation();
        let id = btnDisable.dataset.id;
        const finca = todas.find(function (f) { return f.id === id; });
        if (!finca) return;
        finca.activo = !finca.activo;
        fn2GuardarFincas(todas);
        /* Re-render ambos grids porque puede moverse de sección */
        fn2RenderNuevas(gridNuevas);
        fn2RenderMias(gridMias);
    } else if (card) {
        /* Click en la card → ir al detalle del producto */
        let id = card.dataset.id;
        window.location.href = '/frontend/public/views/views_farm_details.html?id=' + id;
    }
}

function fn2ProgramarActualizacion(gridNuevas, gridMias) {
    let todas = fn2CargarFincas();
    let ahora = Date.now();
    const tiempos = todas
        .filter(function (f) {
            return ahora - (f.fechaCreacion ? new Date(f.fechaCreacion).getTime() : 0) < FN2_UNA_HORA_MS;
        })
        .map(function (f) {
            return FN2_UNA_HORA_MS - (ahora - new Date(f.fechaCreacion).getTime());
        });
    if (tiempos.length === 0) return;
    setTimeout(function () {
        fn2RenderNuevas(gridNuevas);
        fn2RenderMias(gridMias);
        fn2ProgramarActualizacion(gridNuevas, gridMias);
    }, Math.min.apply(null, tiempos) + 100);
}