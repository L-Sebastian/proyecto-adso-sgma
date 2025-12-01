// shopping.js - modular, no inline handlers, ADSO-compliant

// Funciones auxiliares (disponibles en todo el archivo)

function formatCurrency(n) {
    // Usamos es-CO (Colombia) como en tu código original
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

// 🎯 Función principal de inicialización - Debe ser global
function initShoppingLogic() {
    // 1. Las variables se buscan AHORA, después de que el HTML ha sido insertado
    const listEl = document.getElementById("shoppingItems");
    const emptyEl = document.getElementById("shoppingEmpty");
    const totalEl = document.getElementById("checkoutTotal");
    const payBtn = document.getElementById("payBtn");

    // ⚠️ Validación crucial: Si el HTML no se cargó, detenemos la lógica
    if (!listEl || !totalEl || !payBtn) {
        console.error("Error crítico: Elementos del carrito (listEl, totalEl, o payBtn) no encontrados. Verifique la carga de shopping.html.");
        return;
    }

    // Demo data (replace with server data)
    let cart = [
        {
            id: "pina-01",
            name: "Piña Oro Miel",
            price: 3600,
            originalPrice: 4000,
            quantity: 1,
            vendor: "Finca el Porvenir",
            img: "/frontend/public/img/piña_g.jpg"
        }
    ];

    // Render cart
    function render() {
        listEl.innerHTML = "";
        if (!cart || cart.length === 0) {
            emptyEl.hidden = false;
            totalEl.textContent = "$0";
            payBtn.disabled = true;
            return;
        }
        emptyEl.hidden = true;
        payBtn.disabled = false;

        cart.forEach(item => listEl.appendChild(createItemEl(item)));
        updateTotal();
    }

    // Create DOM for product item
    function createItemEl(item) {
        const li = document.createElement("li");
        li.className = "shopping__item";
        li.dataset.id = item.id;

        li.innerHTML = `
            <img class="shopping__img" src="${item.img}" alt="${item.name}">
            <div class="shopping__meta">
                <div class="shopping__title">${item.name}</div>
                <div class="shopping__desc">${item.vendor}</div>
                <div class="shopping__prices">
                    <span class="shopping__original">${formatCurrency(item.originalPrice)}</span>
                </div>
            </div>
            <div class="shopping__controls">
                <div class="qty" role="group" aria-label="Controles de cantidad">
                    <button class="qty__btn" data-action="decrease" aria-label="Disminuir cantidad">−</button>
                    <div class="qty__value" aria-live="polite">${item.quantity}</div>
                    <button class="qty__btn" data-action="increase" aria-label="Aumentar cantidad">+</button>
                </div>
                <div style="height:8px"></div>
                <div class="shopping__price-wrap">
                    <div class="shopping__price">${formatCurrency(item.price * item.quantity)}</div>
                    <button class="shopping__remove" data-action="remove" aria-label="Eliminar producto">🗑</button>
                </div>
            </div>
        `;
        return li;
    }

    // Delegated event handler for quantity/remove
    // Línea donde estaba el TypeError: Ya NO FALLA porque listEl existe.
    listEl.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const li = btn.closest(".shopping__item");
        const id = li?.dataset?.id;
        const action = btn.dataset.action;
        if (!id || !action) return;

        if (action === "increase") changeQty(id, +1);
        if (action === "decrease") changeQty(id, -1);
        if (action === "remove") removeItem(id);
    });

    function changeQty(id, delta) {
        cart = cart.map(p => p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p);
        render();
    }

    function removeItem(id) {
        cart = cart.filter(p => p.id !== id);
        render();
    }

    function updateTotal(){
        const total = cart.reduce((s, p) => s + p.price * p.quantity, 0);
        totalEl.textContent = formatCurrency(total);
    }

    // Pay button (placeholder)
    // Ya no necesita el operador ?. porque payBtn fue validado arriba.
    payBtn.addEventListener("click", () => { 
        if (!cart.length) return;
        // Replace with real flow
        alert("Procesando pago (demo) — total: " + totalEl.textContent);
    });

    // Initial render
    render();
}

// verification.js - Cargar componente y activar lógica

document.addEventListener("DOMContentLoaded", () => {

    // 1. Contenedor donde se debe cargar el componente
    const container = document.querySelector(".shopping");

    if (container) {

        // 2. Ruta del componente
        const url = "/frontend/public/views/components/shopping.html";

        // 3. Cargar HTML
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cargar shopping.html (" + res.status + ")");
                return res.text();
            })
            .then(html => {
                // Insertamos el componente dentro del contenedor
                container.innerHTML = html;

                // 🎯 ESTA LLAMADA RESUELVE EL TypeError: Inicializamos la lógica 
                // AHORA que los elementos existen en el DOM.
                initShoppingLogic(); 
            })
            .catch(err => console.error("Error cargando el componente de shopping:", err));
    }
});