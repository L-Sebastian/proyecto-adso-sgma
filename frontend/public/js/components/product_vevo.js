// Estado de la aplicación
let products = [
    {
        id: 1,
        name: 'Fresas',
        price: '12140',
        seller: 'Vendido por: Finca el Porvenir',
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop'
    },
    {
        id: 2,
        name: 'Uva Isabella',
        price: '5260',
        seller: 'Vendido por: Finca el Inicio',
        image: 'https://images.unsplash.com/photo-1599819177552-992e41a80a3a?w=400&h=400&fit=crop'
    },
    {
        id: 3,
        name: 'Naranja Tangelo',
        price: '6400',
        seller: 'Vendido por: Finca Imbachi',
        image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=400&fit=crop'
    },
    {
        id: 4,
        name: 'Ciruela Roja',
        price: '3600',
        seller: 'Vendido por: Finca Imbachi',
        image: 'https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?w=400&h=400&fit=crop'
    }
];

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const modal = document.getElementById('modal');
const btnCrearProducto = document.getElementById('btnCrearProducto');
const btnCancelar = document.getElementById('btnCancelar');
const btnGuardar = document.getElementById('btnGuardar');
const btnVolver = document.getElementById('btnVolver');

// Inputs del formulario
const inputNombre = document.getElementById('inputNombre');
const inputPrecio = document.getElementById('inputPrecio');
const inputVendedor = document.getElementById('inputVendedor');
const inputImagen = document.getElementById('inputImagen');

// Función para crear el HTML de una tarjeta de producto
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">
                    $${product.price}
                    <span class="product-price-unit">lb.</span>
                </p>
                <p class="product-seller">${product.seller}</p>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    Agregar
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// Función para renderizar todos los productos
function renderProducts() {
    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Función para agregar producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`${product.name} agregado al carrito!`);
    }
}

// Función para abrir el modal
function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Función para cerrar el modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    clearForm();
}

// Función para limpiar el formulario
function clearForm() {
    inputNombre.value = '';
    inputPrecio.value = '';
    inputVendedor.value = '';
    inputImagen.value = '';
}

// Función para validar el formulario
function validateForm() {
    if (!inputNombre.value.trim()) {
        alert('Por favor ingresa el nombre del producto');
        return false;
    }
    if (!inputPrecio.value || inputPrecio.value <= 0) {
        alert('Por favor ingresa un precio válido');
        return false;
    }
    if (!inputVendedor.value.trim()) {
        alert('Por favor ingresa el vendedor');
        return false;
    }
    if (!inputImagen.value.trim()) {
        alert('Por favor ingresa la URL de la imagen');
        return false;
    }
    return true;
}

// Función para guardar un nuevo producto
function saveProduct() {
    if (!validateForm()) {
        return;
    }

    const newProduct = {
        id: products.length + 1,
        name: inputNombre.value.trim(),
        price: inputPrecio.value,
        seller: inputVendedor.value.trim(),
        image: inputImagen.value.trim()
    };

    products.push(newProduct);
    renderProducts();
    closeModal();
    
    // Scroll suave hacia el nuevo producto
    setTimeout(() => {
        const cards = document.querySelectorAll('.product-card');
        const lastCard = cards[cards.length - 1];
        if (lastCard) {
            lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

// Event Listeners
btnCrearProducto.addEventListener('click', openModal);
btnCancelar.addEventListener('click', closeModal);
btnGuardar.addEventListener('click', saveProduct);
btnVolver.addEventListener('click', () => {
    window.history.back();
});

// Cerrar modal al hacer click fuera del contenido
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Permitir guardar con Enter en los inputs
const inputs = [inputNombre, inputPrecio, inputVendedor, inputImagen];
inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveProduct();
        }
    });
});

// Renderizar productos iniciales al cargar la página
renderProducts();