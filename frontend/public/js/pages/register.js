// Validación simple del formulario (puedes ampliar)
document.getElementById("formRegistro").addEventListener("submit", function (e) {
  e.preventDefault();

  // Ejemplo: lectura de campo nombre
  const nombre = document.getElementById("nombre").value.trim();
  if (!nombre) {
    alert("Por favor ingresa tu nombre completo.");
    return;
  }

  // Aquí podrías hacer fetch a tu API para registrar usuario
  alert("Cuenta creada con éxito. ¡Bienvenido, " + (nombre || "") + "!");
  this.reset();
});
