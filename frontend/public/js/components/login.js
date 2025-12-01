document.addEventListener("DOMContentLoaded", function () {
  // Contenedor principal donde se inyecta el componente
  const bodyContainer = document.querySelector('.main-content');

  if (bodyContainer) {
    const bodyURL = '/frontend/public/views/components/login.html';

    fetch(bodyURL)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then(html => {
        bodyContainer.innerHTML = html;
        attachLoginHandlers();
      })
      .catch(err => {
        console.error('Error cargando el cuerpo de la página:', err);
      });
  }

  function attachLoginHandlers() {
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation demo
      clearFieldErrors();

      let hasError = false;
      if (!validateEmail(email.value)) {
        setFieldError(email, 'Introduce un correo válido.');
        hasError = true;
      }
      if (password.value.trim().length < 6) {
        setFieldError(password, 'La contraseña debe tener al menos 6 caracteres.');
        hasError = true;
      }

      if (hasError) {
        showMessage('Por favor corrige los errores en el formulario.', 'error');
        return;
      }

      // Simulación de envío exitoso
      showMessage('Inicio de sesión correcto. Redirigiendo...', 'success');
      // aquí va la lógica real: llamada fetch a la API etc.
    });

    // botones secundarios
    document.getElementById('createAccountBtn')?.addEventListener('click', function(){
      showMessage('Formulario de creación de cuenta (pendiente).', 'info');
    });
    document.getElementById('recoverAccountBtn')?.addEventListener('click', function(){
      showMessage('Recuperación de cuenta (pendiente).', 'info');
    });
  }

  function setFieldError(inputEl, msg) {
    const wrapper = inputEl.closest('.form-group-login');
    if (!wrapper) return;
    wrapper.classList.add('has-error');
    // crear o actualizar label de ayuda
    let help = wrapper.querySelector('.field-help');
    if (!help) {
      help = document.createElement('div');
      help.className = 'field-help';
      help.style.color = '#e74c3c';
      help.style.marginTop = '0.5rem';
      help.style.fontSize = '0.875rem';
      wrapper.appendChild(help);
    }
    help.textContent = msg;
    inputEl.setAttribute('aria-invalid','true');
  }

  function clearFieldErrors(){
    document.querySelectorAll('.form-group-login.has-error').forEach(w => {
      w.classList.remove('has-error');
      const help = w.querySelector('.field-help');
      if (help) help.remove();
    });
    document.querySelectorAll('.form-group-login input').forEach(i => i.removeAttribute('aria-invalid'));
  }

  function validateEmail(email) {
    // simple regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showMessage(text, type = 'info') {
    // Remove existing
    const existing = document.querySelector('.message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.setAttribute('role','status');
    div.textContent = text;
    document.body.appendChild(div);

    setTimeout(() => {
      if (div) div.remove();
    }, 4500);
  }
});
