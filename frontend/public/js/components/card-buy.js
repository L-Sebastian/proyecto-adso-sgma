/* Esto va en el HTML */




// Lista de productos
const products = [
  {
    title: "Piña Con Miel",
    image: "pina.jpg",
    discount: 10,
    oldPrice: 4000,
    price: 3600,
    unit: "Und.",
    vendor: "Finca el Porvenir"
  },
  {
    title: "Zanahoria",
    image: "zanahoria.jpg",
    discount: 10,
    oldPrice: 4900,
    price: 4410,
    unit: "Lb.",
    vendor: "Finca el Indio"
  },
  {
    title: "Lomo de cerdo",
    image: "cerdo.jpg",
    discount: 10,
    oldPrice: 13000,
    price: 11700,
    unit: "Lb.",
    vendor: "Finca la cristina"
  },
  {
    title: "Papaya",
    image: "papaya.jpg",
    discount: 10,
    oldPrice: 1900,
    price: 1710,
    unit: "Lb.",
    vendor: "Finca el Porvenir"
  }
];

// Renderiza cada producto en el HTML
function renderProducts(products) {
  const container = document.getElementById("productsContainer");
  container.innerHTML = ""; // limpia si se vuelve a llamar

  products.forEach(product => {
    const productHTML = `
      <div class="product">
        <img src="${product.image}" alt="${product.title}" class="product__image">
        <h3 class="product__title">${product.title}</h3>
        <div class="product__price-info">
          <span class="product__discount">-${product.discount}%</span>
          <span class="product__old-price">$${product.oldPrice.toLocaleString()}</span>
        </div>
        <div class="product__price">$${product.price.toLocaleString()} <span class="product__unit">${product.unit}</span></div>
        <div class="product__vendor">Vendida por ${product.vendor}</div>
        <button class="product__button">
          Agregar <span class="product__cart-icon">🛒</span>
        </button>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", productHTML);
  });
}

// Llama la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
});

/* Fin parte 1 */



