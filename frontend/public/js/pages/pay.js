/**
 * Carga un archivo HTML y lo inyecta en un elemento placeholder en el DOM.
 * @param {string} url - La ruta relativa al archivo HTML (e.g., '/views/components/header.html').
 * @param {string} elementId - El ID del elemento donde se inyectará el contenido (e.g., 'header-placeholder').
 */
async function loadComponent(url, elementId) {
    try {
        // 1. Obtener el contenido HTML del archivo
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al cargar el componente: ${response.statusText}`);
        }
        const htmlContent = await response.text();

        // 2. Inyectar el contenido en el placeholder
        const placeholder = document.getElementById(elementId);
        if (placeholder) {
            placeholder.innerHTML = htmlContent;
        } else {
            console.error(`Error: No se encontró el elemento con ID: ${elementId}`);
        }
    } catch (error) {
        console.error('Fallo en la carga del componente:', error);
    }
}

// 3. Llamada principal para cargar los componentes
document.addEventListener('DOMContentLoaded', () => {
    // Definimos las rutas de tus componentes
    const headerPath = '/frontend/public/views/components/header.html';
    const navbarPath = '/frontend/public/views/components/navbarshopping.html';
    const bodyPath = '/frontend/public/views/components/pay.html';
    const footerPath = '/frontend/public/views/components/footer.html';


    // Cargamos el header en el div con ID 'header-placeholder'
    loadComponent(headerPath, 'header-placeholder');

    // Cargamos la navbar en el div con ID 'navbar-placeholder'
    loadComponent(navbarPath, 'navbar-placeholder');

    loadComponent(bodyPath, 'body-placeholder');

    loadComponent(footerPath, 'footer-placeholder');



});

        // Update card display when typing
        const cardNameInput = document.getElementById('cardName');
        const cardNumberInput = document.getElementById('cardNumber');
        const displayCardName = document.getElementById('displayCardName');
        const displayCardNumber = document.getElementById('displayCardNumber');

        cardNameInput.addEventListener('input', (e) => {
            displayCardName.textContent = e.target.value || 'Juan Antonio de la Cruz';
        });

        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
            
            if (value.length >= 12) {
                displayCardNumber.textContent = '•••• •••• •••• ' + value.slice(-4);
            } else {
                displayCardNumber.textContent = '•••• •••• •••• ••••';
            }
        });

        // Payment options selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        function processPayment() {
            alert('Procesando pago de COP $26.940...\n\nEsta es una demostración. En producción, aquí se procesaría el pago real.');
        }