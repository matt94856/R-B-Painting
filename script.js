// DOM Elements
const header = document.querySelector('header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const form = document.getElementById('contactForm');

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Intersection Observer for Animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Add staggered animation to child elements
                const children = entry.target.querySelectorAll('.service-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('fade-in');
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animate');
        observer.observe(section);
    });
};

// Mobile Menu Toggle with Animation
const toggleMobileMenu = () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        document.body.style.overflow = 'hidden';
    } else {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
        document.body.style.overflow = '';
    }
};

// Enhanced Form Handling
const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    const loadingIcon = '<i class="fas fa-spinner fa-spin"></i>';

    // Validate form
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    if (!isValid) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    try {
        submitButton.disabled = true;
        submitButton.innerHTML = `${loadingIcon} Sending...`;

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clear form
        form.reset();
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    } catch (error) {
        showNotification('Failed to send message. Please try again later.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
};

// Notification System
const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <p>${message}</p>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Enhanced Scroll Handling
const handleScroll = debounce(() => {
    const scrollPosition = window.scrollY;
    
    // Header shadow and background
    if (scrollPosition > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Highlight active section in navigation
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - header.offsetHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const correspondingLink = document.querySelector(`a[href="#${section.id}"]`);
            if (correspondingLink) {
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        }
    });
}, 10);

// Smooth Scroll with Offset
const smoothScroll = (target) => {
    const element = document.querySelector(target);
    if (!element) return;

    const headerOffset = header.offsetHeight;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    observeElements();

    // Mobile menu
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !e.target.closest('nav')) {
            toggleMobileMenu();
        }
    });

    // Form handling
    form.addEventListener('submit', handleFormSubmit);
    
    // Input validation
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.remove('error');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = anchor.getAttribute('href');
            
            smoothScroll(target);

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
});

// Scroll event
window.addEventListener('scroll', handleScroll); 