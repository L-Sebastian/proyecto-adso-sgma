document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.main-content');
    if (!container) {
        console.error(' No se encontró .main-content');
        return;
    }

    fetch('/static/views/components/edit_product.html')
        .then(res => {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;
            initEditProduct();
        })
        .catch(err => console.error(' Error cargando edit_product:', err));
});

function initEditProduct() {
    console.log(' Inicializando edición de producto');

    // ============================================
    // 1. OBTENER ID DEL PRODUCTO
    // ============================================
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id');
    
    if (!productoId) {
        console.error(' No se recibió ID de producto');
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
        console.error(' Producto no encontrado:', productoId);
        return;
    }

    // ============================================
    // 3. ELEMENTOS DEL DOM (CON LAS CLASES CORRECTAS)
    // ============================================
    const elements = {
        // Avatar
        avatarImg: document.querySelector('.avatarImgProduct'),
        avatarSvg: document.querySelector('.avatarSvgProduct'),
        photoInput: document.querySelector('.photoInput'),
        
        // Botones
        btnSubirFoto: document.querySelector('.btn-change-photo'),
        btnEliminarFoto: document.querySelector('.fpEdBtnEliminarFoto'),
        btnVolver: document.querySelector('.fpEdBtnVolver'),
        btnGuardar: document.querySelector('.fpEd-btn-primary'),
        
        // Formulario
        form: document.querySelector('.fpEdForm'),
        
        // Campos del formulario
        inputNombreProducto: document.querySelector('.inputNombreProducto'),
        inputPesoProducto: document.querySelector('.inputPesoProducto'),
        inputPrecioProducto: document.querySelector('.inputPrecioProducto'),
        inputNombreFinca: document.querySelector('.inputNombreFinca'),
        inputStock: document.querySelector('.inputStock'),
        inputDireccionFinca: document.querySelector('.inputDireccionFinca'),
        inputDescripcion: document.querySelector('.inputDescripcion'),
        selectTipoProducto: document.querySelector('.selectTipoProducto'),
        selectTipoPeso: document.querySelector('.selectTipoPeso'),
        selectDescuento: document.querySelector('.selectDescuento'),
        selectTipoEnvio: document.querySelector('.selectTipoEnvio')
    };

    console.log(' Elementos encontrados:', {
        avatarImg: !!elements.avatarImg,
        btnSubirFoto: !!elements.btnSubirFoto,
        btnEliminarFoto: !!elements.btnEliminarFoto,
        btnVolver: !!elements.btnVolver,
        btnGuardar: !!elements.btnGuardar,
        inputNombreProducto: !!elements.inputNombreProducto
    });

    // ============================================
    // 4. VARIABLE PARA LA FOTO
    // ============================================
    let foto = producto.foto || producto.img || '';

    // ============================================
    // 5. PRECARGAR FOTO
    // ============================================
    if (foto && elements.avatarImg) {
        elements.avatarImg.src = foto;
        elements.avatarImg.style.display = 'block';
        if (elements.avatarSvg) elements.avatarSvg.style.display = 'none';
    }

    // ============================================
    // 6. PRECARGAR CAMPOS DEL PRODUCTO
    // ============================================
    if (elements.inputNombreProducto) elements.inputNombreProducto.value = producto.nombre || '';
    if (elements.inputPesoProducto) elements.inputPesoProducto.value = producto.peso || '';
    if (elements.inputPrecioProducto) elements.inputPrecioProducto.value = producto.precioOriginal || '';
    if (elements.inputNombreFinca) elements.inputNombreFinca.value = producto.finca || '';
    if (elements.inputStock) elements.inputStock.value = producto.stock || '';
    if (elements.inputDireccionFinca) elements.inputDireccionFinca.value = producto.direccion || '';
    if (elements.inputDescripcion) elements.inputDescripcion.value = producto.descripcion || '';

    // Selects
    function setSelect(select, value, defaultValue) {
        if (!select) return;
        const val = value || defaultValue;
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === String(val)) {
                select.selectedIndex = i;
                break;
            }
        }
    }

    setSelect(elements.selectTipoProducto, producto.tipo, 'fruta');
    setSelect(elements.selectTipoPeso, producto.tipoPeso, 'kilos');
    setSelect(elements.selectDescuento, producto.descuento, 'no');
    setSelect(elements.selectTipoEnvio, producto.tipoEnvio, 'domicilio');

    // ============================================
    // 7. FUNCIÓN PARA APLICAR FOTO
    // ============================================
    function aplicarFoto(dataURL) {
        foto = dataURL;
        if (elements.avatarImg) {
            elements.avatarImg.src = dataURL;
            elements.avatarImg.style.display = 'block';
        }
        if (elements.avatarSvg) {
            elements.avatarSvg.style.display = 'none';
        }
        console.log(' Foto aplicada');
    }

    // ============================================
    // 8. BOTÓN SUBIR FOTO
    // ============================================
    if (elements.btnSubirFoto && elements.photoInput) {
        // Remover event listeners anteriores
        const nuevoBtn = elements.btnSubirFoto.cloneNode(true);
        elements.btnSubirFoto.parentNode.replaceChild(nuevoBtn, elements.btnSubirFoto);
        
        nuevoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(' Abriendo selector de archivos');
            elements.photoInput.click();
        });
        console.log(' Botón Subir Foto configurado');
    }

    // ============================================
    // 9. INPUT FILE
    // ============================================
    if (elements.photoInput) {
        elements.photoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            console.log(' Archivo seleccionado:', file.name);
            
            const reader = new FileReader();
            reader.onload = function(e) {
                aplicarFoto(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    // ============================================
    // 10. BOTÓN ELIMINAR FOTO
    // ============================================
    if (elements.btnEliminarFoto) {
        const nuevoBtn = elements.btnEliminarFoto.cloneNode(true);
        elements.btnEliminarFoto.parentNode.replaceChild(nuevoBtn, elements.btnEliminarFoto);
        
        nuevoBtn.addEventListener('click', function() {
            console.log(' Eliminando foto');
            foto = '';
            if (elements.avatarImg) {
                elements.avatarImg.src = '';
                elements.avatarImg.style.display = 'none';
            }
            if (elements.avatarSvg) {
                elements.avatarSvg.style.display = 'block';
            }
            if (elements.photoInput) elements.photoInput.value = '';
        });
        console.log(' Botón Eliminar Foto configurado');
    }

    // ============================================
    // 11. BOTÓN VOLVER
    // ============================================
    if (elements.btnVolver) {
        const nuevoBtn = elements.btnVolver.cloneNode(true);
        elements.btnVolver.parentNode.replaceChild(nuevoBtn, elements.btnVolver);
        
        nuevoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('⬅️ Volviendo a productos');
            window.location.href = '/static/views/views_product_new.html';
        });
        console.log(' Botón Volver configurado');
    }

    // ============================================
    // 12. FUNCIÓN PARA GUARDAR CAMBIOS
    // ============================================
    function guardarCambios() {
        // Validar nombre
        if (!elements.inputNombreProducto || elements.inputNombreProducto.value.trim() === '') {
            if (elements.inputNombreProducto) {
                elements.inputNombreProducto.focus();
                elements.inputNombreProducto.style.borderColor = '#ef4444';
            }
            mostrarToast(' El nombre del producto es obligatorio', 'error');
            return false;
        }
        
        if (elements.inputNombreProducto) {
            elements.inputNombreProducto.style.borderColor = '';
        }

        // Calcular precio
        const precioRaw = elements.inputPrecioProducto?.value || '0';
        const precioNum = parseInt(String(precioRaw).replace(/[^0-9]/g, ''), 10) || 0;
        const descVal = elements.selectDescuento?.value || 'no';
        const descNum = descVal === 'no' ? 0 : parseInt(descVal, 10);
        const precioFinal = descNum > 0 ? Math.round(precioNum * (1 - descNum / 100)) : precioNum;

        // Actualizar producto
        producto.nombre = elements.inputNombreProducto?.value.trim() || '';
        producto.name = producto.nombre;
        producto.tipo = elements.selectTipoProducto?.value || 'fruta';
        producto.peso = elements.inputPesoProducto?.value || '';
        producto.tipoPeso = elements.selectTipoPeso?.value || 'kilos';
        producto.unit = producto.tipoPeso;
        producto.precioOriginal = precioNum;
        producto.price = precioNum;
        producto.precio = precioFinal;
        producto.descuento = descNum;
        producto.foto = foto;
        producto.img = foto;
        producto.finca = elements.inputNombreFinca?.value.trim() || '';
        producto.vendor = producto.finca;
        producto.stock = elements.inputStock?.value || '';
        producto.direccion = elements.inputDireccionFinca?.value.trim() || '';
        producto.tipoEnvio = elements.selectTipoEnvio?.value || 'domicilio';
        producto.descripcion = elements.inputDescripcion?.value.trim() || '';

        // Guardar en localStorage
        const index = misProductos.findIndex(p => p.id === productoId);
        if (index !== -1) {
            misProductos[index] = producto;
            localStorage.setItem('misProductos', JSON.stringify(misProductos));
            console.log(' Producto actualizado:', producto.nombre);
            return true;
        }
        return false;
    }

    // ============================================
    // 13. FUNCIÓN PARA MOSTRAR TOAST
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
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    // ============================================
    // 14. BOTÓN GUARDAR CAMBIOS (CON SUBMIT)
    // ============================================
    if (elements.btnGuardar) {
        const nuevoBtn = elements.btnGuardar.cloneNode(true);
        elements.btnGuardar.parentNode.replaceChild(nuevoBtn, elements.btnGuardar);
        
        nuevoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(' Botón Guardar clickeado');
            
            if (guardarCambios()) {
                mostrarToast('✓ Cambios guardados correctamente', 'success');
                setTimeout(() => {
                    window.location.href = '/static/views/views_product_new.html';
                }, 1500);
            }
        });
        console.log(' Botón Guardar configurado');
    }

    // ============================================
    // 15. MANEJAR SUBMIT DEL FORMULARIO
    // ============================================
    if (elements.form) {
        elements.form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log(' Formulario enviado');
            
            if (guardarCambios()) {
                mostrarToast('✓ Cambios guardados correctamente', 'success');
                setTimeout(() => {
                    window.location.href = '/static/views/views_product_new.html';
                }, 1500);
            }
        });
    }

    console.log(' Edit Product inicializado correctamente');
}