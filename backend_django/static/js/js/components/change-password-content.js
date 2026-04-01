document.addEventListener("DOMContentLoaded", function () {
  const shareSection = document.querySelector(".main__content__change__password");

  if (shareSection) {
    fetch("/frontend/public/views/components/change-password-content.html")
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
        console.error("Error al cargar el componente 'change-password-content:", error);
      });
  }
});