document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple fade-in animation observer
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply animation classes
    document.querySelectorAll('.feature-card, .pricing-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 100}ms`; // Staggered delay
        observer.observe(el);
    });

    // Modal Logic
    const modal = document.getElementById('waitlist-modal');
    const closeBtn = document.querySelector('.modal-close');
    const form = document.getElementById('waitlist-form');
    const discountMsg = document.getElementById('discount-message');
    const planInput = document.getElementById('selected-plan');
    const navButtons = document.querySelectorAll('.pricing-card .btn-primary, .pricing-card .btn-secondary, .hero-buttons .btn-primary');

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzRTsiP0Ftxj7GxvfJu7bW-GTH2VwjYHWw0HOmCt0dfqHTvWhLiYI9gdngpHG41-ODV/exec';

    const openModal = (e) => {
        if (e) e.preventDefault();

        // Reset state
        discountMsg.classList.remove('visible');

        // Check for plan type & name
        const btn = e.currentTarget;
        const planType = btn.dataset.plan;

        // Try to find the plan name from the card, or default to general interest
        const card = btn.closest('.pricing-card');
        const planName = card ? card.querySelector('h3').textContent : 'Obecný zájem';

        if (planInput) {
            planInput.value = planName;
        }

        // Track click anonymously
        const clickData = new FormData();
        clickData.append('plan', planName);
        clickData.append('email', '-'); // Mark as click only

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: clickData,
            mode: 'no-cors'
        }).catch(err => console.error('Tracking error:', err));

        if (planType === 'paid') {
            discountMsg.classList.add('visible');
        }

        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    // Open modal on pricing clicks and "Start Free"
    navButtons.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.textContent;

        btn.textContent = 'Odesílám...';
        btn.disabled = true;

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: new FormData(form),
            mode: 'no-cors' // Important for Google Apps Script to avoid CORS errors (opacity response)
        })
            .then(() => {
                btn.textContent = 'Děkujeme!';
                form.reset();

                setTimeout(() => {
                    closeModal();
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 2000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                btn.textContent = 'Chyba!';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 3000);
            });
    });

    // Hero Carousel Logic
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        let currentSlide = 0;

        // Ensure first is active if not set
        if (!document.querySelector('.carousel-slide.active')) {
            slides[0].classList.add('active');
        }

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // 5 seconds
    }
});
