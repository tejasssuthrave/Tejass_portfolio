document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Elements
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.querySelector('.scroll-progress');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.querySelector('.back-to-top');
    const heroIllustration = document.querySelector('.hero-illustration');

    // 1. Navbar & Scroll Progress
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + "%";
        }

        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }
    });

    // 2. Mobile Menu Toggle
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // 3. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Reveal on Scroll (Intersection Observer)
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger stats counter if visible
                if (entry.target.id === 'about') {
                    animateCounters();
                }
            }
        });
    }, revealOptions);

    document.querySelectorAll('section, .reveal').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // 5. Stats Counter Animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const duration = 2000; // 2 seconds

        counters.forEach(counter => {
            if (counter.classList.contains('animated')) return;
            counter.classList.add('animated');

            const target = +counter.getAttribute('data-target');
            let startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const currentCount = Math.floor(progress * target);
                
                counter.innerText = currentCount + (progress === 1 ? '+' : '');
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            }

            window.requestAnimationFrame(step);
        });
    }

    // 6. Hero Mouse Parallax
    if (heroIllustration && window.innerWidth > 1024) {
        const heroShapes = document.querySelectorAll('.shape');
        
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const moveX = (clientX - centerX) / 50;
            const moveY = (clientY - centerY) / 50;
            
            heroIllustration.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            const nodes = heroIllustration.querySelectorAll('.server-node');
            nodes.forEach((node, index) => {
                const factor = (index + 1) * 10;
                node.style.transform = `translate(${-moveX * factor / 10}px, ${-moveY * factor / 10}px)`;
            });

            // Animate background shapes
            heroShapes.forEach((shape, index) => {
                const factor = (index + 1) * 20;
                shape.style.transform = `translate(${moveX * factor / 10}px, ${moveY * factor / 10}px)`;
            });
        });
    }

    // 7. Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalContent = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;
            
            // Simulate API Call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            submitBtn.innerHTML = '<span>Message Sent!</span> <i data-lucide="check"></i>';
            submitBtn.style.background = '#10b981';
            lucide.createIcons();
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                lucide.createIcons();
            }, 3000);
        });
    }

    // 8. Back to Top
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
