document.addEventListener("DOMContentLoaded", function () {
  const shareSection = document.querySelector(".share-section");

  if (shareSection) {
    fetch("/frontend/public/views/components/blog_components/main.html")
      .then(response => {
        if (!response.ok) {
          throw new Error("No se pudo cargar el componente.");
        }
        return response.text();
      })
      .then(data => {
        shareSection.innerHTML = data;
      })
      .catch(error => {
        console.error("Error al cargar el componente 'share-section':", error);
      });
  }
});
