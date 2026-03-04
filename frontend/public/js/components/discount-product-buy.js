document.addEventListener("DOMContentLoaded", function(){
    const sectionElement = document.querySelector(".discounts");

    if(sectionElement){
        fetch("/frontend/public/views/components/discount-products-buy.html")
        .then(response => response.text())
        .then(data => {
            sectionElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el section", error));
    }   
});


document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los botones "Agregar"
    const buttons = document.querySelectorAll('.product__button');

    // Creamos el contenedor de la notificación
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = 'Debes iniciar sesión primero';
    document.body.appendChild(notification);

    // Función para mostrar la notificación
    function showNotification() {
        notification.classList.add('show');
        setTimeout(() => {
        notification.classList.remove('show');
        }, 3000); // Desaparece después de 3 segundos
    }

    // Añadimos el evento a cada botón
    buttons.forEach(button => {
        button.addEventListener('click', showNotification);
    });
});

