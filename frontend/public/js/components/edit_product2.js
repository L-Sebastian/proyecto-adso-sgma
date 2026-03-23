document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.main-content');
    if (!container) return;

    fetch('/frontend/public/views/components/edit_product2.html')
        .then(res => {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;
            initEditProduct2();
        })
        .catch(err => console.error(' Error cargando edit_product2:', err));
});

function initEditProduct2() {
    console.log(' Inicializando Edit Product 2');

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
    // 3. ELEMENTOS DEL DOM (CORREGIDOS SEGÚN HTML)
    // ============================================
    const elements = {
        // Avatar
        avatarImg: document.querySelector('.epAvatarImg'),
        avatarSvg: document.querySelector('.epAvatarSvg'),
        photoInput: document.querySelector('.epPhotoInput'),

        // Botones
        btnSubirFoto: document.querySelector('.epBtnSubirFoto'),
        btnVolver: document.querySelector('.epBtnVolver'),
        btnGuardar: document.querySelector('.btnGuardar'),

        // Inputs del formulario (PASO 2) - CORREGIDO
        inputNombreFinca: document.querySelector('.nombreProducto'), // Primer input con clase nombreProducto
        inputStock: document.querySelectorAll('.nombreProducto')[1], // Segundo input con clase nombreProducto
        inputDireccion: document.querySelectorAll('.nombreProducto')[2], // Tercer input con clase nombreProducto
        selectTipoEnvio: document.querySelector('.tipoProducto'), // Select con clase tipoProducto
        textareaDescripcion: document.querySelector('.inputDescripcion') // Textarea con clase inputDescripcion
    };

    console.log(' Elementos encontrados:', {
        avatarImg: !!elements.avatarImg,
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
    // 4. RECUPERAR DATOS DEL PASO 1
    // ============================================
    const datosPaso1 = {
        nombre: localStorage.getItem('edit_nombreProducto'),
        tipo: localStorage.getItem('edit_tipoProducto'),
        peso: localStorage.getItem('edit_pesoProducto'),
        tipoPeso: localStorage.getItem('edit_tipoPeso'),
        precio: localStorage.getItem('edit_precioProducto'),
        descuento: localStorage.getItem('edit_descuento')
    };

    const fotoTemporal = localStorage.getItem('edit_productPhoto_temp');
    let fotoActual = fotoTemporal || producto.foto || producto.img || '';

    console.log(' Datos recuperados del paso 1:', {
        nombre: datosPaso1.nombre || 'No',
        foto: fotoTemporal ? 'SI' : 'NO'
    });

    // ============================================
    // 5. PRECARGAR DATOS
    // ============================================
    function precargarDatos() {
        // Foto
        if (fotoActual && elements.avatarImg) {
            elements.avatarImg.src = fotoActual;
            elements.avatarImg.style.display = 'block';
            if (elements.avatarSvg) elements.avatarSvg.style.display = 'none';
        }

        // Campos del paso 2
        if (elements.inputNombreFinca) {
            elements.inputNombreFinca.value = producto.finca || producto.vendor || '';
        }
        if (elements.inputStock) {
            elements.inputStock.value = producto.stock || '';
        }
        if (elements.inputDireccion) {
            elements.inputDireccion.value = producto.direccion || '';
        }
        if (elements.textareaDescripcion) {
            elements.textareaDescripcion.value = producto.descripcion || '';
        }

        // Select Tipo de Envío (mapear valores)
        if (elements.selectTipoEnvio) {
            const tipoEnvio = producto.tipoEnvio || 'domicilio';
            const mapaValores = {
                'domicilio': 'fruta',
                'recogida': 'verdura',
                'transporte': 'carnes',
                'mensajeria': 'fertilizantes'
            };
            const valorSelect = mapaValores[tipoEnvio] || 'fruta';

            for (let i = 0; i < elements.selectTipoEnvio.options.length; i++) {
                if (elements.selectTipoEnvio.options[i].value === valorSelect) {
                    elements.selectTipoEnvio.selectedIndex = i;
                    break;
                }
            }
        }
    }

    // ============================================
    // 6. FUNCIÓN PARA APLICAR FOTO
    // ============================================
    function aplicarFoto(dataURL) {
        if (elements.avatarImg) {
            elements.avatarImg.src = dataURL;
            elements.avatarImg.style.display = 'block';
        }
        if (elements.avatarSvg) {
            elements.avatarSvg.style.display = 'none';
        }
        fotoActual = dataURL;
        localStorage.setItem('edit_productPhoto_temp', dataURL);
        console.log(' Foto aplicada');
    }

    // ============================================
    // 7. BOTÓN SUBIR FOTO
    // ============================================
    if (elements.btnSubirFoto && elements.photoInput) {
        // Clonar para evitar event listeners duplicados
        const nuevoBtn = elements.btnSubirFoto.cloneNode(true);
        elements.btnSubirFoto.parentNode.replaceChild(nuevoBtn, elements.btnSubirFoto);

        nuevoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(' Abriendo selector de archivos');
            elements.photoInput.click();
        });
    } else {
        console.warn(' No se encontró el botón Subir Foto');
    }

    // ============================================
    // 8. INPUT FILE - SELECCIÓN DE FOTO
    // ============================================
    if (elements.photoInput) {
        elements.photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            console.log(' Archivo seleccionado:', file.name);

            const reader = new FileReader();
            reader.onload = (e) => aplicarFoto(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    // ============================================
    // 9. BOTÓN VOLVER
    // ============================================
    if (elements.btnVolver) {
        elements.btnVolver.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(' Volviendo a create_farm');
            window.location.href = '/frontend/public/views/views_edit_product.html?id=' + productoId;
        });
    }

    // ============================================
    // 10. FUNCIÓN PARA GUARDAR CAMBIOS
    // ============================================
    function guardarCambios() {
        console.log(' Guardando cambios...');

        // Mapear valor del select de vuelta
        const mapaInverso = {
            'fruta': 'domicilio',
            'verdura': 'recogida',
            'carnes': 'transporte',
            'fertilizantes': 'mensajeria'
        };
        const tipoEnvioSelect = elements.selectTipoEnvio?.value || 'fruta';
        const tipoEnvio = mapaInverso[tipoEnvioSelect] || 'domicilio';

        // Actualizar objeto producto
        producto.finca = elements.inputNombreFinca?.value || '';
        producto.vendor = producto.finca;
        producto.stock = elements.inputStock?.value || '';
        producto.direccion = elements.inputDireccion?.value || '';
        producto.tipoEnvio = tipoEnvio;
        producto.descripcion = elements.textareaDescripcion?.value || '';

        // Actualizar con valores del paso 1 (si existen)
        if (datosPaso1.nombre) producto.nombre = datosPaso1.nombre;
        if (datosPaso1.tipo) producto.tipo = datosPaso1.tipo;
        if (datosPaso1.peso) producto.peso = datosPaso1.peso;
        if (datosPaso1.tipoPeso) producto.tipoPeso = datosPaso1.tipoPeso;
        if (datosPaso1.precio) producto.precioOriginal = datosPaso1.precio;
        if (datosPaso1.descuento) producto.descuento = datosPaso1.descuento;

        // Actualizar foto
        producto.foto = fotoActual;
        producto.img = fotoActual;

        // Guardar en el array
        const index = misProductos.findIndex(p => p.id === productoId);
        if (index !== -1) {
            misProductos[index] = producto;
            localStorage.setItem('misProductos', JSON.stringify(misProductos));

            // Guardar datos para vista final
            guardarDatosParaVistaFinal();

            console.log(' Producto actualizado:', producto);
            return true;
        }
        return false;
    }

    // ============================================
    // 11. GUARDAR DATOS PARA VISTA FINAL
    // ============================================
    function guardarDatosParaVistaFinal() {
        const datosProducto = {
            // Datos del paso 1
            nombre: datosPaso1.nombre || producto.nombre || '',
            tipo: datosPaso1.tipo || producto.tipo || 'fruta',
            peso: datosPaso1.peso || producto.peso || '',
            tipoPeso: datosPaso1.tipoPeso || producto.tipoPeso || 'kilos',
            precioOriginal: datosPaso1.precio || producto.precioOriginal || '',
            descuento: datosPaso1.descuento || producto.descuento || 'no',

            // Datos del paso 2
            finca: elements.inputNombreFinca?.value || producto.finca || '',
            stock: elements.inputStock?.value || producto.stock || '',
            direccion: elements.inputDireccion?.value || producto.direccion || '',
            tipoEnvio: producto.tipoEnvio || 'domicilio',
            descripcion: elements.textareaDescripcion?.value || producto.descripcion || '',

            // Foto
            foto: fotoActual || producto.foto || producto.img || '',

            // Metadatos
            id: productoId,
            fechaCreacion: producto.fechaCreacion || new Date().toISOString(),
            activo: true
        };

        localStorage.setItem('productoVistaFinal', JSON.stringify(datosProducto));
        console.log(' Datos guardados para vista final');
    }

    // ============================================
    // 12. BOTÓN GUARDAR
    // ============================================
    if (elements.btnGuardar) {
        elements.btnGuardar.addEventListener('click', (e) => {
            e.preventDefault();

            if (guardarCambios()) {
                mostrarToast('✓ Cambios guardados', () => {
                    window.location.href = '/frontend/public/views/views_product_new-2.html';
                });
            }
        });
    }

    // ============================================
    // 13. FUNCIÓN PARA MOSTRAR TOAST
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

    // ============================================
    // 14. LIMPIAR DATOS TEMPORALES (OPCIONAL)
    // ============================================
    function limpiarDatosTemporales() {
        // Esta función se puede llamar cuando sea necesario
        const keys = [
            'edit_nombreProducto', 'edit_tipoProducto', 'edit_pesoProducto',
            'edit_tipoPeso', 'edit_precioProducto', 'edit_descuento',
            'edit_productPhoto_temp'
        ];
        keys.forEach(k => localStorage.removeItem(k));
        console.log(' Datos temporales limpiados');
    }

    // ============================================
    // 15. INICIALIZAR
    // ============================================
    precargarDatos();
    console.log(' Edit Product 2 inicializado correctamente');
}