document.addEventListener('DOMContentLoaded', function () {

    const container = document.querySelector('.main-content-create');
    if (!container) return;

    fetch('/static/views/components/create_product.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initProductCreate();
        })
        .catch(function (err) {
            console.error('Error cargando create_product:', err);
        });
});

function initProductCreate() {

    /* ── Referencias DOM ── */
    const photoInput      = document.querySelector('.photoInput');
    const avatarImg       = document.querySelector('.avatarImgProduct');
    const avatarSvg       = document.querySelector('.avatarSvgProduct');
    const btnSubirFoto    = document.querySelector('.btn-change-photo');
    const btnEliminarFoto = document.querySelector('.fpEdBtnEliminarFoto');
    const btnVolver       = document.querySelector('.fpEdBtnVolver');
    const form            = document.querySelector('.fpEdForm');
    const btnPublicar     = document.querySelector('.fpEd-btn-primary'); // Botón publicar

    if (!form) return;

    /* ── Mapeo campos ← clases únicas del HTML ── */
    const FIELDS = [
        { key: 'nombreProducto', cls: '.inputNombreProducto' },
        { key: 'tipoProducto',   cls: '.selectTipoProducto'  },
        { key: 'pesoProducto',   cls: '.inputPesoProducto'   },
        { key: 'tipoPeso',       cls: '.selectTipoPeso'       },
        { key: 'precioProducto', cls: '.inputPrecioProducto'  },
        { key: 'descuento',      cls: '.selectDescuento'      },
        { key: 'nombreFinca',    cls: '.inputNombreFinca'     },
        { key: 'stock',          cls: '.inputStock'           },
        { key: 'direccionFinca', cls: '.inputDireccionFinca'  },
        { key: 'tipoEnvio',      cls: '.selectTipoEnvio'      },
        { key: 'descripcion',    cls: '.inputDescripcion'     }
    ];

    let foto = localStorage.getItem('productPhoto') || '';

    /* ── Restaurar foto ── */
    if (foto && avatarImg) {
        avatarImg.src = foto;
        avatarImg.style.display = 'block';
        if (avatarSvg) avatarSvg.style.display = 'none';
    }

    /* ── Restaurar campos ── */
    FIELDS.forEach(function (field) {
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
    FIELDS.forEach(function (field) {
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

    /* ============================================
       BOTÓN VOLVER - REDIRIGE A views_product_new.html
       ============================================ */
    if (btnVolver) {
        btnVolver.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('⬅️ Volviendo a views_product_new.html');
            window.location.href = '/static/views/views_product_new.html';
        });
    }

    /* ============================================
       FUNCIÓN PARA GUARDAR Y PUBLICAR PRODUCTO
       ============================================ */
    function publicarProducto() {
        /* Validar nombre obligatorio */
        const nombreEl = document.querySelector('.inputNombreProducto');
        if (!nombreEl || nombreEl.value.trim() === '') {
            nombreEl.focus();
            nombreEl.style.borderColor = '#ef4444';
            mostrarToast('❌ El nombre del producto es obligatorio', 'error');
            return false;
        }
        nombreEl.style.borderColor = '';

        /* Guardar todos los campos */
        FIELDS.forEach(function (field) {
            const el = document.querySelector(field.cls);
            if (el) localStorage.setItem('cp_' + field.key, el.value);
        });

        /* Construir objeto producto */
        const precioRaw   = document.querySelector('.inputPrecioProducto')?.value || '0';
        const precioNum   = parseInt(String(precioRaw).replace(/[^0-9]/g, ''), 10) || 0;
        const descVal     = document.querySelector('.selectDescuento')?.value || 'no';
        const descNum     = descVal === 'no' ? 0 : parseInt(descVal, 10);
        const precioFinal = descNum > 0 ? Math.round(precioNum * (1 - descNum / 100)) : precioNum;

        const nuevoProducto = {
            id:             'prod-' + Date.now(),
            nombre:         document.querySelector('.inputNombreProducto')?.value.trim() || '',
            name:           document.querySelector('.inputNombreProducto')?.value.trim() || '',
            tipo:           document.querySelector('.selectTipoProducto')?.value || 'fruta',
            peso:           document.querySelector('.inputPesoProducto')?.value || '',
            tipoPeso:       document.querySelector('.selectTipoPeso')?.value || 'kilos',
            unit:           document.querySelector('.selectTipoPeso')?.value || 'kilos',
            precioOriginal: precioNum,
            descuento:      descNum,
            precio:         precioFinal,
            price:          precioFinal,
            foto:           foto,
            img:            foto,
            finca:          document.querySelector('.inputNombreFinca')?.value.trim() || '',
            vendor:         document.querySelector('.inputNombreFinca')?.value.trim() || '',
            stock:          document.querySelector('.inputStock')?.value || '',
            direccion:      document.querySelector('.inputDireccionFinca')?.value.trim() || '',
            tipoEnvio:      document.querySelector('.selectTipoEnvio')?.value || 'domicilio',
            descripcion:    document.querySelector('.inputDescripcion')?.value.trim() || '',
            fechaCreacion:  new Date().toISOString(),
            activo:         true
        };

        /* Guardar en misProductos */
        let misProductos = [];
        try { misProductos = JSON.parse(localStorage.getItem('misProductos')) || []; } catch (err) {}
        misProductos.push(nuevoProducto);
        localStorage.setItem('misProductos', JSON.stringify(misProductos));

        /* Limpiar temporales */
        FIELDS.forEach(function (field) { localStorage.removeItem('cp_' + field.key); });
        localStorage.removeItem('productPhoto');

        return true;
    }

    /* ============================================
       FUNCIÓN PARA MOSTRAR TOAST
       ============================================ */
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
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    /* ============================================
       BOTÓN PUBLICAR - REDIRIGE A views_product_new.html
       ============================================ */
    if (btnPublicar) {
        btnPublicar.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('📦 Publicando producto...');
            
            if (publicarProducto()) {
                mostrarToast('✓ Producto publicado exitosamente', 'success');
                setTimeout(function () {
                    window.location.href = '/static/views/views_product_new.html';
                }, 1500);
            }
        });
    }

    /* ============================================
       TAMBIÉN MANEJAR EL SUBMIT DEL FORMULARIO
       ============================================ */
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            
            if (publicarProducto()) {
                mostrarToast('✓ Producto publicado exitosamente', 'success');
                setTimeout(function () {
                    window.location.href = '/static/views/views_product_new.html';
                }, 1500);
            }
        });
    }
}