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
    const navButtons = document.querySelectorAll('.pricing-card .btn-primary, .pricing-card .btn-secondary, .hero-buttons .btn-primary');

    const openModal = (e) => {
        if (e) e.preventDefault();

        // Reset state
        discountMsg.classList.remove('visible');

        // Check for plan type
        const btn = e.currentTarget;
        const planType = btn.dataset.plan;

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
        // Exclude "Contact Us" if it should go somewhere else, but for now map all to modal as per request "choosing a plan"
        // Also the hero button "Start Free" points to pricing anchor, but let's intercept it if it's meant to trigger sign up immediately? 
        // The prompt said "Po výběru nějakého z plánů" (After choosing a plan).
        // Let's target buttons inside pricing logic explicitly, plus the hero main CTA if they want.
        // Actually, let's stick to the prompt: plan selection.
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
        const input = form.querySelector('input');
        const btn = form.querySelector('button');
        const originalText = btn.textContent;

        // Simulate API call
        btn.textContent = 'Odesílám...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Děkujeme!';
            input.value = '';

            setTimeout(() => {
                closeModal();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1000);
        }, 1500);
    });
});
