document.addEventListener('DOMContentLoaded', function () {

    const container = document.querySelector('.main-content-create');
    if (!container) return;

    fetch('/static/views/components/create_product_step1.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initStep1();
        })
        .catch(function (err) {
            console.error('Error cargando create_product_step1:', err);
        });
});

function initStep1() {

    /* ── Referencias DOM ── */
    const photoInput      = document.querySelector('.photoInput');
    const avatarImg       = document.querySelector('.avatarImgProduct');
    const avatarSvg       = document.querySelector('.avatarSvgProduct');
    const btnSubirFoto    = document.querySelector('.btn-change-photo');
    const btnEliminarFoto = document.querySelector('.fpEdBtnEliminarFoto');
    const btnVolver       = document.querySelector('.fpEdBtnVolver');
    const btnSiguiente    = document.querySelector('#btnSiguiente');
    const form            = document.querySelector('.fpEdForm');

    if (!form) return;

    /* ── Campos del Paso 1 ── */
    const FIELDS_STEP1 = [
        { key: 'nombreProducto', cls: '.inputNombreProducto' },
        { key: 'tipoProducto',   cls: '.selectTipoProducto'  },
        { key: 'pesoProducto',   cls: '.inputPesoProducto'   },
        { key: 'tipoPeso',       cls: '.selectTipoPeso'       },
        { key: 'precioProducto', cls: '.inputPrecioProducto'  },
        { key: 'descuento',      cls: '.selectDescuento'      }
    ];

    let foto = localStorage.getItem('productPhoto') || '';

    /* ── Restaurar foto ── */
    if (foto && avatarImg) {
        avatarImg.src = foto;
        avatarImg.style.display = 'block';
        if (avatarSvg) avatarSvg.style.display = 'none';
    }

    /* ── Restaurar campos ── */
    FIELDS_STEP1.forEach(function (field) {
        const saved = localStorage.getItem('cp_' + field.key);
        if (saved !== null) {
            const el = document.querySelector(field.cls);
            if (el) {
                if (el.tagName === 'SELECT') {
                    for (let i = 0; i < el.options.length; i++) {
                        if (el.options[i].value === saved) { el.selectedIndex = i; break; }
                    }
                } else {
                    el.value = saved;
                }
            }
        }
    });

    /* ── Guardar en tiempo real ── */
    FIELDS_STEP1.forEach(function (field) {
        const el = document.querySelector(field.cls);
        if (el) {
            el.addEventListener('input',  function () { localStorage.setItem('cp_' + field.key, el.value); });
            el.addEventListener('change', function () { localStorage.setItem('cp_' + field.key, el.value); });
        }
    });

    /* ── Aplicar foto ── */
    function aplicarFoto(dataURL) {
        foto = dataURL;
        if (avatarImg) { avatarImg.src = dataURL; avatarImg.style.display = 'block'; }
        if (avatarSvg) avatarSvg.style.display = 'none';
        localStorage.setItem('productPhoto', dataURL);
    }

    /* ── Botón Subir Foto ── */
    if (btnSubirFoto && photoInput) {
        btnSubirFoto.addEventListener('click', function () { photoInput.click(); });
    }

    /* ── Leer archivo ── */
    if (photoInput) {
        photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) { aplicarFoto(e.target.result); };
            reader.readAsDataURL(file);
        });
    }

    /* ── Eliminar foto ── */
    if (btnEliminarFoto) {
        btnEliminarFoto.addEventListener('click', function () {
            foto = '';
            if (avatarImg) { avatarImg.src = ''; avatarImg.style.display = 'none'; }
            if (avatarSvg) avatarSvg.style.display = 'block';
            if (photoInput) photoInput.value = '';
            localStorage.removeItem('productPhoto');
        });
    }

    /* ── Botón Volver ── */
    if (btnVolver) {
        btnVolver.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('⬅️ Volviendo a views_product_new.html');
            window.location.href = '/static/views/views_product_new.html';
        });
    }

    /* ── Botón Siguiente ── */
    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', function (e) {
            e.preventDefault();
            
            /* Validar nombre obligatorio */
            const nombreEl = document.querySelector('.inputNombreProducto');
            if (!nombreEl || nombreEl.value.trim() === '') {
                nombreEl.focus();
                nombreEl.style.borderColor = '#ef4444';
                mostrarToast('❌ El nombre del producto es obligatorio', 'error');
                setTimeout(() => { nombreEl.style.borderColor = ''; }, 2000);
                return;
            }

            /* Guardar campos del paso 1 */
            FIELDS_STEP1.forEach(function (field) {
                const el = document.querySelector(field.cls);
                if (el) localStorage.setItem('cp_' + field.key, el.value);
            });

            console.log('➡️ Ir al paso 2');
            window.location.href = '/static/views/views_create_product_2.html';
        });
    }

    /* ── Mostrar Toast ── */
    function mostrarToast(mensaje, tipo = 'success') {
        const toast = document.createElement('div');
        toast.textContent = mensaje;
        const color = tipo === 'success' ? '#10b981' : '#ef4444';
        toast.style.cssText = `
            position: fixed;
            bottom: 32px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: ${color};
            color: #fff;
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 1.6rem;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => { toast.remove(); }, 300);
        }, 2000);
    }
}
