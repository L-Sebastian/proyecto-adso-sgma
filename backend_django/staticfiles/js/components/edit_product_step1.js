document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.main-content-create');
    if (!container) return;

    fetch('/static/views/components/edit_product_step1.html')
        .then(res => {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;
            initEditProductStep1(); // Cambiamos el nombre de la función
        })
        .catch(err => console.error('❌ Error cargando edit_product_step1:', err));
});

function initEditProductStep1() {
    console.log('✅ Inicializando edición de producto - Paso 1');

    // ============================================
    // 1. OBTENER ID DEL PRODUCTO DESDE LA URL
    // ============================================
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id');

    if (!productoId) {
        console.error('❌ No se recibió ID de producto');
        mostrarToast('Error: Producto no identificado', 'error');
        return;
    }

    // ============================================
    // 2. OBTENER PRODUCTO DE LOCALSTORAGE
    // ============================================
    let misProductos = [];
    try {
        misProductos = JSON.parse(localStorage.getItem('misProductos')) || [];
    } catch (e) {
        misProductos = [];
    }

    const producto = misProductos.find(p => p.id === productoId);
    if (!producto) {
        console.error('❌ Producto no encontrado:', productoId);
        mostrarToast('Producto no encontrado', 'error');
        return;
    }

    console.log('📦 Producto cargado:', producto);

    // ============================================
    // 3. ELEMENTOS DEL DOM (coinciden con el HTML)
    // ============================================
    const elements = {
        // Avatar y foto
        avatarImg: document.querySelector('.avatarImgProduct'),
        avatarSvg: document.querySelector('.avatarSvgProduct'),
        photoInput: document.querySelector('.photoInput'),

        // Botones
        btnSubirFoto: document.querySelector('.btn-change-photo'),
        btnEliminarFoto: document.querySelector('.fpEdBtnEliminarFoto'),
        btnVolver: document.querySelector('.fpEdBtnVolver'),
        btnSiguiente: document.querySelector('#btnSiguiente'),

        // Campos del formulario
        inputNombreProducto: document.querySelector('.inputNombreProducto'),
        selectTipoProducto: document.querySelector('.selectTipoProducto'),
        inputPesoProducto: document.querySelector('.inputPesoProducto'),
        selectTipoPeso: document.querySelector('.selectTipoPeso'),
        inputPrecioProducto: document.querySelector('.inputPrecioProducto'),
        selectDescuento: document.querySelector('.selectDescuento')
    };

    // Verificar elementos críticos
    console.log('Elementos encontrados:', {
        avatarImg: !!elements.avatarImg,
        btnSubirFoto: !!elements.btnSubirFoto,
        btnEliminarFoto: !!elements.btnEliminarFoto,
        btnVolver: !!elements.btnVolver,
        btnSiguiente: !!elements.btnSiguiente,
        photoInput: !!elements.photoInput
    });

    // ============================================
    // 4. PRECARGAR DATOS DEL PRODUCTO
    // ============================================
    // Foto
    let foto = producto.foto || producto.img || '';
    if (foto && elements.avatarImg) {
        elements.avatarImg.src = foto;
        elements.avatarImg.style.display = 'block';
        if (elements.avatarSvg) elements.avatarSvg.style.display = 'none';
    } else {
        if (elements.avatarSvg) elements.avatarSvg.style.display = 'block';
        if (elements.avatarImg) elements.avatarImg.style.display = 'none';
    }

    // Campos de texto y selects
    if (elements.inputNombreProducto) elements.inputNombreProducto.value = producto.nombre || '';
    if (elements.inputPesoProducto) elements.inputPesoProducto.value = producto.peso || '';
    if (elements.inputPrecioProducto) elements.inputPrecioProducto.value = producto.precioOriginal || '';

    function setSelectValue(select, value, defaultValue = '') {
        if (!select) return;
        const val = value || defaultValue;
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === String(val)) {
                select.selectedIndex = i;
                break;
            }
        }
    }

    setSelectValue(elements.selectTipoProducto, producto.tipo, 'fruta');
    setSelectValue(elements.selectTipoPeso, producto.tipoPeso, 'kilos');
    setSelectValue(elements.selectDescuento, producto.descuento, 'no');

    // Guardar temporalmente la foto para el paso 2
    localStorage.setItem('edit_productPhoto_temp', foto);

    // ============================================
    // 5. GUARDAR CAMPOS EN TIEMPO REAL (opcional)
    // ============================================
    const fieldsToSave = [
        { el: elements.inputNombreProducto, key: 'edit_nombreProducto' },
        { el: elements.selectTipoProducto, key: 'edit_tipoProducto' },
        { el: elements.inputPesoProducto, key: 'edit_pesoProducto' },
        { el: elements.selectTipoPeso, key: 'edit_tipoPeso' },
        { el: elements.inputPrecioProducto, key: 'edit_precioProducto' },
        { el: elements.selectDescuento, key: 'edit_descuento' }
    ];

    fieldsToSave.forEach(field => {
        if (field.el) {
            const save = () => localStorage.setItem(field.key, field.el.value);
            field.el.addEventListener('input', save);
            field.el.addEventListener('change', save);
            // Guardar valor inicial
            save();
        }
    });

    // ============================================
    // 6. FUNCIÓN COMPRIMIR IMAGEN AGRESIVAMENTE
    // ============================================
    function comprimirImagen(file, callback) {
        console.log('🖼️ Comprimiendo imagen:', file.name, 'Tamaño original:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                console.log('📐 Dimensiones originales:', img.width + 'x' + img.height);
                
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Redimensionar MUCHO (máximo 600px para garantizar que quepa en localStorage)
                const maxWidth = 600;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                console.log('📐 Dimensiones redimensionadas:', width + 'x' + height);
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Función para comprimir recursivamente con diferentes calidades
                function compresarConCalidad(calidad) {
                    canvas.toBlob((blob) => {
                        const sizeKB = (blob.size / 1024).toFixed(2);
                        console.log(`📦 Comprimido a ${calidad * 100}% - Tamaño: ${sizeKB}KB`);
                        
                        // Guardar y finalizar - no hacer más compresión
                        const reader2 = new FileReader();
                        reader2.onload = (e2) => {
                            console.log('✅ Foto convertida a Base64');
                            callback(e2.target.result);
                        };
                        reader2.readAsDataURL(blob);
                    }, 'image/jpeg', calidad);
                }

                // Comenzar con calidad 0.4 (40%) - muy comprimido
                compresarConCalidad(0.4);
            };
            img.onerror = () => {
                console.error('❌ Error al cargar la imagen');
                mostrarToast('❌ Error al procesar la imagen', 'error');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // ============================================
    // 7. FUNCIÓN APLICAR FOTO (SIN GUARDAR EN LOCALSTORAGE)
    // ============================================
    function aplicarFoto(dataURL) {
        foto = dataURL;
        if (elements.avatarImg) {
            elements.avatarImg.src = dataURL;
            elements.avatarImg.style.display = 'block';
        }
        if (elements.avatarSvg) elements.avatarSvg.style.display = 'none';
        console.log('✅ Foto actualizada (en memoria)');
    }

    // ============================================
    // 8. BOTÓN SUBIR FOTO
    // ============================================
    if (elements.btnSubirFoto && elements.photoInput) {
        // Limpiamos event listeners anteriores (opcional)
        const newBtn = elements.btnSubirFoto.cloneNode(true);
        elements.btnSubirFoto.parentNode.replaceChild(newBtn, elements.btnSubirFoto);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            elements.photoInput.click();
        });
    }

    // ============================================
    // 9. INPUT FILE
    // ============================================
    if (elements.photoInput) {
        elements.photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                mostrarToast('❌ Solo se permiten imágenes', 'error');
                return;
            }

            // Validar tamaño máximo (5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                mostrarToast('❌ La imagen no debe superar 5MB', 'error');
                return;
            }

            // Comprimir y aplicar la imagen
            comprimirImagen(file, aplicarFoto);
        });
    }

    // ============================================
    // 10. BOTÓN ELIMINAR FOTO
    // ============================================
    if (elements.btnEliminarFoto) {
        elements.btnEliminarFoto.addEventListener('click', () => {
            foto = '';
            if (elements.avatarImg) {
                elements.avatarImg.src = '';
                elements.avatarImg.style.display = 'none';
            }
            if (elements.avatarSvg) elements.avatarSvg.style.display = 'block';
            if (elements.photoInput) elements.photoInput.value = '';
            localStorage.removeItem('edit_productPhoto_temp');
        });
    }

    // ============================================
    // 11. BOTÓN VOLVER
    // ============================================
    if (elements.btnVolver) {
        elements.btnVolver.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/static/views/views_product_new.html';
        });
    }

    // ============================================
    // 12. BOTÓN SIGUIENTE
    // ============================================
    if (elements.btnSiguiente) {
        elements.btnSiguiente.addEventListener('click', (e) => {
            e.preventDefault();

            // Validar nombre obligatorio
            if (!elements.inputNombreProducto || elements.inputNombreProducto.value.trim() === '') {
                elements.inputNombreProducto.focus();
                elements.inputNombreProducto.style.borderColor = '#ef4444';
                mostrarToast('❌ El nombre del producto es obligatorio', 'error');
                setTimeout(() => {
                    if (elements.inputNombreProducto) elements.inputNombreProducto.style.borderColor = '';
                }, 2000);
                return;
            }

            // Guardar todos los campos actuales (ya se guardan en tiempo real)
            // NO guardar foto en localStorage - evitar quota exceeded
            console.log('📸 Foto lista en memoria, navegando...');

            // Redirigir al paso 2
            window.location.href = `/static/views/views_edit_product2.html?id=${productoId}`;
        });
    }

    // ============================================
    // 13. FUNCIÓN TOAST
    // ============================================
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
            color: white;
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
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    console.log('✅ Edit Product Step 1 inicializado correctamente');
}