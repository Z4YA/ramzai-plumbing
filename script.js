// Ramzai Plumbing - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');

    // ===== NAVBAR SCROLL EFFECT =====
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ===== MOBILE NAVIGATION =====
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animatedElements = [
        '.section-header',
        '.service-card',
        '.feature',
        '.about-image-placeholder',
        '.experience-badge',
        '.about-content',
        '.about-list',
        '.area-item',
        '.testimonial-card',
        '.cta-content',
        '.contact-info',
        '.contact-form-wrapper',
        '.footer-grid > div'
    ];

    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            animationObserver.observe(el);
        });
    });

    // ===== HERO IMAGE FLOAT ANIMATION =====
    const heroImage = document.querySelector('.hero-image-placeholder');
    if (heroImage) {
        setTimeout(() => {
            heroImage.classList.add('animated');
        }, 1500);
    }

    // ===== COUNTER ANIMATION FOR STATS =====
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + (element.dataset.suffix || '');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + (element.dataset.suffix || '');
            }
        };

        updateCounter();
    }

    // Observe stats for counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent.trim();

                    // Skip animation for non-numeric values like "24/7"
                    if (text === '24/7') {
                        return;
                    }

                    const number = parseInt(text.replace(/\D/g, ''));
                    const suffix = text.replace(/[0-9]/g, '');
                    stat.dataset.suffix = suffix;
                    stat.textContent = '0' + suffix;
                    animateCounter(stat, number, 2000);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // ===== PARALLAX EFFECT FOR HERO =====
    let ticking = false;

    function parallaxScroll() {
        const scrolled = window.pageYOffset;
        const heroWave = document.querySelector('.hero-wave svg');
        const heroBg = document.querySelector('.hero-bg');

        if (heroWave && scrolled < window.innerHeight) {
            heroWave.style.transform = `translateY(${scrolled * 0.3}px)`;
        }

        if (heroBg && scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(parallaxScroll);
            ticking = true;
        }
    });

    // ===== MAGNETIC BUTTON EFFECT =====
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-nav');

    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });

    // ===== TILT EFFECT FOR CARDS =====
    const tiltCards = document.querySelectorAll('.service-card, .testimonial-card');

    tiltCards.forEach(card => {
        // Set initial transition for smooth effect
        card.style.transition = 'transform 0.15s ease-out, box-shadow 0.3s ease';

        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ===== TYPING EFFECT FOR HERO (Optional - subtle) =====
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // ===== RIPPLE EFFECT FOR BUTTONS =====
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation keyframes
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyles);

    // ===== SCROLL PROGRESS INDICATOR =====
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);

    const progressStyles = document.createElement('style');
    progressStyles.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(0, 0, 0, 0.1);
            z-index: 10001;
        }
        .scroll-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(progressStyles);

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        document.querySelector('.scroll-progress-bar').style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress);

    // ===== CURSOR GLOW EFFECT =====
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    const cursorStyles = document.createElement('style');
    cursorStyles.textContent = `
        .cursor-glow {
            position: fixed;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(0, 102, 204, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        }
        .cursor-glow.active {
            opacity: 1;
        }
        @media (max-width: 768px) {
            .cursor-glow {
                display: none;
            }
        }
    `;
    document.head.appendChild(cursorStyles);

    let cursorTimeout;
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.classList.add('active');

        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(() => {
            cursorGlow.classList.remove('active');
        }, 1000);
    });

    // ===== SMOOTH REVEAL FOR IMAGES =====
    const imageContainers = document.querySelectorAll('.hero-image-placeholder, .about-image-placeholder');
    imageContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ===== CONTACT FORM HANDLING =====
    if (contactForm) {
        // Add floating label effect
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Client-side validation
            if (!data.name || !data.email || !data.phone) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            const phoneRegex = /^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
            const cleanPhone = data.phone.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showNotification('Please enter a valid Australian phone number.', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Add loading animation
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            submitBtn.disabled = true;

            try {
                // Send to Vercel serverless function
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    showNotification(result.message, 'success');
                    contactForm.reset();
                    // Celebration animation
                    createConfetti();
                } else {
                    showNotification(result.message || 'Something went wrong. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Connection error. Please call us directly at 0400 000 000.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ===== LOADING SPINNER STYLES =====
    const spinnerStyles = document.createElement('style');
    spinnerStyles.textContent = `
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinnerStyles);

    // ===== CONFETTI ANIMATION =====
    function createConfetti() {
        const colors = ['#0066cc', '#ff6b35', '#10b981', '#f59e0b'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }
    }

    const confettiStyles = document.createElement('style');
    confettiStyles.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confettiStyles);

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '!' : 'i'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        const styles = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 400px;
                padding: 1rem 1.5rem;
                border-radius: 0.75rem;
                background: white;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10000;
                animation: notificationSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .notification-success {
                border-left: 4px solid #10b981;
            }
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            .notification-info {
                border-left: 4px solid #0066cc;
            }
            .notification-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
            }
            .notification-success .notification-icon {
                background: #10b981;
                color: white;
            }
            .notification-error .notification-icon {
                background: #ef4444;
                color: white;
            }
            .notification-info .notification-icon {
                background: #0066cc;
                color: white;
            }
            .notification-message {
                flex: 1;
                font-size: 0.95rem;
                color: #374151;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #9ca3af;
                padding: 0;
                line-height: 1;
                transition: color 0.2s ease, transform 0.2s ease;
            }
            .notification-close:hover {
                color: #374151;
                transform: scale(1.1);
            }
            @keyframes notificationSlideIn {
                from {
                    transform: translateX(100%) scale(0.8);
                    opacity: 0;
                }
                to {
                    transform: translateX(0) scale(1);
                    opacity: 1;
                }
            }
            @keyframes notificationSlideOut {
                from {
                    transform: translateX(0) scale(1);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%) scale(0.8);
                    opacity: 0;
                }
            }
        `;

        if (!document.querySelector('#notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        document.body.appendChild(notification);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'notificationSlideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationSlideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ===== ACTIVE NAVIGATION HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();

    const activeLinkStyles = document.createElement('style');
    activeLinkStyles.textContent = `
        .nav-link.active::after {
            width: 100%;
        }
        .navbar.scrolled .nav-link.active {
            color: var(--primary);
        }
    `;
    document.head.appendChild(activeLinkStyles);

    // ===== PHONE NUMBER FORMATTING =====
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            if (value.length >= 4) {
                value = value.slice(0, 4) + ' ' + value.slice(4);
            }
            if (value.length >= 8) {
                value = value.slice(0, 8) + ' ' + value.slice(8);
            }
            e.target.value = value;
        });
    }

    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    const backToTopStyles = document.createElement('style');
    backToTopStyles.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
        }
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .back-to-top:hover {
            background: var(--primary-dark);
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
        }
    `;
    document.head.appendChild(backToTopStyles);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== CONSOLE MESSAGE =====
    console.log('%c Ramzai Plumbing ', 'background: linear-gradient(135deg, #0066cc, #ff6b35); color: white; font-size: 24px; padding: 15px 30px; border-radius: 8px; font-weight: bold;');
    console.log('%c Professional Plumbing Services for Greater Sydney ', 'color: #666; font-size: 14px; padding: 5px;');
});
