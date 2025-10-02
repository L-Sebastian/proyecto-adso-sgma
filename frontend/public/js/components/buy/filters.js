
const products = [
  {
    title: "Piña Con Miel",
    image: "/frontend/img/Buy/piña.png",
    discount: 10,
    oldPrice: 4000,
    price: 3600,
    unit: "Und.",
    vendor: "Finca el Porvenir",
    category: "Frutas"
  },
  {
    title: "Zanahoria",
    image: "/frontend/img/Buy/zanahoria.png",
    discount: 10,
    oldPrice: 4900,
    price: 4410,
    unit: "Lb.",
    vendor: "Finca el Indio",
    category: "Verduras"
  },
  {
    title: "Lomo de cerdo",
    image: "/frontend/img/Buy/carne.png",
    discount: 10,
    oldPrice: 13000,
    price: 11700,
    unit: "Lb.",
    vendor: "Finca la cristina",
    category: "Carnes"
  },
  {
    title: "Papaya",
    image: "/frontend/img/Buy/papaya.png",
    discount: 10,
    oldPrice: 1900,
    price: 1710,
    unit: "Lb.",
    vendor: "Finca el Porvenir",
    category: "Frutas"
  },
  {
    title: "Abono y fertilizante",
    image: "/frontend/img/Buy/fertilizante.png",
    discount: 5,
    oldPrice: 0,
    price: 33500,
    unit: "Bolsa",
    vendor: "BioAgro S.A",
    category: "Fertilizantes"
  }
];

// Reutilizamos esta función
function renderProducts(productsList) {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "";

  productsList.forEach(product => {
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

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);

  // Agregar eventos a los botones de filtro
    const filterButtons = document.querySelectorAll('.filters__button');

    
    filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');

    if (category === "Todos") {
        renderProducts(products); //  Mostrar todos
    } else {
        const filteredProducts = products.filter(p => p.category === category);
        renderProducts(filteredProducts);
    }
    });
  });
});


 