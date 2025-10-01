// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validate form
    if (!validateLoginForm(email, password)) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Simulate login API call
    setTimeout(() => {
        // Create login data object
        const loginData = {
            email,
            password: '***hidden***', // Never log actual passwords
            loginAt: new Date().toISOString()
        };
        
        console.log('Intento de inicio de sesión:', loginData);
        
        // Remove loading state
        setLoadingState(false);
        
        // Show success message
        showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
        
        // Reset form
        setTimeout(() => {
            this.reset();
            // Simulate redirect to dashboard
            console.log('Redirigiendo al dashboard...');
        }, 2000);
    }, 1500);
});

// Validation function
function validateLoginForm(email, password) {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Por favor ingresa un correo electrónico válido', 'error');
        return false;
    }
    
    // Validate password
    if (password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }
    
    return true;
}

// Show message function
function showMessage(text, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 4 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => messageDiv.remove(), 400);
    }, 4000);
}

// Loading state handler
const submitBtn = document.querySelector('.submit-btn');
const originalBtnText = submitBtn.textContent;

function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Iniciando...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
    }
}

// Input effects and real-time validation
const inputs = document.querySelectorAll('.form-group input');

inputs.forEach(input => {
    // Focus effect
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateX(8px)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    // Blur effect
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateX(0)';
    });
    
    // Real-time validation indicators
    input.addEventListener('input', function() {
        if (this.value.length > 0) {
            if (this.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(this.value)) {
                    this.style.borderColor = '#00d084';
                    this.style.borderWidth = '2px';
                    this.style.borderStyle = 'solid';
                } else {
                    this.style.borderColor = '#e74c3c';
                    this.style.borderWidth = '2px';
                    this.style.borderStyle = 'solid';
                }
            } else if (this.type === 'password') {
                if (this.value.length >= 6) {
                    this.style.borderColor = '#00d084';
                    this.style.borderWidth = '2px';
                    this.style.borderStyle = 'solid';
                } else {
                    this.style.borderColor = '#e74c3c';
                    this.style.borderWidth = '2px';
                    this.style.borderStyle = 'solid';
                }
            }
        } else {
            this.style.borderColor = '';
            this.style.borderWidth = '';
            this.style.borderStyle = '';
        }
    });
});

// Create Account Button Handler
document.getElementById('createAccountBtn').addEventListener('click', function() {
    showMessage('Redirigiendo a crear cuenta...', 'info');
    setTimeout(() => {
        // Simulate redirect to create account page
        console.log('Navegando a: crear-cuenta.html');
        // window.location.href = 'crear-cuenta.html';
    }, 1000);
});

// Recover Account Button Handler
document.getElementById('recoverAccountBtn').addEventListener('click', function() {
    showMessage('Redirigiendo a recuperación de cuenta...', 'info');
    setTimeout(() => {
        // Simulate redirect to recover account page
        console.log('Navegando a: recuperacion.html');
        // window.location.href = 'recuperacion.html';
    }, 1000);
});

// Social media links configuration
const socialLinks = document.querySelectorAll('.social-icon');
if (socialLinks.length >= 4) {
    socialLinks[0].href = 'https://facebook.com/sgma'; // Facebook
    socialLinks[1].href = 'https://youtube.com/sgma'; // YouTube
    socialLinks[2].href = 'https://tiktok.com/@sgma'; // TikTok
    socialLinks[3].href = 'https://instagram.com/sgma'; // Instagram
}

// Password visibility toggle (optional enhancement)
function addPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const passwordGroup = passwordInput.parentElement;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'password-toggle';
    toggleBtn.style.cssText = `
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        opacity: 0.6;
        transition: opacity 0.3s;
    `;
    
    passwordGroup.style.position = 'relative';
    passwordGroup.appendChild(toggleBtn);
    
    
    toggleBtn.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
    });
    
    toggleBtn.addEventListener('mouseleave', function() {
        this.style.opacity = '0.6';
    });
}

// Call the password toggle function
addPasswordToggle();

// Remember email functionality (using memory, not localStorage)
let rememberedEmail = '';

// Load remembered email on page load
window.addEventListener('load', function() {
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
    }
});

// Save email when form is submitted successfully
document.getElementById('loginForm').addEventListener('submit', function() {
    const email = document.getElementById('email').value.trim();
    if (email) {
        rememberedEmail = email;
    }
});

// Enter key handler for better UX
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
});