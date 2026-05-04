document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Logic
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Before/After Image Slider Logic
    const sliderContainer = document.querySelector('.image-comparison');
    const sliderHandle = document.querySelector('.slider-handle');
    const beforeWrapper = document.querySelector('.img-before-wrapper');
    const imgBefore = document.querySelector('.img-before');
    
    if (sliderContainer && sliderHandle && beforeWrapper && imgBefore) {
        let isSliding = false;
        
        // Ensure the inner before image always matches the container width
        const updateBeforeImageWidth = () => {
            imgBefore.style.width = `${sliderContainer.offsetWidth}px`;
        };
        
        window.addEventListener('resize', updateBeforeImageWidth);
        // Initial set
        setTimeout(updateBeforeImageWidth, 100);

        const slide = (e) => {
            if (!isSliding) return;
            
            // Get X coordinate of mouse/touch relative to container
            let clientX;
            if (e.type.includes('mouse')) {
                clientX = e.clientX;
            } else if (e.type.includes('touch')) {
                clientX = e.touches[0].clientX;
            }
            
            const rect = sliderContainer.getBoundingClientRect();
            let x = clientX - rect.left;
            
            // Constrain between 0 and 100%
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            
            const percentage = (x / rect.width) * 100;
            
            // Update positions
            beforeWrapper.style.width = `${percentage}%`;
            sliderHandle.style.left = `${percentage}%`;
        };

        // Mouse Events
        sliderContainer.addEventListener('mousedown', (e) => {
            isSliding = true;
            slide(e);
        });
        
        window.addEventListener('mouseup', () => {
            isSliding = false;
        });
        
        window.addEventListener('mousemove', slide);
        
        // Touch Events
        sliderContainer.addEventListener('touchstart', (e) => {
            isSliding = true;
            slide(e);
            // Prevent scrolling while sliding
            if(e.target === sliderHandle || e.target.closest('.slider-handle')) {
               e.preventDefault(); 
            }
        }, { passive: false });
        
        window.addEventListener('touchend', () => {
            isSliding = false;
        });
        
        window.addEventListener('touchmove', (e) => {
            if(isSliding) {
                slide(e);
                e.preventDefault(); // prevent scroll
            }
        }, { passive: false });
    }

    // 4. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Add a slight delay for the outline for a smooth trailing effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
        
        // Hover effects on links and buttons
        const hoverables = document.querySelectorAll('a, button, .slider-handle, .glass-card');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    }

    // 5. 3D Tilt & Dynamic Spotlight Effect on Glass Cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (!window.matchMedia("(pointer: fine)").matches) return; 
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            // Set variables for the CSS spotlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            // Move spotlight off-screen gently
            card.style.setProperty('--mouse-x', `-1000px`);
            card.style.setProperty('--mouse-y', `-1000px`);
        });
    });

    // 6. Background Parallax Orbs
    const orbs = document.querySelectorAll('.glow-orb');
    if (orbs.length > 0 && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            
            orbs[0].style.transform = `translate(${x * -80}px, ${y * -80}px) scale(1.1)`;
            if(orbs[1]) orbs[1].style.transform = `translate(${x * 120}px, ${y * 120}px) scale(1.1)`;
        });
    }

    // 7. Advanced Word Reveal for Hero Subtitle
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.innerText;
        subtitle.innerHTML = '';
        subtitle.style.opacity = '1'; 
        subtitle.style.transform = 'none';
        subtitle.classList.remove('fade-up');
        
        const words = text.split(' ');
        words.forEach((word, index) => {
            const container = document.createElement('span');
            container.className = 'word-container';
            
            const wordEl = document.createElement('span');
            wordEl.className = 'word';
            wordEl.innerText = word;
            wordEl.style.animationDelay = `${0.4 + (index * 0.04)}s`; // Staggered reveal
            
            container.appendChild(wordEl);
            subtitle.appendChild(container);
        });
    }

    // 8. Elegant Preloader Logic
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // Just a smooth fade out after a tiny delay for an elegant entrance
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 600); 
    }

    // 9. Magnetic Buttons
    const magnets = document.querySelectorAll('.btn, .social-icon');
    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', (e) => {
            if (!window.matchMedia("(pointer: fine)").matches) return;
            const position = magnet.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            // Subtle pull
            magnet.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        magnet.addEventListener('mouseleave', () => {
            magnet.style.transform = `translate(0px, 0px)`;
            // Re-apply hover translateY if it was a social icon or btn
            setTimeout(() => { magnet.style.transform = ''; }, 300);
        });
    });
});
