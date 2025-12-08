// Exportamos una función llamada loadDiscounts que acepta:
// - containerSelector: un selector CSS para el contenedor donde van las cards
// - discountIds: un array opcional con los IDS de los productos que se quieren mostrar.

export async function loadDiscounts(containerSelector, discountIds = []) {
    // Obtenemos el contenedor del DOM
    const container = document.querySelector(containerSelector);
    // Si el contenedor no existe, salimos
    if (!container) return;

    try {
        const [templateRes, dataRes] = await Promise.all([
            // 1- Fetch para la plantilla
            fetch("/frontend/public/views/components/cardsDescuent.html"),
            // 2- Fetch para los datos
            fetch("/frontend/public/js/components/cards_descuent.json"),
        ]);

        // Convertir las respuestas de las promesas a texto y a json
        const template = await templateRes.text();
        const discounts = await dataRes.json();

        // Filtramos los productos si se proporcionan los IDS específicos
        const filteredDiscounts = discountIds.length
            ? discounts.filter(discount => discountIds.includes(discount.id))
            : discounts;

        filteredDiscounts.forEach(discount => {
            // Reemplazamos los placeholder{{...}} del template con los datos reales
            let html = template
                .replace(/{{name}}/g, discount.name)
                .replace("{{image}}", discount.image)
                .replace("{{discount}}", discount.discount)
                .replace("{{originalPrice}}", discount.originalPrice)
                .replace("{{finalPrice}}", discount.finalPrice)
                .replace("{{unit}}", discount.unit)
                .replace("{{vendor}}", discount.vendor)
                .replace("{{link}}", discount.link)

            // Insertamos el HTML de la tarjeta al final del contenedor
            container.insertAdjacentHTML("beforeend", html)
        });
    } catch (error) {
        console.error("Error cargando los descuentos", error);
    }
}