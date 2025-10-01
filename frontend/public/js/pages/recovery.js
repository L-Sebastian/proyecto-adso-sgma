// Recovery Form Handler
document.getElementById('recoveryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // Validate form
    if (!validateRecoveryForm(email, phone)) {
        return;
    }
    
    // Create recovery request object
    const recoveryData = {
        email,
        phone,
        requestedAt: new Date().toISOString()
    };
    
    // Simulate sending recovery code
    console.log('Solicitud de recuperación:', recoveryData);
    
    // Show success message
    showMessage('Código de recuperación enviado exitosamente. Revisa tu correo electrónico.', 'success');
    
    // Reset form after successful submission
    setTimeout(() => {
        this.reset();
    }, 2000);
});

// Validation function
function validateRecoveryForm(email, phone) {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Por favor ingresa un correo electrónico válido', 'error');
        return false;
    }
    
    // Validate phone number
    const phoneRegex = /^[0-9]{7,10}$/;
    if (!phoneRegex.test(phone)) {
        showMessage('Por favor ingresa un número de teléfono válido (7-10 dígitos)', 'error');
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

// Input animations and effects
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
                } else {
                    this.style.borderColor = '#e74c3c';
                }
            } else if (this.type === 'tel') {
                const phoneRegex = /^[0-9]{7,10}$/;
                if (phoneRegex.test(this.value)) {
                    this.style.borderColor = '#00d084';
                } else {
                    this.style.borderColor = '#e74c3c';
                }
            }
        } else {
            this.style.borderColor = '';
        }
    });
});

// Phone input - only allow numbers
document.getElementById('phone').addEventListener('keypress', function(e) {
    if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
});

// Prevent paste of non-numeric characters in phone field
document.getElementById('phone').addEventListener('paste', function(e) {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const numericText = pastedText.replace(/\D/g, '');
    this.value = numericText;
});

// Social media link configuration
const socialLinks = document.querySelectorAll('.social-icon');
if (socialLinks.length >= 4) {
    socialLinks[0].href = 'https://facebook.com/sgma'; // Facebook
    socialLinks[1].href = 'https://youtube.com/sgma'; // YouTube
    socialLinks[2].href = 'https://tiktok.com/@sgma'; // TikTok
    socialLinks[3].href = 'https://instagram.com/sgma'; // Instagram
}

// Add loading state to submit button
const submitBtn = document.querySelector('.submit-btn');
const originalBtnText = submitBtn.textContent;

function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
    }
}

// Update form submission to show loading state
document.getElementById('recoveryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!validateRecoveryForm(email, phone)) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Simulate API call delay
    setTimeout(() => {
        const recoveryData = {
            email,
            phone,
            requestedAt: new Date().toISOString()
        };
        
        console.log('Solicitud de recuperación:', recoveryData);
        
        // Remove loading state
        setLoadingState(false);
        
        // Show success message
        showMessage('Código de recuperación enviado exitosamente. Revisa tu correo electrónico.', 'success');
        
        // Reset form
        setTimeout(() => {
            this.reset();
            // Reset border colors
            inputs.forEach(input => {
                input.style.borderColor = '';
            });
        }, 2000);
    }, 1500);
});