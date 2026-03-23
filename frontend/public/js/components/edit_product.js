document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('.main-content');
    if (!container) return;

    fetch('/frontend/public/views/components/edit_product.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initEditProduct();
        })
        .catch(function (err) {
            console.error('Error cargando edit_product:', err);
        });
});

function initEditProduct() {
    // ===== OBTENER ID DEL PRODUCTO =====
    var params = new URLSearchParams(window.location.search);
    var productoId = params.get('id');
    
    if (!productoId) {
        console.error('❌ No se recibió ID de producto');
        return;
    }

    // ===== OBTENER PRODUCTO DE LOCALSTORAGE =====
    var misProductos = [];
    try {
        misProductos = JSON.parse(localStorage.getItem('misProductos')) || [];
    } catch (e) {
        misProductos = [];
    }

    var producto = misProductos.find(function (p) { return p.id === productoId; });
    if (!producto) {
        console.error('❌ Producto no encontrado:', productoId);
        return;
    }

    // ===== ELEMENTOS DEL DOM =====
    const elements = {
        avatarImg: document.querySelector('.epAvatarImg'),
        avatarSvg: document.querySelector('.epAvatarSvg'),
        photoInput: document.querySelector('.epPhotoInput'),
        btnSubirFoto: document.querySelector('.epBtnSubirFoto'), // ✅ Botón "Subir Foto"
        btnEliminarFoto: document.querySelector('.epBtnEliminarFoto'),
        btnSiguiente: document.querySelector('.btnSiguiente'), // ✅ Botón "Siguiente"
        form: document.querySelector('.editProductForm')
    };

    console.log('🔍 Elementos encontrados:', {
        avatarImg: !!elements.avatarImg,
        photoInput: !!elements.photoInput,
        btnSubirFoto: !!elements.btnSubirFoto,
        btnSiguiente: !!elements.btnSiguiente
    });

    // ===== PRECARGAR FOTO =====
    var foto = producto.foto || producto.img || '';
    if (foto && elements.avatarImg) {
        elements.avatarImg.src = foto;
        elements.avatarImg.style.display = 'block';
        if (elements.avatarSvg) elements.avatarSvg.style.display = 'none';
    }

    // ===== FUNCIÓN PARA CARGAR VALORES EN CAMPOS =====
    function setVal(cls, val) {
        var el = document.querySelector(cls);
        if (el && val !== undefined && val !== null) el.value = val;
    }
    
    function setSelect(cls, val) {
        var el = document.querySelector(cls);
        if (!el || !val) return;
        for (var i = 0; i < el.options.length; i++) {
            if (el.options[i].value === String(val)) {
                el.selectedIndex = i;
                break;
            }
        }
    }

    // ===== PRECARGAR TODOS LOS CAMPOS =====
    setVal('.epNombre', producto.nombre || producto.name || '');
    setVal('.epPeso', producto.peso || '');
    setVal('.epPrecio', producto.precioOriginal || producto.price || producto.precio || '');
    setVal('.epFinca', producto.finca || producto.vendor || '');
    setVal('.epStock', producto.stock || '');
    setVal('.epDireccion', producto.direccion || '');
    setVal('.epDescripcion', producto.descripcion || '');
    setSelect('.epTipo', producto.tipo || 'fruta');
    setSelect('.epTipoPeso', producto.tipoPeso || producto.unit || 'kilos');
    setSelect('.epDescuento', String(producto.descuento || 'no'));
    setSelect('.epTipoEnvio', producto.tipoEnvio || 'domicilio');

    // ===== FUNCIÓN PARA APLICAR FOTO =====
    function aplicarFoto(dataURL) {
        if (elements.avatarImg) {
            elements.avatarImg.src = dataURL;
            elements.avatarImg.style.display = 'block';
        }
        if (elements.avatarSvg) {
            elements.avatarSvg.style.display = 'none';
        }
        foto = dataURL; // Actualizar variable global
        console.log('✅ Foto aplicada');
    }

    // ===== BOTÓN SUBIR FOTO =====
    if (elements.btnSubirFoto && elements.photoInput) {
        // Eliminar event listeners anteriores (por si acaso)
        var nuevoBtn = elements.btnSubirFoto.cloneNode(true);
        elements.btnSubirFoto.parentNode.replaceChild(nuevoBtn, elements.btnSubirFoto);
        
        nuevoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📸 Abriendo selector de archivos');
            elements.photoInput.click(); // ¡ABRE EL SELECTOR!
        });
    } else {
        console.warn('⚠️ No se encontró el botón Subir Foto o el input file');
    }

    // ===== INPUT FILE - CUANDO SE SELECCIONA UNA FOTO =====
    if (elements.photoInput) {
        elements.photoInput.addEventListener('change', function() {
            var file = this.files[0];
            if (!file) {
                console.log('No se seleccionó archivo');
                return;
            }
            
            console.log('✅ Archivo seleccionado:', file.name);
            
            var reader = new FileReader();
            reader.onload = function(e) {
                aplicarFoto(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    // ===== ELIMINAR FOTO =====
    if (elements.btnEliminarFoto) {
        elements.btnEliminarFoto.addEventListener('click', function() {
            console.log('🗑️ Eliminando foto');
            foto = '';
            if (elements.avatarImg) {
                elements.avatarImg.src = '';
                elements.avatarImg.style.display = 'none';
            }
            if (elements.avatarSvg) {
                elements.avatarSvg.style.display = 'block';
            }
            if (elements.photoInput) {
                elements.photoInput.value = ''; // Resetear input
            }
        });
    }

    // ===== FUNCIÓN PARA GUARDAR DATOS EN LOCALSTORAGE =====
    function guardarDatosEnLocalStorage() {
        // Guardar todos los campos del formulario en localStorage
        localStorage.setItem('edit_nombreProducto', document.querySelector('.epNombre')?.value || '');
        localStorage.setItem('edit_tipoProducto', document.querySelector('.epTipo')?.value || 'fruta');
        localStorage.setItem('edit_pesoProducto', document.querySelector('.epPeso')?.value || '');
        localStorage.setItem('edit_tipoPeso', document.querySelector('.epTipoPeso')?.value || 'kilos');
        localStorage.setItem('edit_precioProducto', document.querySelector('.epPrecio')?.value || '');
        localStorage.setItem('edit_descuento', document.querySelector('.epDescuento')?.value || 'no');
        localStorage.setItem('edit_nombreFinca', document.querySelector('.epFinca')?.value || '');
        localStorage.setItem('edit_stock', document.querySelector('.epStock')?.value || '');
        localStorage.setItem('edit_direccionFinca', document.querySelector('.epDireccion')?.value || '');
        localStorage.setItem('edit_tipoEnvio', document.querySelector('.epTipoEnvio')?.value || 'domicilio');
        localStorage.setItem('edit_descripcion', document.querySelector('.epDescripcion')?.value || '');
        localStorage.setItem('edit_productPhoto', foto); // Guardar foto
        
        console.log('💾 Datos guardados en localStorage');
    }

    // ===== BOTÓN SIGUIENTE =====
// Al final de initEditProduct(), asegúrate de tener esto:

// ===== BOTÓN SIGUIENTE - Guardar datos y navegar =====
if (elements.btnSiguiente) {
    elements.btnSiguiente.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('➡️ Botón Siguiente clickeado');
        
        // Guardar TODOS los datos en localStorage ANTES de navegar
        guardarDatosEnLocalStorage();
        
        // Guardar la foto actual en localStorage (¡IMPORTANTE!)
        localStorage.setItem('edit_productPhoto_temp', foto);
        
        // Redirigir a edit_product2.html con el ID del producto
        window.location.href = '/frontend/public/views/views_edit_product2.html?id=' + productoId;
    });

    } else {
        console.warn('⚠️ No se encontró el botón Siguiente');
    }

    // ===== MANEJAR SUBMIT DEL FORMULARIO (opcional) =====
    if (elements.form) {
        elements.form.addEventListener('submit', function(e) {
            e.preventDefault();
            // No hacer nada aquí, el botón Siguiente maneja la navegación
        });
    }
}