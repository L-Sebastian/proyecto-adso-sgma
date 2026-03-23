document.addEventListener('DOMContentLoaded', function () {
    const bodyContainer = document.querySelector('.main-content');
    if (!bodyContainer) return;

    fetch('/frontend/public/views/components/create_product_2.html')
        .then(response => {
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return response.text();
        })
        .then(data => {
            bodyContainer.innerHTML = data;
            initProductCreate2();
        })
        .catch(error => console.error('Error cargando create_product_2:', error));
});

function initProductCreate2() {
    console.log('🚀 Inicializando create_product_2');
    
    // ============================================
    // 1. ELEMENTOS DEL DOM (CORREGIDOS)
    // ============================================
    const elements = {
        // Imagen del producto
        productImage: document.querySelector('.avatarImgProduct'), // Cambiado de .productImage a .avatarImgProduct
        photoInput: document.querySelector('.photoInput'),
        
        // Botones
        btnSubirFoto: document.querySelector('.epBtnSubirFoto'),
        btnVolver: document.querySelector('.epBtnVolver'),
        btnGuardar: document.querySelector('.btnGuardar'),
        
        // Inputs del formulario
        inputNombreFinca: document.querySelector('.nombreProducto'), // Primero para nombre finca
        inputStock: document.querySelectorAll('.nombreProducto')[1], // Segundo para stock (misma clase)
        inputDireccion: document.querySelector('.pesoProducto'),
        selectTipoEnvio: document.querySelector('.tipoPeso'),
        textareaDescripcion: document.querySelector('.inputDescripcion')
    };

    // Depuración
    console.log('🔍 Elementos encontrados:', {
        productImage: !!elements.productImage,
        photoInput: !!elements.photoInput,
        btnSubirFoto: !!elements.btnSubirFoto,
        btnVolver: !!elements.btnVolver,
        btnGuardar: !!elements.btnGuardar,
        inputNombreFinca: !!elements.inputNombreFinca,
        inputStock: !!elements.inputStock,
        inputDireccion: !!elements.inputDireccion,
        selectTipoEnvio: !!elements.selectTipoEnvio,
        textareaDescripcion: !!elements.textareaDescripcion
    });

    // ============================================
    // 2. RESTAURAR FOTO DEL PASO 1
    // ============================================
    const savedPhoto = localStorage.getItem('productPhoto');
    if (savedPhoto && elements.productImage) {
        elements.productImage.src = savedPhoto;
        elements.productImage.style.display = 'block';
        
        // Ocultar SVG si existe
        const avatarSvg = document.querySelector('.avatarSvgProduct');
        if (avatarSvg) avatarSvg.style.display = 'none';
    }

    // ============================================
    // 3. RESTAURAR CAMPOS GUARDADOS DEL PASO 1
    // ============================================
    // Datos del paso 1
    const nombreProducto = localStorage.getItem('cp_nombreProducto') || 'Guanabana';
    const tipoProducto = localStorage.getItem('cp_tipoProducto') || 'fruta';
    const pesoProducto = localStorage.getItem('cp_pesoProducto') || '2';
    const tipoPeso = localStorage.getItem('cp_tipoPeso') || 'kilos';
    const precioProducto = localStorage.getItem('cp_precioProducto') || '10.000$';
    const descuento = localStorage.getItem('cp_descuento') || 'no';
    
    console.log('📦 Datos recuperados del paso 1:', {
        nombreProducto, tipoProducto, pesoProducto, tipoPeso, precioProducto, descuento
    });

    // ============================================
    // 4. FUNCIÓN PARA APLICAR FOTO
    // ============================================
    function aplicarFoto(dataURL) {
        if (elements.productImage) {
            elements.productImage.src = dataURL;
            elements.productImage.style.display = 'block';
            
            // Ocultar SVG
            const avatarSvg = document.querySelector('.avatarSvgProduct');
            if (avatarSvg) avatarSvg.style.display = 'none';
            
            localStorage.setItem('productPhoto', dataURL);
            console.log('✅ Foto aplicada');
        }
    }

    // ============================================
    // 5. BOTÓN SUBIR FOTO
    // ============================================
    if (elements.btnSubirFoto && elements.photoInput) {
        // Clonar para evitar event listeners duplicados
        const nuevoBtn = elements.btnSubirFoto.cloneNode(true);
        elements.btnSubirFoto.parentNode.replaceChild(nuevoBtn, elements.btnSubirFoto);
        
        nuevoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('📸 Abriendo selector de archivos');
            elements.photoInput.click();
        });
    } else {
        console.warn('⚠️ No se encontró el botón Subir Foto');
    }

    // ============================================
    // 6. INPUT FILE - SELECCIÓN DE FOTO
    // ============================================
    if (elements.photoInput) {
        elements.photoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            console.log('✅ Archivo seleccionado:', file.name);
            
            const reader = new FileReader();
            reader.onload = (e) => aplicarFoto(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    // ============================================
    // 7. BOTÓN VOLVER
    // ============================================
    if (elements.btnVolver) {
        elements.btnVolver.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('⬅️ Volviendo a create_product');
            window.location.href = '/frontend/public/views/views_create_product.html';
        });
    }

    // ============================================
    // 8. FUNCIÓN PARA GUARDAR PRODUCTO
    // ============================================
    function guardarProducto() {
        console.log('📦 Guardando producto...');

        // Obtener valores del paso 2
        const nombreFinca = elements.inputNombreFinca?.value || '';
        const stock = elements.inputStock?.value || '';
        const direccion = elements.inputDireccion?.value || '';
        const tipoEnvio = elements.selectTipoEnvio?.value || 'kilos';
        const descripcion = elements.textareaDescripcion?.value || '';

        // Calcular precio final
        const precioRaw = precioProducto;
        const precioNum = parseInt(String(precioRaw).replace(/[^0-9]/g, ''), 10) || 0;
        const descNum = descuento === 'no' ? 0 : parseInt(descuento, 10);
        const precioFinal = descNum > 0 ? Math.round(precioNum * (1 - descNum / 100)) : precioNum;

        // Construir objeto producto
        const nuevoProducto = {
            id: 'prod-' + Date.now(),
            // Paso 1
            nombre: nombreProducto,
            tipo: tipoProducto,
            peso: pesoProducto,
            tipoPeso: tipoPeso,
            precioOriginal: precioNum,
            descuento: descNum,
            precio: precioFinal,
            foto: localStorage.getItem('productPhoto') || '',
            
            // Paso 2
            finca: nombreFinca,
            stock: stock,
            direccion: direccion,
            tipoEnvio: tipoEnvio,
            descripcion: descripcion,
            
            // Metadatos
            fechaCreacion: new Date().toISOString(),
            activo: true
        };

        // Guardar en array de productos
        let misProductos = [];
        try {
            misProductos = JSON.parse(localStorage.getItem('misProductos')) || [];
        } catch (e) {
            misProductos = [];
        }
        
        misProductos.push(nuevoProducto);
        localStorage.setItem('misProductos', JSON.stringify(misProductos));

        // Limpiar datos temporales del paso 1
        const keys = ['nombreProducto', 'tipoProducto', 'pesoProducto', 'tipoPeso', 
                     'precioProducto', 'descuento'];
        keys.forEach(k => localStorage.removeItem('cp_' + k));
        
        // NO eliminar productPhoto aún porque la necesitamos para el producto guardado

        console.log('✅ Producto guardado:', nuevoProducto);
        return nuevoProducto;
    }

    // ============================================
    // 9. BOTÓN GUARDAR
    // ============================================
    if (elements.btnGuardar) {
        elements.btnGuardar.addEventListener('click', (e) => {
            e.preventDefault();
            
            const producto = guardarProducto();
            
            if (producto) {
                mostrarToast('✓ Producto guardado', () => {
                    window.location.href = '/frontend/public/views/views_product_new-2.html';
                });
            }
        });
    }

    // ============================================
    // 10. FUNCIÓN PARA MOSTRAR TOAST
    // ============================================
    function mostrarToast(mensaje, callback) {
        const toast = document.createElement('div');
        toast.textContent = mensaje;
        toast.style.cssText = `
            position: fixed;
            bottom: 32px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #10b981;
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
                if (callback) callback();
            }, 300);
        }, 1600);
    }

    console.log('✅ Create Product 2 inicializado');
}