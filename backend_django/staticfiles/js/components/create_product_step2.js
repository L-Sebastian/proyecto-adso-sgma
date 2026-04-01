document.addEventListener('DOMContentLoaded', function () {

    const container = document.querySelector('.main-content-create');
    if (!container) return;

    fetch('/static/views/components/create_product_step2.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initStep2();
        })
        .catch(function (err) {
            console.error('Error cargando create_product_step2:', err);
        });
});

function initStep2() {

    /* ── Referencias DOM ── */
    const photoInput      = document.querySelector('.photoInput');
    const avatarImg       = document.querySelector('.avatarImgProduct');
    const avatarSvg       = document.querySelector('.avatarSvgProduct');
    const btnCambiarFoto  = document.querySelector('.btn-change-photo');
    const btnAnterior     = document.querySelector('#btnAnterior');
    const form            = document.querySelector('.fpEdForm');
    const btnPublicar     = document.querySelector('.fpEd-btn-primary');

    if (!form) return;

    /* ── Campos del Paso 2 (Finca + Descripción) ── */
    const FIELDS_STEP2 = [
        { key: 'nombreFinca',    cls: '.inputNombreFinca'     },
        { key: 'stock',          cls: '.inputStock'            },
        { key: 'direccionFinca', cls: '.inputDireccionFinca'  },
        { key: 'tipoEnvio',      cls: '.selectTipoEnvio'       },
        { key: 'descripcion',    cls: '.inputDescripcion'       }
    ];

    /* ── Restaurar foto del paso 1 ── */
    let foto = localStorage.getItem('productPhoto') || '';
    if (foto && avatarImg) {
        avatarImg.src = foto;
        avatarImg.style.display = 'block';
        if (avatarSvg) avatarSvg.style.display = 'none';
    }

    /* ── Restaurar campos del paso 2 ── */
    FIELDS_STEP2.forEach(function (field) {
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
    FIELDS_STEP2.forEach(function (field) {
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

    /* ── Botón Cambiar Foto ── */
    if (btnCambiarFoto && photoInput) {
        btnCambiarFoto.addEventListener('click', function () { photoInput.click(); });
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

    /* ── Botón Anterior ── */
    if (btnAnterior) {
        btnAnterior.addEventListener('click', function (e) {
            e.preventDefault();
            
            /* Guardar campos del paso 2 antes de volver */
            FIELDS_STEP2.forEach(function (field) {
                const el = document.querySelector(field.cls);
                if (el) localStorage.setItem('cp_' + field.key, el.value);
            });

            console.log('⬅️ Volviendo al paso 1');
            window.location.href = '/static/views/views_create_product.html';
        });
    }

    /* ── Función para publicar producto ── */
    function publicarProducto() {
        /* Validar nombre finca obligatorio */
        const nombreFincaEl = document.querySelector('.inputNombreFinca');
        if (!nombreFincaEl || nombreFincaEl.value.trim() === '') {
            nombreFincaEl.focus();
            nombreFincaEl.style.borderColor = '#ef4444';
            mostrarToast('❌ El nombre de la finca es obligatorio', 'error');
            setTimeout(() => { nombreFincaEl.style.borderColor = ''; }, 2000);
            return false;
        }

        /* Campos del paso 1 */
        const FIELDS_STEP1 = [
            { key: 'nombreProducto', cls: '.inputNombreProducto' },
            { key: 'tipoProducto',   cls: '.selectTipoProducto'  },
            { key: 'pesoProducto',   cls: '.inputPesoProducto'   },
            { key: 'tipoPeso',       cls: '.selectTipoPeso'       },
            { key: 'precioProducto', cls: '.inputPrecioProducto'  },
            { key: 'descuento',      cls: '.selectDescuento'      },
            { key: 'descripcion',    cls: '.inputDescripcion'     }
        ];

        /* Construir objeto producto combinando ambos pasos */
        const precioRaw   = document.querySelector('.inputPrecioProducto')?.value || localStorage.getItem('cp_precioProducto') || '0';
        const precioNum   = parseInt(String(precioRaw).replace(/[^0-9]/g, ''), 10) || 0;
        const descVal     = document.querySelector('.selectDescuento')?.value || localStorage.getItem('cp_descuento') || 'no';
        const descNum     = descVal === 'no' ? 0 : parseInt(descVal, 10);
        const precioFinal = descNum > 0 ? Math.round(precioNum * (1 - descNum / 100)) : precioNum;

        const nuevoProducto = {
            id:             'prod-' + Date.now(),
            nombre:         localStorage.getItem('cp_nombreProducto') || '',
            name:           localStorage.getItem('cp_nombreProducto') || '',
            tipo:           localStorage.getItem('cp_tipoProducto') || 'fruta',
            peso:           localStorage.getItem('cp_pesoProducto') || '',
            tipoPeso:       localStorage.getItem('cp_tipoPeso') || 'kilos',
            unit:           localStorage.getItem('cp_tipoPeso') || 'kilos',
            precioOriginal: precioNum,
            descuento:      descNum,
            precio:         precioFinal,
            price:          precioFinal,
            foto:           foto,
            img:            foto,
            finca:          localStorage.getItem('cp_nombreFinca') || '',
            vendor:         localStorage.getItem('cp_nombreFinca') || '',
            stock:          localStorage.getItem('cp_stock') || '',
            direccion:      localStorage.getItem('cp_direccionFinca') || '',
            tipoEnvio:      localStorage.getItem('cp_tipoEnvio') || 'domicilio',
            descripcion:    localStorage.getItem('cp_descripcion') || '',
            fechaCreacion:  new Date().toISOString(),
            activo:         true
        };

        /* Guardar en misProductos */
        let misProductos = [];
        try { misProductos = JSON.parse(localStorage.getItem('misProductos')) || []; } catch (err) {}
        misProductos.push(nuevoProducto);
        localStorage.setItem('misProductos', JSON.stringify(misProductos));

        /* Limpiar todos los campos temporales */
        FIELDS_STEP1.forEach(function (field) { localStorage.removeItem('cp_' + field.key); });
        FIELDS_STEP2.forEach(function (field) { localStorage.removeItem('cp_' + field.key); });
        localStorage.removeItem('productPhoto');

        return true;
    }

    /* ── Botón Publicar ── */
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

    /* ── Manejar submit del formulario ── */
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
