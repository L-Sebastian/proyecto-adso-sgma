document.addEventListener('DOMContentLoaded', function () {

    const container = document.querySelector('.main-content');
    if (!container) return;

    container.classList.add('finca-vevo-page');

    fetch('/frontend/public/views/components/farm_new.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initFincaNew();
        })
        .catch(function (err) {
            console.error('Error cargando finca_new:', err);
        });
});

const FN_UNA_HORA_MS = 60 * 60 * 1000;

const fnIconEdit = '<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4l5 5L7 18H2v-5L11 4z"/><path d="M15 2l3 3"/></svg>';
const fnIconTrash = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';

function fnCargarFincas() {
    try { return JSON.parse(localStorage.getItem('misFincas')) || []; }
    catch (e) { return []; }
}
function fnGuardarFincas(lista) {
    localStorage.setItem('misFincas', JSON.stringify(lista));
}

function fnClasificar() {
    let todas = fnCargarFincas();
    let ahora = Date.now();
    let nuevas = [], maduras = [];
    todas.forEach(function (f) {
        const edad = ahora - (f.fechaCreacion ? new Date(f.fechaCreacion).getTime() : 0);
        (edad >= FN_UNA_HORA_MS ? maduras : nuevas).push(f);
    });
    return { nuevas: nuevas, maduras: maduras };
}

function fnBuildCard(f, esMia) {
    const nombre = f.nombreFinca || 'Sin nombre';
    const tipo = f.tipoProduccion || '';
    const depto = f.departamento || '';
    const desc = f.descripcion || '';
    const foto = f.foto || '';
    const activo = f.activo !== false;

    const deleteBtn = esMia
        ? '<button class="fn-btn-delete" data-id="' + f.id + '" title="Eliminar">' + fnIconTrash + '</button>'
        : '';

    return '<div class="finca-vevo-card" data-id="' + f.id + '">'
        + deleteBtn
        + '<div class="finca-vevo-card-img-box">'
        + (foto
            ? '<img src="' + foto + '" alt="' + nombre + '" class="finca-vevo-card-img" onerror="this.style.opacity=\'0.3\'">'
            : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;">🌿</div>')
        + '</div>'
        + '<div class="finca-vevo-card-body">'
        + '<span class="finca-vevo-card-name">' + nombre + '</span>'
        + (tipo ? '<span class="finca-vevo-card-tipo">' + tipo + '</span>' : '')
        + (depto ? '<span class="finca-vevo-card-location">📍 ' + depto + '</span>' : '')
        + (desc ? '<span class="finca-vevo-card-desc">' + desc + '</span>' : '')
        + '<div class="finca-vevo-card-actions">'
        + '<button class="fn-btn-edit" data-id="' + f.id + '">' + fnIconEdit + ' Editar</button>'
        + '<button class="fn-btn-disable' + (activo ? '' : ' fn-disabled') + '" data-id="' + f.id + '">'
        + (activo ? 'Deshabilitar' : 'Habilitar')
        + '</button>'
        + '</div>'
        + '</div>'
        + '</div>';
}

function fnRenderGrid(grid) {
    const c = fnClasificar();

    /* Nuevas activas primero */
    const nuevasActivas = c.nuevas.filter(function (f) { return f.activo !== false; });

    /* Maduras activas */
    const madura = c.maduras.filter(function (f) { return f.activo !== false; });

    let html = '';
    html += nuevasActivas.map(function (f) { return fnBuildCard(f, true); }).join('');
    html += madura.map(function (f) { return fnBuildCard(f, true); }).join('');

    grid.innerHTML = html || '<div class="finca-vevo-empty" style="grid-column:1/-1;text-align:center;padding:40px;color:#6b7280;">'
        + '<p style="font-size:1.8rem;margin-bottom:16px;">🌱 Aún no tienes fincas registradas</p>'
        + '<button class="finca-vevo-create-btn" onclick="window.location.href=\'/frontend/public/views/views_create_farm.html\'">+ Crear tu primera finca</button>'
        + '</div>';
}

function initFincaNew() {

    const grid = document.querySelector('.fincaGrid');
    const btnCrear = document.querySelector('.btnCrearFinca');
    const btnBack = document.querySelector('.btnGoBackFinca');

    if (!grid) return;

    fnRenderGrid(grid);
    fnProgramarMovimiento(function () { fnRenderGrid(grid); });

    grid.addEventListener('click', function (e) {
        const btnEdit = e.target.closest('.fn-btn-edit');
        const btnDisable = e.target.closest('.fn-btn-disable');
        const btnDelete = e.target.closest('.fn-btn-delete');
        const card       = e.target.closest('.finca-vevo-card');
        let todas = fnCargarFincas();

        if (btnDelete) {
            e.stopPropagation();
            if (confirm('¿Eliminar esta finca?')) {
                fnGuardarFincas(todas.filter(function (f) { return f.id !== btnDelete.dataset.id; }));
                fnRenderGrid(grid);
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
            fnGuardarFincas(todas);
            btnDisable.textContent = finca.activo ? 'Deshabilitar' : 'Habilitar';
            btnDisable.classList.toggle('fn-disabled', !finca.activo);
        } else if (card) {
            /* Click en la card → ir al detalle del producto */
            let id = card.dataset.id;
            window.location.href = '/frontend/public/views/views_farm_details.html?id=' + id;
        }
    });

    if (btnCrear) btnCrear.addEventListener('click', function () {
        window.location.href = '/frontend/public/views/views_create_farm.html';
    });
    if (btnBack) btnBack.addEventListener('click', function () { window.history.back(); });   
}

function fnProgramarMovimiento(callback) {
    let todas = fnCargarFincas();
    let ahora = Date.now();
    const tiempos = todas
        .filter(function (f) {
            return ahora - (f.fechaCreacion ? new Date(f.fechaCreacion).getTime() : 0) < FN_UNA_HORA_MS;
        })
        .map(function (f) {
            return FN_UNA_HORA_MS - (ahora - new Date(f.fechaCreacion).getTime());
        });
    if (tiempos.length === 0) return;
    setTimeout(function () { callback(); }, Math.min.apply(null, tiempos) + 100);
}