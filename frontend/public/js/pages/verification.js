async function loadComponent(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al cargar ${url}: ${response.status}`);
        const htmlContent = await response.text();

        const placeholder = document.getElementById(elementId);
        if (placeholder) {
            placeholder.innerHTML = htmlContent;
        } else {
            console.error(`No se encontró el elemento con ID: ${elementId}`);
        }
    } catch (error) {
        console.error('Fallo en la carga del componente:', error);
    }
}

function initializeForm() {
    // ⚠️ CAMBIO AQUÍ: de 'VerificacionFrom' a 'verificationForm'
    const form = document.getElementById('verificationForm');
    
    if (form) {
        console.log('✅ Formulario encontrado');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputs = document.querySelectorAll('.code-input');
            let completo = true;

            inputs.forEach(input => {
                if (input.value.trim() === '') {
                    completo = false;
                }
            });

            if (completo) {
                window.location.href = './views_login.html';
            } else {
                alert('Por favor completa todos los campos antes de continuar.');
            }
        });
    } else {
        console.error('❌ Formulario no encontrado');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const headerPath = './components/components/header_2.html';
    const bodyPath = './components/components/verification.html';

    await loadComponent(headerPath, 'header-placeholder');
    await loadComponent(bodyPath, 'body-placeholder');
    
    // Espera a que el DOM se actualice completamente
    setTimeout(initializeForm, 150);
});