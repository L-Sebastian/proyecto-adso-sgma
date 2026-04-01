/* ══════════════════════════════════════════════════════════════════
   UTILIDADES DE ALMACENAMIENTO DE PRODUCTOS CON IMÁGENES
   ══════════════════════════════════════════════════════════════════

   Este archivo proporciona funciones para guardar y recuperar productos
   con imágenes de alta resolución sin sobrecargar localStorage.

   Estrategia:
   - Las imágenes se guardan en IndexedDB (base de datos 'productPhotoDB').
   - Los metadatos del producto se guardan en IndexedDB (base de datos 'productsDB').
   - localStorage solo contiene referencias (IDs) a los productos.
   ══════════════════════════════════════════════════════════════════ */

const PRODUCTS_IDB_NAME    = 'productsDB';
const PRODUCTS_IDB_STORE   = 'products';
const PRODUCTS_IDB_VERSION = 1;

/**
 * Abre la base de datos IndexedDB para productos.
 * @returns {Promise<IDBDatabase>}
 */
function openProductsDB() {
    return new Promise(function (resolve, reject) {
        const req = indexedDB.open(PRODUCTS_IDB_NAME, PRODUCTS_IDB_VERSION);
        req.onupgradeneeded = function (e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(PRODUCTS_IDB_STORE)) {
                db.createObjectStore(PRODUCTS_IDB_STORE, { keyPath: 'id' });
            }
        };
        req.onsuccess = function (e) { resolve(e.target.result); };
        req.onerror   = function (e) { reject(e.target.error);  };
    });
}

/**
 * Guarda un producto en IndexedDB.
 * @param {Object} product - Objeto producto con todas sus propiedades.
 * @returns {Promise<void>}
 */
function saveProductIDB(product) {
    return openProductsDB().then(function (db) {
        return new Promise(function (resolve, reject) {
            const tx    = db.transaction(PRODUCTS_IDB_STORE, 'readwrite');
            const store = tx.objectStore(PRODUCTS_IDB_STORE);
            const req   = store.put(product);
            req.onsuccess = function () { resolve(); };
            req.onerror   = function (e) { reject(e.target.error); };
        });
    });
}

/**
 * Obtiene un producto desde IndexedDB por su ID.
 * @param {string} productId - ID del producto.
 * @returns {Promise<Object|null>}
 */
function getProductIDB(productId) {
    return openProductsDB().then(function (db) {
        return new Promise(function (resolve, reject) {
            const tx    = db.transaction(PRODUCTS_IDB_STORE, 'readonly');
            const store = tx.objectStore(PRODUCTS_IDB_STORE);
            const req   = store.get(productId);
            req.onsuccess = function (e) { resolve(e.target.result || null); };
            req.onerror   = function (e) { reject(e.target.error); };
        });
    });
}

/**
 * Obtiene todos los productos desde IndexedDB.
 * @returns {Promise<Array>}
 */
function getAllProductsIDB() {
    return openProductsDB().then(function (db) {
        return new Promise(function (resolve, reject) {
            const tx    = db.transaction(PRODUCTS_IDB_STORE, 'readonly');
            const store = tx.objectStore(PRODUCTS_IDB_STORE);
            const req   = store.getAll();
            req.onsuccess = function (e) { resolve(e.target.result || []); };
            req.onerror   = function (e) { reject(e.target.error); };
        });
    });
}

/**
 * Elimina un producto desde IndexedDB.
 * @param {string} productId - ID del producto.
 * @returns {Promise<void>}
 */
function deleteProductIDB(productId) {
    return openProductsDB().then(function (db) {
        return new Promise(function (resolve, reject) {
            const tx    = db.transaction(PRODUCTS_IDB_STORE, 'readwrite');
            const store = tx.objectStore(PRODUCTS_IDB_STORE);
            const req   = store.delete(productId);
            req.onsuccess = function () { resolve(); };
            req.onerror   = function (e) { reject(e.target.error); };
        });
    });
}

/**
 * Guarda la lista de productos en localStorage (solo IDs).
 * Los productos completos están en IndexedDB.
 * @param {Array<string>} productIds - Array de IDs de productos.
 */
function saveProductIDsToLocalStorage(productIds) {
    try {
        localStorage.setItem('misProductos_ids', JSON.stringify(productIds));
    } catch (err) {
        console.error('Error guardando IDs de productos en localStorage:', err);
    }
}

/**
 * Obtiene la lista de IDs de productos desde localStorage.
 * @returns {Array<string>}
 */
function getProductIDsFromLocalStorage() {
    try {
        return JSON.parse(localStorage.getItem('misProductos_ids')) || [];
    } catch (err) {
        console.error('Error recuperando IDs de productos desde localStorage:', err);
        return [];
    }
}

/**
 * Obtiene todos los productos (desde IndexedDB usando los IDs de localStorage).
 * @returns {Promise<Array>}
 */
function getAllProducts() {
    const productIds = getProductIDsFromLocalStorage();
    
    if (productIds.length === 0) {
        return Promise.resolve([]);
    }

    return getAllProductsIDB().then(function (products) {
        /* Filtrar solo los productos que están en la lista de IDs */
        return products.filter(function (p) {
            return productIds.includes(p.id);
        });
    });
}

/**
 * Agrega un nuevo producto a la lista.
 * @param {Object} product - Objeto producto.
 * @returns {Promise<void>}
 */
function addProduct(product) {
    return saveProductIDB(product).then(function () {
        const productIds = getProductIDsFromLocalStorage();
        if (!productIds.includes(product.id)) {
            productIds.push(product.id);
            saveProductIDsToLocalStorage(productIds);
        }
    });
}

/**
 * Migra productos antiguos desde localStorage a IndexedDB.
 * (Para compatibilidad con versiones anteriores que guardaban en localStorage)
 * @returns {Promise<void>}
 */
function migrateOldProducts() {
    try {
        const oldData = localStorage.getItem('misProductos');
        if (!oldData) return Promise.resolve();

        const oldProducts = JSON.parse(oldData);
        if (!Array.isArray(oldProducts) || oldProducts.length === 0) {
            return Promise.resolve();
        }

        /* Guardar cada producto en IndexedDB */
        const promises = oldProducts.map(function (product) {
            return saveProductIDB(product);
        });

        return Promise.all(promises).then(function () {
            /* Actualizar la lista de IDs */
            const productIds = oldProducts.map(function (p) { return p.id; });
            saveProductIDsToLocalStorage(productIds);
            console.log('✅ Migración completada: ' + oldProducts.length + ' productos movidos a IndexedDB');
        });
    } catch (err) {
        console.error('Error durante la migración de productos:', err);
        return Promise.resolve();
    }
}

/**
 * Inicializa el sistema de almacenamiento (ejecutar al cargar la página).
 * @returns {Promise<void>}
 */
function initProductStorage() {
    return migrateOldProducts();
}