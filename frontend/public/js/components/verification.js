// verification.js - Cargar componente y activar lógica

document.addEventListener("DOMContentLoaded", () => {

    // 1. Contenedor donde se debe cargar el componente
    const container = document.querySelector(".main-content-verification");

    if (container) {

        // 2. Ruta del componente
        const url = "/frontend/public/views/components/verification.html";

        // 3. Cargar HTML
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cargar verification.html");
                return res.text();
            })
            .then(html => {
                // Insertamos el componente dentro del contenedor
                container.innerHTML = html;

                // Inicializamos la lógica del formulario
                initVerification();
            })
            .catch(err => console.error("Error cargando el componente de verificación:", err));
    }
});


// -----------------------------------------------------------
//  FUNCIÓN PRINCIPAL DEL FORMULARIO
// -----------------------------------------------------------
function initVerification() {

    const form = document.getElementById("verificationForm");
    if (!form) return; // No existe → aún no cargó el HTML

    const inputs = Array.from(form.querySelectorAll(".code-input"));
    const help = document.getElementById("codeHelp");

    // Seleccionar primer input
    inputs[0].focus();


    // --------------------------
    // Eventos de inputs
    // --------------------------
    inputs.forEach((input, idx) => {

        input.addEventListener("input", e => {
            const digit = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
            e.target.value = digit;

            if (digit && idx < inputs.length - 1) {
                inputs[idx + 1].focus();
            }
        });

        input.addEventListener("keydown", e => {
            if (e.key === "Backspace" && !input.value && idx > 0) {
                inputs[idx - 1].focus();
            }
        });

    });


    // --------------------------
    // ENVÍO DEL FORMULARIO
    // --------------------------
    form.addEventListener("submit", e => {
        e.preventDefault();

        const code = inputs.map(i => i.value).join("");

        if (code.length !== 6) {
            help.textContent = "Debe ingresar los 6 dígitos.";
            help.classList.add("error");
            return;
        }

        help.textContent = "";
        help.classList.remove("error");

        // Simulación (solo aceptará 123456)
        if (code === "123456") {
            alert("Código correcto");
        } else {
            help.textContent = "Código incorrecto. Intente otra vez.";
            help.classList.add("error");
        }
    });

}
