document.addEventListener('DOMContentLoaded', function () {

    var container = document.querySelector('.main-content');
    if (!container) return;

    container.classList.add('finca-vevo-page-wrapper');

    fetch('/frontend/public/views/components/finca_new.html')
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

var iconEdit = '<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4l5 5L7 18H2v-5L11 4z"/><path d="M15 2l3 3"/></svg>';
var iconEnable = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>';
var iconDisable = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
var iconTrash = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';

function cargarFincas() {
    try { return JSON.parse(localStorage.getItem('misFincas')) || []; }
    catch (e) { return []; }
}

function guardarFincas(lista) {
    localStorage.setItem('misFincas', JSON.stringify(lista));
}

function buildFincaCard(f) {
    var nombre = f.nombreFinca || 'Sin nombre';
    var tipo = f.tipoProduccion || '';
    var depto = f.departamento || '';
    var municipio = f.municipio || '';
    var desc = f.descripcion || '';
    var foto = f.foto || '';
    var ubicacion = [municipio, depto].filter(Boolean).join(', ');

    var imgContent = foto
        ? `<img src="${foto}" alt="${nombre}" class="finca-vevo-card-img" onerror="this.style.opacity='0.2'">`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;">🌿</div>`;

    var disabled = f.activo === false;
    var cardClass = 'finca-vevo-card' + (disabled ? ' finca-card-disabled' : '');
    var toggleBtn = disabled
        ? `<button class="finca-btn-enable"  data-id="${f.id}">${iconEnable}  Habilitar</button>`
        : `<button class="finca-btn-disable" data-id="${f.id}">${iconDisable} Deshabilitar</button>`;

    return `
        <div class="${cardClass}" data-id="${f.id}">
            <div class="finca-vevo-card-img-box">
                ${imgContent}
                <button class="finca-btn-delete" data-id="${f.id}" title="Eliminar">${iconTrash}</button>
                ${disabled ? '<div class="finca-disabled-badge">Deshabilitada</div>' : ''}
            </div>
            <div class="finca-vevo-card-body">
                <span class="finca-vevo-card-name">${nombre}</span>
                <span class="finca-vevo-card-tipo">${tipo}</span>
                ${ubicacion ? `<span class="finca-vevo-card-location">📍 ${ubicacion}</span>` : ''}
                ${desc ? `<span class="finca-vevo-card-desc">${desc}</span>` : ''}
            </div>
            <div class="finca-vevo-card-actions">
                <button class="finca-btn-edit" data-id="${f.id}">${iconEdit} Editar</button>
                ${toggleBtn}
            </div>
        </div>`;
}

function renderFincaGrid(grid) {
    var fincas = cargarFincas();

    if (fincas.length === 0) {
        grid.innerHTML = `
            <div class="finca-vevo-empty">
                <p>🌱 Aún no tienes fincas registradas</p>
                <button class="finca-vevo-create-btn" onclick="window.location.href='/frontend/public/views/views_create_finca.html'">
                    + Crear tu primera finca
                </button>
            </div>`;
        return;
    }

    grid.innerHTML = fincas.map(buildFincaCard).join('');
}

function initFincaNew() {

    var grid = document.getElementById('fincaGrid');
    var btnCrear = document.getElementById('btnCrearFinca');
    var btnBack = document.getElementById('btnGoBackFinca');

    if (!grid) return;

    renderFincaGrid(grid);

    /* ── Eventos ── */
    grid.addEventListener('click', function (e) {
        var btnEdit = e.target.closest('.finca-btn-edit');
        var btnDelete = e.target.closest('.finca-btn-delete');

        if (btnEdit) {
            e.stopPropagation();
            window.location.href = '/frontend/public/views/views_create_finca.html?id=' + btnEdit.dataset.id;

        } else if (e.target.closest('.finca-btn-disable')) {
            e.stopPropagation();
            var id = e.target.closest('.finca-btn-disable').dataset.id;
            var fincas = cargarFincas().map(function (f) {
                if (f.id === id) f.activo = false;
                return f;
            });
            guardarFincas(fincas);
            renderFincaGrid(grid);

        } else if (e.target.closest('.finca-btn-enable')) {
            e.stopPropagation();
            var id = e.target.closest('.finca-btn-enable').dataset.id;
            var fincas = cargarFincas().map(function (f) {
                if (f.id === id) f.activo = true;
                return f;
            });
            guardarFincas(fincas);
            renderFincaGrid(grid);

        } else if (btnDelete) {
            e.stopPropagation();
            if (confirm('¿Eliminar esta finca?')) {
                var fincas = cargarFincas().filter(function (f) { return f.id !== btnDelete.dataset.id; });
                guardarFincas(fincas);
                renderFincaGrid(grid);
            }
        }
    });

    if (btnCrear) btnCrear.addEventListener('click', function () {
        window.location.href = '/frontend/public/views/views_create_farm.html';
    });

    if (btnBack) btnBack.addEventListener('click', function () { window.history.back(); });
}