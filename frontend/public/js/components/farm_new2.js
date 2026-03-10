document.addEventListener('DOMContentLoaded', function () {

    var container = document.querySelector('.main-content');
    if (!container) return;

    fetch('/frontend/public/views/components/farm_new2.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initFinca();
        })
        .catch(function (err) {
            console.error('Error cargando finca:', err);
        });
});

/* ── Iconos ── */
var iconEdit    = '<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4l5 5L7 18H2v-5L11 4z"/><path d="M15 2l3 3"/></svg>';
var iconTrash   = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';
var iconDisable = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
var iconEnable  = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>';

/* ── Helpers localStorage ── */
function cargarFincas() {
    try { return JSON.parse(localStorage.getItem('misFincas')) || []; }
    catch (e) { return []; }
}
function guardarFincas(lista) {
    localStorage.setItem('misFincas', JSON.stringify(lista));
}

/* ── Construir card ── */
function buildCard(f) {
    var nombre   = f.nombreFinca    || f.fpFinca || 'Sin nombre';
    var tipo     = f.tipoProduccion || '';
    var depto    = f.departamento   || '';
    var desc     = f.descripcion    || '';
    var foto     = f.foto           || '';
    var disabled = f.activo === false;

    var cardClass = 'finca-card' + (disabled ? ' finca-card-disabled' : '');

    var imgContent = foto
        ? '<img src="' + foto + '" alt="' + nombre + '" class="finca-card-img" onerror="this.style.opacity=\'0.2\'">'
        : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;">🌿</div>';

    var toggleBtn = disabled
        ? '<button class="finca-btn-enable"  data-id="' + f.id + '">' + iconEnable  + ' Habilitar</button>'
        : '<button class="finca-btn-disable" data-id="' + f.id + '">' + iconDisable + ' Deshabilitar</button>';

    return [
        '<div class="' + cardClass + '" data-id="' + f.id + '">',
        '  <div class="finca-card-img-box">',
        '    ' + imgContent,
        '    <button class="finca-btn-delete" data-id="' + f.id + '" title="Eliminar">' + iconTrash + '</button>',
        disabled ? '    <div class="finca-disabled-badge">Deshabilitada</div>' : '',
        '  </div>',
        '  <div class="finca-card-body">',
        '    <span class="finca-card-name">' + nombre + '</span>',
        tipo   ? '<span class="finca-card-tipo">' + tipo + '</span>'   : '',
        depto  ? '<span class="finca-card-location">📍 ' + depto + '</span>' : '',
        desc   ? '<span class="finca-card-desc">' + desc + '</span>'  : '',
        '  </div>',
        '  <div class="finca-card-actions">',
        '    <button class="finca-btn-edit" data-id="' + f.id + '">' + iconEdit + ' Editar</button>',
        '    ' + toggleBtn,
        '  </div>',
        '</div>'
    ].join('');
}

/* ── Render grids ── */
function renderGrids() {
    var gridNuevas = document.getElementById('fincaGridNuevas');
    var gridMias   = document.getElementById('fincaGridMias');
    if (!gridNuevas || !gridMias) return;

    var fincas = cargarFincas();
    var ahora  = Date.now();
    var UNA_HORA = 60 * 60 * 1000;

    /* Nuevas: creadas hace menos de 1h y activas */
    var nuevas = fincas.filter(function (f) {
        var edad = ahora - new Date(f.fechaCreacion).getTime();
        return edad < UNA_HORA && f.activo !== false;
    });

    /* Mis fincas: todas (activas y deshabilitadas) */
    var mias = fincas.filter(function (f) {
        var edad = ahora - new Date(f.fechaCreacion).getTime();
        return edad >= UNA_HORA || f.activo === false;
    });

    gridNuevas.innerHTML = nuevas.length
        ? nuevas.map(buildCard).join('')
        : '<div class="finca-empty">No hay fincas nuevas recientes</div>';

    gridMias.innerHTML = mias.length
        ? mias.map(buildCard).join('')
        : '<div class="finca-empty">🌱 Aún no tienes fincas registradas</div>';
}

/* ── Init ── */
function initFinca() {

    renderGrids();

    var btnCrear = document.getElementById('btnCrearFinca');
    var btnBack  = document.getElementById('btnGoBackFinca');

    /* Delegación de eventos en toda la página */
    document.addEventListener('click', function (e) {

        if (e.target.closest('.finca-btn-edit')) {
            e.stopPropagation();
            var id = e.target.closest('.finca-btn-edit').dataset.id;
            window.location.href = '/frontend/public/views/views_create_farm.html?id=' + id;

        } else if (e.target.closest('.finca-btn-disable')) {
            e.stopPropagation();
            var id = e.target.closest('.finca-btn-disable').dataset.id;
            var lista = cargarFincas().map(function (f) {
                if (f.id === id) f.activo = false;
                return f;
            });
            guardarFincas(lista);
            renderGrids();

        } else if (e.target.closest('.finca-btn-enable')) {
            e.stopPropagation();
            var id = e.target.closest('.finca-btn-enable').dataset.id;
            var lista = cargarFincas().map(function (f) {
                if (f.id === id) f.activo = true;
                return f;
            });
            guardarFincas(lista);
            renderGrids();

        } else if (e.target.closest('.finca-btn-delete')) {
            e.stopPropagation();
            var id = e.target.closest('.finca-btn-delete').dataset.id;
            if (confirm('¿Eliminar esta finca?')) {
                guardarFincas(cargarFincas().filter(function (f) { return f.id !== id; }));
                renderGrids();
            }
        }
    });

    if (btnCrear) btnCrear.addEventListener('click', function () {
        window.location.href = '/frontend/public/views/views_create_farm.html';
    });

    if (btnBack) btnBack.addEventListener('click', function () { window.history.back(); });
}