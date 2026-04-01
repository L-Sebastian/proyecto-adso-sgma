// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.querySelector('.nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
    } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = 'linear-gradient(135deg, #2c5f7f 0%, #1e4a61 100%)';
        navMenu.style.padding = '20px';
        navMenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    }
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Validate form
    if (!validateContactForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simulate sending message
    setTimeout(() => {
        console.log('Mensaje enviado:', formData);
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showMessage('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.', 'success');
        
        // Reset form
        this.reset();
    }, 1500);
});

// Validate contact form
function validateContactForm(data) {
    if (data.name.length < 3) {
        showMessage('El nombre debe tener al menos 3 caracteres', 'error');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Por favor ingresa un correo electrónico válido', 'error');
        return false;
    }
    
    if (data.subject.length < 3) {
        showMessage('El asunto debe tener al menos 3 caracteres', 'error');
        return false;
    }
    
    if (data.message.length < 10) {
        showMessage('El mensaje debe tener al menos 10 caracteres', 'error');
        return false;
    }
    
    return true;
}

// Show message notification
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

// Event Cards - Like functionality
const eventCards = document.querySelectorAll('.event-card');

eventCards.forEach(card => {
    const likesElement = card.querySelector('.likes');
    let isLiked = false;
    
    card.addEventListener('click', function(e) {
        // Don't toggle like if clicking on certain elements
        if (e.target.closest('.event-header')) {
            return;
        }
        
        if (!isLiked) {
            const currentLikes = parseInt(likesElement.textContent.match(/\d+/)[0]);
            likesElement.textContent = `👍 ${currentLikes + 1}`;
            card.style.borderColor = '#00d084';
            card.style.border = '3px solid #00d084';
            isLiked = true;
        } else {
            const currentLikes = parseInt(likesElement.textContent.match(/\d+/)[0]);
            likesElement.textContent = `👍 ${currentLikes - 1}`;
            card.style.border = 'none';
            isLiked = false;
        }
    });
    
    // Hover effect
    card.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });
});

// Community Buttons - Registration handlers
const btnRegister = document.querySelector('.btn-register');
const btnProducer = document.querySelector('.btn-producer');

btnRegister.addEventListener('click', function() {
    showMessage('Redirigiendo al registro de clientes...', 'success');
    setTimeout(() => {
        console.log('Navegando a: registro-cliente.html');
        // window.location.href = 'registro-cliente.html';
    }, 1000);
});

btnProducer.addEventListener('click', function() {
    showMessage('Redirigiendo al registro de productores...', 'success');
    setTimeout(() => {
        console.log('Navegando a: registro-productor.html');
        // window.location.href = 'registro-productor.html';
    }, 1000);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navMenu.style.display = 'none';
            }
        }
    });
});

// Social media links configuration
const socialLinks = document.querySelectorAll('.social-links a');
if (socialLinks.length >= 4) {
    socialLinks[0].href = 'https://facebook.com/sgma';
    socialLinks[1].href = 'https://instagram.com/sgma';
    socialLinks[2].href = 'https://tiktok.com/@sgma';
    socialLinks[3].href = 'https://youtube.com/sgma';
}

// Iniciar Sesión button handler
const btnIniciarSesion = document.querySelector('.btn-ingresar');
if (btnIniciarSesion) {
    btnIniciarSesion.addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('Redirigiendo al inicio de sesión...', 'success');
        setTimeout(() => {
            console.log('Navegando a: login.html');
            // window.location.href = 'login.html';
        }, 1000);
    });
}

// Form input animations
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateX(5px)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateX(0)';
    });
});

// Intersection Observer for animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe event cards for animation
eventCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Window resize handler for responsive menu
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'row';
        navMenu.style.position = 'static';
        navMenu.style.padding = '0';
        navMenu.style.boxShadow = 'none';
    } else {
        navMenu.style.display = 'none';
    }
});

// Add loading animation to images
const eventImages = document.querySelectorAll('.event-image img');

eventImages.forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
});

// Parallax effect for community section
window.addEventListener('scroll', function() {
    const communitySection = document.querySelector('.community-section');
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    
    if (communitySection) {
        communitySection.style.backgroundPositionY = rate + 'px';
    }
});

// Add counter animation for event numbers
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Observe event cards for counter animation
const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const numberElement = entry.target.querySelector('.date-number');
            const targetNumber = parseInt(numberElement.textContent);
            animateValue(numberElement, 0, targetNumber, 1000);
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

eventCards.forEach(card => {
    counterObserver.observe(card);
});

// Add click outside handler for mobile menu
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
        if (!e.target.closest('.nav-content')) {
            navMenu.style.display = 'none';
        }
    }
});

// Prevent form submission on Enter key (except in textarea)
contactForm.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Console log for debugging
console.log('SGMA Home Page loaded successfully');
console.log('Total events:', eventCards.length);
console.log('Mobile menu button:', mobileMenuBtn ? 'Found' : 'Not found');