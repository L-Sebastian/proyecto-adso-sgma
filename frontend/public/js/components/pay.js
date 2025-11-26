document.addEventListener("DOMContentLoaded", function () {
    const bodyContainer = document.querySelector('.checkout-container');

    if (bodyContainer) {
        const bodyURL = '/frontend/public/views/components/pay.html';

        fetch(bodyURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                bodyContainer.innerHTML = data;
            })
            .catch(error =>
                console.error('Error cargando el cuerpo de la página:', error)
            );
    }
});
