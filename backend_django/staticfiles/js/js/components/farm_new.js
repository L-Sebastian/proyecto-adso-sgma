/* =====================================================
   FARM NEW — Listado de fincas con IndexedDB
===================================================== */

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

// ==================== CONSTANTES ====================
const FN_UNA_HORA_MS = 60 * 60 * 1000;

const fnIconEdit = '<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4l5 5L7 18H2v-5L11 4z"/><path d="M15 2l3 3"/></svg>';
const fnIconTrash = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';

// ==================== INDEXEDDB ====================
const FARMS_IDB_NAME    = 'farmsDB';
const FARMS_IDB_STORE   = 'farms';
const FARMS_IDB_VERSION = 1;

function openDB(dbName, storeName, version) {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, version);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
            }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror   = (e) => reject(e.target.error);
    });
}

async function getAllFarmsFromIDB() {
    const db = await openDB(FARMS_IDB_NAME, FARMS_IDB_STORE, FARMS_IDB_VERSION);
    return new Promise((resolve, reject) => {
        const tx = db.transaction(FARMS_IDB_STORE, 'readonly');
        const store = tx.objectStore(FARMS_IDB_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror   = () => reject(req.error);
    });
}

// Función asíncrona que reemplaza a la antigua fnCargarFincas
async function fnCargarFincas() {
    try {
        const fincas = await getAllFarmsFromIDB();
        if (fincas.length) return fincas;
    } catch (e) {
        console.warn('Error leyendo IndexedDB:', e);
    }
    // Fallback a localStorage por si hay datos antiguos
    try {
        return JSON.parse(localStorage.getItem('misFincas')) || [];
    } catch (e) {
        return [];
    }
}

// ==================== FUNCIONES DE RENDER ====================
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

async function fnRenderGrid(grid) {
    const todas = await fnCargarFincas();
    const ahora = Date.now();
    const nuevas = [], maduras = [];
    todas.forEach(f => {
        const edad = ahora - (f.fechaCreacion ? new Date(f.fechaCreacion).getTime() : 0);
        (edad >= FN_UNA_HORA_MS ? maduras : nuevas).push(f);
    });
    const nuevasActivas = nuevas.filter(f => f.activo !== false);
    const madurasActivas = maduras.filter(f => f.activo !== false);

    let html = '';
    html += nuevasActivas.map(f => fnBuildCard(f, true)).join('');
    html += madurasActivas.map(f => fnBuildCard(f, true)).join('');

    if (!html) {
        grid.innerHTML = '<div class="finca-vevo-empty" style="grid-column:1/-1;text-align:center;padding:40px;color:#6b7280;">'
            + '<p style="font-size:1.8rem;margin-bottom:16px;">🌱 Aún no tienes fincas registradas</p>'
            + '</div>';
    } else {
        grid.innerHTML = html;
    }
}

// ==================== PROGRAMAR MOVIMIENTO (hora) ====================
function fnProgramarMovimiento(callback) {
    fnCargarFincas().then(todas => {
        const ahora = Date.now();
        const tiempos = todas
            .filter(f => {
                return ahora - (f.fechaCreacion ? new Date(f.fechaCreacion).getTime() : 0) < FN_UNA_HORA_MS;
            })
            .map(f => {
                return FN_UNA_HORA_MS - (ahora - new Date(f.fechaCreacion).getTime());
            });
        if (tiempos.length === 0) return;
        const minTiempo = Math.min(...tiempos);
        setTimeout(() => callback(), minTiempo + 100);
    }).catch(() => {});
}

// ==================== INICIALIZACIÓN ====================
async function initFincaNew() {
    const grid = document.querySelector('.fincaGrid');
    const btnCrear = document.querySelector('.btnCrearFinca');
    const btnBack = document.querySelector('.btnGoBack');

    if (!grid) return;

    await fnRenderGrid(grid);
    fnProgramarMovimiento(() => fnRenderGrid(grid));

    // Eventos de la cuadrícula (editar, eliminar, deshabilitar, ver detalle)
    grid.addEventListener('click', async function (e) {
        const btnEdit = e.target.closest('.fn-btn-edit');
        const btnDisable = e.target.closest('.fn-btn-disable');
        const btnDelete = e.target.closest('.fn-btn-delete');
        const card = e.target.closest('.finca-vevo-card');

        if (btnDelete) {
            e.stopPropagation();
            if (!confirm('¿Eliminar esta finca?')) return;
            const id = btnDelete.dataset.id;
            // Eliminar de IndexedDB
            const db = await openDB(FARMS_IDB_NAME, FARMS_IDB_STORE, FARMS_IDB_VERSION);
            await new Promise((resolve, reject) => {
                const tx = db.transaction(FARMS_IDB_STORE, 'readwrite');
                const store = tx.objectStore(FARMS_IDB_STORE);
                const req = store.delete(id);
                req.onsuccess = resolve;
                req.onerror = reject;
            });
            // Eliminar también de la lista de IDs en localStorage (si existe)
            let ids = JSON.parse(localStorage.getItem('misFincas_ids')) || [];
            ids = ids.filter(i => i !== id);
            localStorage.setItem('misFincas_ids', JSON.stringify(ids));
            // Recargar grid
            await fnRenderGrid(grid);
        }
        else if (btnEdit) {
            e.stopPropagation();
            window.location.href = '/frontend/public/views/views_edit_farm.html?id=' + btnEdit.dataset.id;
        }
        else if (btnDisable) {
            e.stopPropagation();
            const id = btnDisable.dataset.id;
            // Obtener la finca actual
            const todas = await fnCargarFincas();
            const finca = todas.find(f => f.id === id);
            if (!finca) return;
            finca.activo = !finca.activo;
            // Actualizar en IndexedDB
            const db = await openDB(FARMS_IDB_NAME, FARMS_IDB_STORE, FARMS_IDB_VERSION);
            await new Promise((resolve, reject) => {
                const tx = db.transaction(FARMS_IDB_STORE, 'readwrite');
                const store = tx.objectStore(FARMS_IDB_STORE);
                const req = store.put(finca);
                req.onsuccess = resolve;
                req.onerror = reject;
            });
            // Recargar la tarjeta sin recargar toda la página
            const cardElement = btnDisable.closest('.finca-vevo-card');
            if (cardElement) {
                const newCardHtml = fnBuildCard(finca, true);
                cardElement.outerHTML = newCardHtml;
            } else {
                await fnRenderGrid(grid);
            }
        }
        else if (card) {
            const id = card.dataset.id;
            window.location.href = '/frontend/public/views/views_farm_details.html?id=' + id;
        }
    });

    if (btnCrear) {
        btnCrear.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_create_farm.html';
        });
    }
    if (btnBack) {
        btnBack.addEventListener('click', function () {
            // Redirige a la vista principal de productos (ajusta la ruta si es necesario)
            window.location.href = '/frontend/public/views/views_product_new.html';
        });
    }
}