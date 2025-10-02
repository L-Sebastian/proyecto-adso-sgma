document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".agricultura-box");

  if (contenedor) {
    fetch("/frontend/public/views/components/agriculture-index.html")
      .then(res => res.text())
      .then(html => {
        contenedor.innerHTML = html;
      })
      .catch(err => console.error("Error cargando la sección de agricultura:", err));
  }
});
