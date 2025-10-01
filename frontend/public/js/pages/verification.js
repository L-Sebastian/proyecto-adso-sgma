// Get all code input elements
const codeInputs = document.querySelectorAll('.code-input');
const verificationForm = document.getElementById('verificationForm');
const submitBtn = document.querySelector('.submit-btn');

// Initialize - focus on first input
window.addEventListener('load', () => {
    codeInputs[0].focus();
});

// Handle input in code fields
codeInputs.forEach((input, index) => {
    // Handle input event
    input.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Only allow numbers and letters
        if (!/^[0-9a-zA-Z]$/.test(value)) {
            e.target.value = '';
            return;
        }
        
        // Convert to uppercase
        e.target.value = value.toUpperCase();
        
        // Add filled class
        if (value) {
            input.classList.add('filled');
            input.classList.remove('error');
        } else {
            input.classList.remove('filled');
        }
        
        // Auto-focus next input
        if (value && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
        
        // Enable submit button if all fields are filled
        checkAllFieldsFilled();
    });
    
    // Handle keydown for backspace
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
            codeInputs[index - 1].focus();
            codeInputs[index - 1].value = '';
            codeInputs[index - 1].classList.remove('filled');
        }
        
        // Handle left arrow
        if (e.key === 'ArrowLeft' && index > 0) {
            codeInputs[index - 1].focus();
        }
        
        // Handle right arrow
        if (e.key === 'ArrowRight' && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
    });
    
    // Handle paste
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').toUpperCase();
        const pastedChars = pastedData.split('');
        
        // Fill inputs with pasted data
        pastedChars.forEach((char, i) => {
            if (index + i < codeInputs.length && /^[0-9A-Z]$/.test(char)) {
                codeInputs[index + i].value = char;
                codeInputs[index + i].classList.add('filled');
            }
        });
        
        // Focus last filled input or next empty input
        const lastFilledIndex = Math.min(index + pastedChars.length - 1, codeInputs.length - 1);
        codeInputs[lastFilledIndex].focus();
        
        checkAllFieldsFilled();
    });
    
    // Prevent more than one character
    input.addEventListener('keypress', (e) => {
        if (input.value.length >= 1) {
            e.preventDefault();
        }
    });
});

// Check if all fields are filled
function checkAllFieldsFilled() {
    const allFilled = Array.from(codeInputs).every(input => input.value.length === 1);
    submitBtn.disabled = !allFilled;
}

// Handle form submission
verificationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get the code
    const code = Array.from(codeInputs).map(input => input.value).join('');
    
    // Validate code length
    if (code.length !== 6) {
        showMessage('Por favor completa todos los campos del código', 'error');
        highlightEmptyFields();
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Simulate API verification
    setTimeout(() => {
        // Simulate validation (you can replace this with actual validation)
        const isValidCode = validateCode(code);
        
        setLoadingState(false);
        
        if (isValidCode) {
            showMessage('¡Código verificado exitosamente! Redirigiendo...', 'success');
            console.log('Código verificado:', code);
            
            // Reset form after success
            setTimeout(() => {
                resetForm();
                // Simulate redirect to password reset page
                console.log('Redirigiendo a restablecer contraseña...');
            }, 2000);
        } else {
            showMessage('Código incorrecto. Por favor intenta nuevamente.', 'error');
            shakeInputs();
            clearForm();
        }
    }, 1500);
});

// Validate code (this is a simulation - replace with actual validation)
function validateCode(code) {
    // For demo purposes, accept any 6-character code
    // In production, you would validate against the server
    console.log('Validando código:', code);
    
    // Simulate random validation (80% success rate for demo)
    return Math.random() > 0.2;
}

// Show message function
function showMessage(text, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => messageDiv.remove(), 400);
    }, 4000);
}

// Loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verificando...';
        submitBtn.style.opacity = '0.7';
        codeInputs.forEach(input => input.disabled = true);
    } else {
        submitBtn.textContent = 'Enviar codigo';
        submitBtn.style.opacity = '1';
        codeInputs.forEach(input => input.disabled = false);
        checkAllFieldsFilled();
    }
}

// Shake inputs on error
function shakeInputs() {
    codeInputs.forEach(input => {
        input.classList.add('error');
        setTimeout(() => {
            input.classList.remove('error');
        }, 400);
    });
}

// Highlight empty fields
function highlightEmptyFields() {
    codeInputs.forEach(input => {
        if (!input.value) {
            input.classList.add('error');
            setTimeout(() => {
                input.classList.remove('error');
            }, 400);
        }
    });
}

// Clear form
function clearForm() {
    codeInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled');
    });
    codeInputs[0].focus();
    checkAllFieldsFilled();
}

// Reset form
function resetForm() {
    clearForm();
}

// Social media links
const socialLinks = document.querySelectorAll('.social-icon');
if (socialLinks.length >= 4) {
    socialLinks[0].href = 'https://facebook.com/sgma';
    socialLinks[1].href = 'https://youtube.com/sgma';
    socialLinks[2].href = 'https://tiktok.com/@sgma';
    socialLinks[3].href = 'https://instagram.com/sgma';
}

// Resend code functionality (optional)
function createResendLink() {
    const container = document.querySelector('.verification-container');
    const resendDiv = document.createElement('div');
    resendDiv.className = 'resend-container';
    resendDiv.style.cssText = `
        text-align: center;
        margin-top: 30px;
    `;
    
    const resendText = document.createElement('p');
    resendText.style.cssText = `
        color: white;
        font-size: 14px;
        margin-bottom: 10px;
    `;
    resendText.textContent = '¿No recibiste el código?';
    
    const resendBtn = document.createElement('button');
    resendBtn.type = 'button';
    resendBtn.className = 'resend-btn';
    resendBtn.textContent = 'Reenviar código';
    resendBtn.style.cssText = `
        background: none;
        border: 2px solid #00d084;
        color: #00d084;
        padding: 10px 30px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
    `;
    
    resendBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#00d084';
        this.style.color = 'white';
    });
    
    resendBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
        this.style.color = '#00d084';
    });
    
    resendBtn.addEventListener('click', function() {
        showMessage('Código reenviado exitosamente. Revisa tu correo electrónico.', 'success');
        console.log('Código reenviado');
        clearForm();
    });
    
    resendDiv.appendChild(resendText);
    resendDiv.appendChild(resendBtn);
    container.appendChild(resendDiv);
}

// Create resend link on page load
createResendLink();

// Auto-submit when all fields are filled (optional)
function enableAutoSubmit() {
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (index === codeInputs.length - 1 && input.value) {
                // All fields filled, auto-submit after short delay
                setTimeout(() => {
                    if (Array.from(codeInputs).every(inp => inp.value.length === 1)) {
                        verificationForm.dispatchEvent(new Event('submit'));
                    }
                }, 300);
            }
        });
    });
}

// Uncomment to enable auto-submit
// enableAutoSubmit();