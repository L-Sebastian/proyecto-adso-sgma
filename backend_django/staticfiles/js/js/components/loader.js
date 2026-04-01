document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.querySelector(".shopping") || document.querySelector(".main-content-shopping");
    if (!placeholder) return;

    fetch("/frontend/public/views/components/shopping.html")
        .then(r => {
            if (!r.ok) throw new Error("No se pudo cargar shopping.html");
            return r.text();
        })
        .then(html => {
            // 1. Insertamos el HTML del carrito
            placeholder.innerHTML = html;

            // 2. Cargamos y ejecutamos el script de lógica SÓLO después de la inserción.
            // Esto asegura que todos los elementos HTML estén disponibles cuando se ejecute shopping.js
            const script = document.createElement('script');
            script.src = '/frontend/public/js/components/shopping.js';
            document.body.appendChild(script); 
        })
        .catch(err => console.error(err));
});