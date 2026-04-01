document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.main-content-create');
    if (!container) {
        console.error('❌ No se encontró .main-content');
        return;
    }

    fetch('/frontend/public/views/components/edit_product_step2.html')
        .then(res => {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;
            initEditProductStep2();
        })
        .catch(err => console.error('❌ Error cargando edit_product_step2:', err));
});

function initEditProductStep2() {
    console.log('✅ Inicializando edición de producto - Paso 2');

    // 1. Obtener ID del producto
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id');
    if (!productoId) {
        console.error('❌ No se recibió ID de producto');
        mostrarToast('Error: Producto no identificado', 'error');
        return;
    }

    // 2. Obtener producto de localStorage
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

    // 3. Elementos del DOM (clases reales del HTML)
    const elements = {
        // Foto
        avatarImg: document.querySelector('.avatarImgProduct'),
        avatarSvg: document.querySelector('.avatarSvgProduct'),
        photoInput: document.querySelector('.photoInput'),

        // Botones
        btnCambiarFoto: document.querySelector('.btn-change-photo'),
        btnAnterior: document.querySelector('#btnAnterior'),
        btnPublicar: document.querySelector('button[type="submit"]'),

        // Formulario
        form: document.querySelector('.fpEdForm'),

        // Campos del paso 2
        inputNombreFinca: document.querySelector('.inputNombreFinca'),
        inputStock: document.querySelector('.inputStock'),
        inputDireccionFinca: document.querySelector('.inputDireccionFinca'),
        selectTipoEnvio: document.querySelector('.selectTipoEnvio'),
        textareaDescripcion: document.querySelector('.inputDescripcion')
    };

    // Verificar elementos críticos
    console.log('Elementos encontrados:', {
        avatarImg: !!elements.avatarImg,
        btnCambiarFoto: !!elements.btnCambiarFoto,
        btnAnterior: !!elements.btnAnterior,
        btnPublicar: !!elements.btnPublicar,
        form: !!elements.form,
        inputNombreFinca: !!elements.inputNombreFinca
    });

    // 4. Foto actual - NO recuperar de localStorage
    // La foto se mantiene en memoria de step1, si no hay, usar la del producto
    let foto = producto.foto || producto.img || '';

    // 5. Precargar foto
    if (foto && elements.avatarImg) {
        elements.avatarImg.src = foto;
        elements.avatarImg.style.display = 'block';
        if (elements.avatarSvg) elements.avatarSvg.style.display = 'none';
    } else {
        if (elements.avatarSvg) elements.avatarSvg.style.display = 'block';
        if (elements.avatarImg) elements.avatarImg.style.display = 'none';
    }

    // 6. Precargar campos del paso 2 (desde producto existente)
    if (elements.inputNombreFinca) elements.inputNombreFinca.value = producto.finca || '';
    if (elements.inputStock) elements.inputStock.value = producto.stock || '';
    if (elements.inputDireccionFinca) elements.inputDireccionFinca.value = producto.direccion || '';
    if (elements.textareaDescripcion) elements.textareaDescripcion.value = producto.descripcion || '';

    // Select tipo envío
    if (elements.selectTipoEnvio) {
        const envio = producto.tipoEnvio || 'domicilio';
        for (let i = 0; i < elements.selectTipoEnvio.options.length; i++) {
            if (elements.selectTipoEnvio.options[i].value === envio) {
                elements.selectTipoEnvio.selectedIndex = i;
                break;
            }
        }
    }

    // 7. Función para comprimir imagen AGRESIVA (asegura que se publique)
    function comprimirImagen(file, callback) {
        console.log('🖼️ INICIANDO COMPRESIÓN');
        console.log('Archivo:', file.name);
        console.log('Tamaño original:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
        mostrarToast('⏳ Comprimiendo imagen...', 'success');
        
        const reader = new FileReader();
        reader.onerror = () => {
            console.error('❌ ERROR en FileReader');
            mostrarToast('❌ Error al leer la imagen', 'error');
        };
        
        reader.onload = (e) => {
            console.log('✅ Imagen leída, creando Image...');
            const img = new Image();
            
            img.onload = () => {
                console.log('📐 Dimensiones originales:', img.width + 'x' + img.height);
                
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Redimensionar MUCHO (máximo 600px para garantizar que quepa en localStorage)
                const maxWidth = 600;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                console.log('📐 Dimensiones redimensionadas:', width + 'x' + height);
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                console.log('✅ Canvas dibujado');

                // Comprimir muy agresivamente con calidad baja
                canvas.toBlob((blob) => {
                    if (!blob) {
                        console.error('❌ Error: blob es nulo');
                        mostrarToast('❌ Error al comprimir imagen', 'error');
                        return;
                    }
                    
                    const sizeKB = (blob.size / 1024).toFixed(2);
                    const sizeMB = (blob.size / 1024 / 1024).toFixed(2);
                    console.log(`📦 Comprimido - Tamaño: ${sizeKB}KB (${sizeMB}MB)`);
                    
                    const reader2 = new FileReader();
                    reader2.onerror = () => {
                        console.error('❌ ERROR en FileReader 2');
                        mostrarToast('❌ Error al procesar imagen comprimida', 'error');
                    };
                    
                    reader2.onload = (e2) => {
                        if (!e2.target.result) {
                            console.error('❌ Error: result vacío');
                            mostrarToast('❌ Error al convertir imagen a Base64', 'error');
                            return;
                        }
                        console.log('✅ Foto convertida a Base64, longitud:', e2.target.result.length);
                        callback(e2.target.result);
                    };
                    reader2.readAsDataURL(blob);
                }, 'image/jpeg', 0.4); // 40% de calidad
            };
            
            img.onerror = () => {
                console.error('❌ Error al cargar la imagen en Image');
                mostrarToast('❌ Error al procesar la imagen', 'error');
            };
            
            console.log('Asignando src a Image...');
            img.src = e.target.result;
        };
        
        console.log('Leyendo archivo...');
        reader.readAsDataURL(file);
    }

    // 8. Función para aplicar foto
    function aplicarFoto(dataURL) {
        foto = dataURL;
        if (elements.avatarImg) {
            elements.avatarImg.src = dataURL;
            elements.avatarImg.style.display = 'block';
        }
        if (elements.avatarSvg) elements.avatarSvg.style.display = 'none';
        console.log('✅ Foto actualizada');
    }

    // 9. Botón Cambiar Foto
    if (elements.btnCambiarFoto && elements.photoInput) {
        // Clonar para evitar listeners duplicados
        const newBtn = elements.btnCambiarFoto.cloneNode(true);
        elements.btnCambiarFoto.parentNode.replaceChild(newBtn, elements.btnCambiarFoto);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            elements.photoInput.click();
        });
    }

    // 10. Input file
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

    // 11. Botón Anterior
    if (elements.btnAnterior) {
        const newBtn = elements.btnAnterior.cloneNode(true);
        elements.btnAnterior.parentNode.replaceChild(newBtn, elements.btnAnterior);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Guardar temporalmente los datos del paso 2 antes de volver
            guardarDatosPaso2EnLocalStorage();
            window.location.href = `/frontend/public/views/views_edit_product.html?id=${productoId}`;
        });
    }

    // 12. Función para guardar datos del paso 2 en localStorage (para volver)
    function guardarDatosPaso2EnLocalStorage() {
        localStorage.setItem('edit_temp_finca', elements.inputNombreFinca?.value || '');
        localStorage.setItem('edit_temp_stock', elements.inputStock?.value || '');
        localStorage.setItem('edit_temp_direccion', elements.inputDireccionFinca?.value || '');
        localStorage.setItem('edit_temp_tipoEnvio', elements.selectTipoEnvio?.value || 'domicilio');
        localStorage.setItem('edit_temp_descripcion', elements.textareaDescripcion?.value || '');
        // NO guardar foto en localStorage
        console.log('Datos paso 2 guardados temporalmente (sin foto)');
    }

    // 13. Función para guardar cambios finales
    function guardarCambios() {
        // Validaciones básicas
        if (!elements.inputNombreFinca || elements.inputNombreFinca.value.trim() === '') {
            elements.inputNombreFinca?.focus();
            elements.inputNombreFinca.style.borderColor = '#ef4444';
            mostrarToast('❌ El nombre de la finca es obligatorio', 'error');
            setTimeout(() => {
                if (elements.inputNombreFinca) elements.inputNombreFinca.style.borderColor = '';
            }, 2000);
            return false;
        }

        // Obtener datos del paso 1 desde localStorage
        const datosPaso1 = {
            nombre: localStorage.getItem('edit_nombreProducto') || producto.nombre || '',
            tipo: localStorage.getItem('edit_tipoProducto') || producto.tipo || 'fruta',
            peso: localStorage.getItem('edit_pesoProducto') || producto.peso || '',
            tipoPeso: localStorage.getItem('edit_tipoPeso') || producto.tipoPeso || 'kilos',
            precio: localStorage.getItem('edit_precioProducto') || producto.precioOriginal || '',
            descuento: localStorage.getItem('edit_descuento') || producto.descuento || 'no'
        };

        console.log('📋 Datos recuperados del paso 1:', datosPaso1);
        console.log('📸 Foto actual:', foto ? foto.substring(0, 50) + '...' : 'Sin foto');

        // Validar que tengamos al menos un nombre
        if (!datosPaso1.nombre || datosPaso1.nombre.trim() === '') {
            mostrarToast('❌ El nombre del producto del paso 1 es obligatorio', 'error');
            console.error('❌ Nombre del producto vacío');
            return false;
        }

        // Calcular precio final
        const precioNum = parseInt(String(datosPaso1.precio).replace(/[^0-9]/g, ''), 10) || 0;
        const descNum = datosPaso1.descuento === 'no' ? 0 : parseInt(String(datosPaso1.descuento).replace(/[^0-9]/g, ''), 10) || 0;
        const precioFinal = descNum > 0 ? Math.round(precioNum * (1 - descNum / 100)) : precioNum;
        
        console.log('💰 Cálculo de precios:', { precioNum, descNum, precioFinal });

        // Actualizar producto con todos los datos
        producto.nombre = datosPaso1.nombre;
        producto.name = datosPaso1.nombre;
        producto.tipo = datosPaso1.tipo;
        producto.peso = datosPaso1.peso;
        producto.tipoPeso = datosPaso1.tipoPeso;
        producto.unit = datosPaso1.tipoPeso;
        producto.precioOriginal = precioNum;
        producto.price = precioNum;
        producto.precio = precioFinal;
        producto.descuento = descNum;
        producto.foto = foto;
        producto.img = foto;

        // Datos del paso 2
        producto.finca = elements.inputNombreFinca?.value.trim() || '';
        producto.vendor = producto.finca;
        producto.stock = elements.inputStock?.value || '';
        producto.direccion = elements.inputDireccionFinca?.value.trim() || '';
        producto.tipoEnvio = elements.selectTipoEnvio?.value || 'domicilio';
        producto.descripcion = elements.textareaDescripcion?.value.trim() || '';

        console.log('📝 Producto actualizado:', producto);

        // Guardar en localStorage
        const index = misProductos.findIndex(p => p.id === productoId);
        if (index !== -1) {
            misProductos[index] = producto;
            localStorage.setItem('misProductos', JSON.stringify(misProductos));
            console.log('✅ Producto guardado en localStorage');

            // Limpiar datos temporales
            const claves = ['edit_nombreProducto', 'edit_tipoProducto', 'edit_pesoProducto',
                            'edit_tipoPeso', 'edit_precioProducto', 'edit_descuento',
                            'edit_temp_finca', 'edit_temp_stock', 'edit_temp_direccion',
                            'edit_temp_tipoEnvio', 'edit_temp_descripcion'];
            claves.forEach(k => localStorage.removeItem(k));
            console.log('🗑️ Datos temporales limpios');

            console.log('✅ Producto actualizado:', producto.nombre);
            return true;
        } else {
            console.error('❌ Producto no encontrado en misProductos con ID:', productoId);
            mostrarToast('❌ Error al guardar: Producto no encontrado', 'error');
            return false;
        }
    }

    // 14. Botón Publicar Producto (submit)
    if (elements.btnPublicar) {
        const newBtn = elements.btnPublicar.cloneNode(true);
        elements.btnPublicar.parentNode.replaceChild(newBtn, elements.btnPublicar);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔵 CLIC BOTÓN PUBLICAR');
            
            // Desabilitar el botón para evitar clicks múltiples
            newBtn.disabled = true;
            newBtn.style.opacity = '0.5';
            const textOriginal = newBtn.textContent;
            newBtn.textContent = '⏳ Guardando...';
            
            try {
                if (guardarCambios()) {
                    console.log('✅ GUARDADO EXITOSO');
                    mostrarToast('✓ Producto actualizado correctamente', 'success');
                    setTimeout(() => {
                        window.location.href = '/frontend/public/views/views_product_new.html';
                    }, 1500);
                } else {
                    console.log('❌ GUARDADO FALLÓ');
                    newBtn.disabled = false;
                    newBtn.style.opacity = '1';
                    newBtn.textContent = textOriginal;
                }
            } catch (err) {
                console.error('❌ ERROR EN GUARDADO:', err);
                mostrarToast('❌ Error al guardar: ' + err.message, 'error');
                newBtn.disabled = false;
                newBtn.style.opacity = '1';
                newBtn.textContent = textOriginal;
            }
        });
    }

    // 15. También manejar submit del formulario (por si el usuario presiona Enter)
    if (elements.form) {
        elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (guardarCambios()) {
                mostrarToast('✓ Producto actualizado correctamente', 'success');
                setTimeout(() => {
                    window.location.href = '/frontend/public/views/views_product_new.html';
                }, 1500);
            }
        });
    }

    // 16. Función Toast
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

    console.log('✅ Edit Product Step 2 inicializado correctamente');
}