// Exportamos una función llamada loadProducts que acepta:
// - containerSelector: un selector CSS para el contenedor donde van las cards
// - productIds: un array opcional con los IDS de los productos que se quieren mostrar.

export async function loadProducts(containerSelector, productIds = []) {
    // Obtenemos el contenedor del DOM
    const container = document.querySelector(containerSelector);
    // Si el contenedor no existe, salimos
    if (!container) return;

    try {
        const [templateRes, dataRes] = await Promise.all([
            // 1- Fetch para la plantilla
            fetch("/frontend/public/views/components/cardsProduct.html"),
            // 2- Fetch para los datos
            fetch("/frontend/public/js/components/card_product.json"),
        ]);

        // Convertir las respuestas de las promesas a texto y a json
        const template = await templateRes.text();
        const products = await dataRes.json();

        // Filtramos los productos si se proporcionan los IDS específicos
        const filteredProducts = productIds.length
            ? products.filter(product => productIds.includes(product.id))
            : products;

        filteredProducts.forEach(product => {
            // Reemplazamos los placeholder{{...}} del template con los datos reales
            let html = template
                .replace(/{{title}}/g, product.title) // Uso de /g para reemplazar todas las ocurrencias
                .replace("{{image}}", product.image)
                .replace("{{icon}}", product.icon)
                .replace("{{description}}", product.description)
                .replace("{{link}}", product.link)

            // Insertamos el HTML de la tarjeta al final del contenedor
            container.insertAdjacentHTML("beforeend", html)
        });
    } catch (error) {
        console.error("Error cargando los productos", error);
    }
}