// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
            
            // Transform the hamburger to X
            const spans = this.querySelectorAll('span');
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav.style.display === 'block') {
                    mobileMenuBtn.click();
                }
            }
        });
    });
    
    // Add parallax effect to hero section
    const heroSection = document.getElementById('hero');
    const circles = document.querySelectorAll('.circle');
    
    if (heroSection && circles.length) {
        window.addEventListener('scroll', function() {
            const scrollValue = window.scrollY;
            
            circles.forEach((circle, index) => {
                // Different speeds for each circle
                const speed = (index + 1) * 0.05;
                circle.style.transform = `translateY(${scrollValue * speed}px)`;
            });
        });
    }
    
    // Animate feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (featureCards.length) {
        const animateOnScroll = function() {
            featureCards.forEach(card => {
                const cardPosition = card.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;
                
                if (cardPosition < screenPosition) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });
        };
        
        // Initial styles for animation
        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        // Run on scroll
        window.addEventListener('scroll', animateOnScroll);
        
        // Run once on page load
        animateOnScroll();
    }
    
    // Accordion functionality for mechanics section
    const mechanicsItems = document.querySelectorAll('.mechanics-item');
    
    mechanicsItems.forEach(item => {
        const header = item.querySelector('.mechanics-header');
        
        header.addEventListener('click', () => {
            // Close all other items
            mechanicsItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Open the first item by default
    if (mechanicsItems.length > 0) {
        mechanicsItems[0].classList.add('active');
    }
    
    // Improved infinite scroll marquee
    const benefitsMarquee = document.querySelector('.benefits-marquee');
    const benefitsTrack = document.querySelector('.benefits-track');

    if (benefitsMarquee && benefitsTrack) {
        // Clone cards for true infinite scroll
        function setupInfiniteScroll() {
            // Get all original cards
            const originalCards = Array.from(benefitsTrack.querySelectorAll('.benefit-card'));
            
            // Clone all cards and append them
            originalCards.forEach(card => {
                const clone = card.cloneNode(true);
                benefitsTrack.appendChild(clone);
            });
            
            // Clone the first few cards again for extra buffer
            for (let i = 0; i < Math.min(originalCards.length, 3); i++) {
                const clone = originalCards[i].cloneNode(true);
                benefitsTrack.appendChild(clone);
            }
        }
        
        // Set up infinite scroll on page load
        setupInfiniteScroll();
        
        // Variables
        let scrollPosition = 0;
        let scrollSpeed = 0.4;
        let animationId = null;
        let isPaused = false;
        let isDragging = false;
        let startX = 0;
        let startScrollPosition = 0;
        
        // Get total width of original cards - improved calculation
        function getOriginalCardsWidth() {
            const cards = benefitsTrack.querySelectorAll('.benefit-card');
            const originalCardsCount = Math.floor(cards.length / 2); // Exactly half are original
            let totalWidth = 0;
            
            // Sum up widths of original cards only
            for (let i = 0; i < originalCardsCount; i++) {
                const card = cards[i];
                const style = window.getComputedStyle(card);
                totalWidth += card.offsetWidth + parseInt(style.marginRight);
            }
            
            return totalWidth;
        }
        
        // Animation function with improved reset logic
        function animateScroll() {
            if (!isPaused) {
                scrollPosition -= scrollSpeed;
                
                // Reset position when we've scrolled through all original cards
                const resetThreshold = getOriginalCardsWidth();
                if (Math.abs(scrollPosition) >= resetThreshold) {
                    // Reset position exactly to create perfect loop
                    scrollPosition = scrollPosition + resetThreshold;
                }
                
                // Apply the transform with hardware acceleration
                benefitsTrack.style.transform = `translate3d(${scrollPosition}px, 0, 0)`;
            }
            
            // Continue the animation
            animationId = requestAnimationFrame(animateScroll);
        }
        
        // Start the animation
        function startAnimation() {
            if (!animationId) {
                animationId = requestAnimationFrame(animateScroll);
            }
        }
        
        // Stop the animation
        function stopAnimation() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
        
        // Pause on hover
        benefitsMarquee.addEventListener('mouseenter', () => {
            if (!isDragging) {
                isPaused = true;
            }
        });
        
        benefitsMarquee.addEventListener('mouseleave', () => {
            if (!isDragging) {
                isPaused = false;
            }
        });
        
        // Drag functionality
        benefitsMarquee.addEventListener('mousedown', (e) => {
            isDragging = true;
            isPaused = true;
            startX = e.clientX;
            startScrollPosition = scrollPosition;
            benefitsMarquee.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                benefitsMarquee.style.cursor = 'grab';
                
                // Resume animation if mouse is not over the marquee
                if (!benefitsMarquee.matches(':hover')) {
                    setTimeout(() => {
                        isPaused = false;
                    }, 500);
                }
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX;
                const walk = x - startX;
                
                // Apply drag with bounds checking
                scrollPosition = startScrollPosition + walk;
                
                // Apply the transform with hardware acceleration
                benefitsTrack.style.transform = `translate3d(${scrollPosition}px, 0, 0)`;
            }
        });
        
        // Touch events for mobile
        benefitsMarquee.addEventListener('touchstart', (e) => {
            isDragging = true;
            isPaused = true;
            startX = e.touches[0].clientX;
            startScrollPosition = scrollPosition;
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => {
                    isPaused = false;
                }, 500);
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const x = e.touches[0].clientX;
                const walk = x - startX;
                scrollPosition = startScrollPosition + walk;
                
                // Apply the transform with hardware acceleration
                benefitsTrack.style.transform = `translate3d(${scrollPosition}px, 0, 0)`;
            }
        }, { passive: true });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            // Recalculate dimensions if needed
        });
        
        // Start the animation
        startAnimation();
    }
    
    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Add touch interaction for image marquee
    const marqueeTrack = document.querySelector('.marquee-track');
    
    if (marqueeTrack) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        marqueeTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            marqueeTrack.style.animationPlayState = 'paused';
            startX = e.pageX;
            scrollLeft = marqueeTrack.scrollLeft;
        });
        
        marqueeTrack.addEventListener('mouseleave', () => {
            isDown = false;
            marqueeTrack.style.animationPlayState = 'running';
        });
        
        marqueeTrack.addEventListener('mouseup', () => {
            isDown = false;
            marqueeTrack.style.animationPlayState = 'running';
        });
        
        marqueeTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = (x - startX) * 2;
            marqueeTrack.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        marqueeTrack.addEventListener('touchstart', (e) => {
            isDown = true;
            marqueeTrack.style.animationPlayState = 'paused';
            startX = e.touches[0].pageX;
            scrollLeft = marqueeTrack.scrollLeft;
        }, { passive: true });
        
        marqueeTrack.addEventListener('touchend', () => {
            isDown = false;
            marqueeTrack.style.animationPlayState = 'running';
        });
        
        marqueeTrack.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 2;
            marqueeTrack.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }
});

// Scroll-based header background
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}); 