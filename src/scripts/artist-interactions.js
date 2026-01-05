// Artist Page - Interactive Effects & Animations
// Features: Scroll animations, 3D hover, Micro-interactions, Page transitions, Loading feedback

class ArtistPageInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.showLoadingAnimation();
        this.setupScrollAnimations();
        this.setupScrollProgress();
        this.setup3DHoverEffects();
        this.setupMicroInteractions();
        this.setupLikeButtons();
        this.setupFilterButtons();
        this.setupPageTransitions();
    }

    // Loading Animation with Feedback
    showLoadingAnimation() {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
        `;
        document.body.appendChild(loadingOverlay);

        // Simulate page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 400);
            }, 800);
        });
    }

    // Scroll Animations - Intersection Observer
    setupScrollAnimations() {
        const sections = document.querySelectorAll(
            '.popular-tracks-section, .discography-section, .live-section, .similar-artists-section, .about-artist-section'
        );

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });

        // Parallax effect for hero background
        const heroSection = document.querySelector('.artist-hero');
        const heroBg = document.querySelector('.artist-hero-bg img');
        
        if (heroSection && heroBg) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.3;
                
                if (scrolled < heroSection.offsetHeight) {
                    heroBg.style.transform = `translateY(${rate}px) scale(1.1)`;
                }
            });
        }
    }

    // Scroll Progress Indicator
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        const progressBarFill = progressBar.querySelector('.scroll-progress-bar');

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBarFill.style.width = `${scrolled}%`;
        });
    }

    // 3D Hover Effects with Mouse Tracking
    setup3DHoverEffects() {
        const cards = document.querySelectorAll('.discography-item, .similar-artist-card, .live-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-10px)
                    scale(1.05)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });

        // Artist avatar 3D follow cursor
        const avatar = document.querySelector('.artist-avatar-large');
        if (avatar) {
            const hero = document.querySelector('.artist-hero');
            
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                const rotateY = (x - 0.5) * 20;
                const rotateX = (0.5 - y) * 20;

                avatar.style.transform = `
                    translateY(-10px)
                    rotateY(${rotateY}deg)
                    rotateX(${rotateX}deg)
                `;
            });

            hero.addEventListener('mouseleave', () => {
                avatar.style.transform = 'translateY(0) rotateY(0) rotateX(0)';
            });
        }
    }

    // Micro-interactions
    setupMicroInteractions() {
        // Play buttons with ripple effect
        const playButtons = document.querySelectorAll('.play-icon, .play-btn-large');
        
        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.5)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                ripple.style.pointerEvents = 'none';

                btn.style.position = 'relative';
                btn.style.overflow = 'hidden';
                btn.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Follow buttons toggle effect
        const followButtons = document.querySelectorAll('.follow-btn-large, .follow-small-btn');
        
        followButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.textContent === 'Follow') {
                    this.textContent = 'Following';
                    this.style.background = 'var(--primary-accent)';
                    this.style.color = 'var(--primary-bg)';
                    
                    // Success feedback
                    this.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    this.textContent = 'Follow';
                    this.style.background = 'transparent';
                    this.style.color = 'var(--primary-accent)';
                }
            });
        });

        // Hover sound effect (optional - can be enabled)
        const interactiveElements = document.querySelectorAll('button, .popular-track, .discography-item');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                // Subtle scale feedback
                el.style.transition = 'transform 0.2s ease';
            });
        });

        // Track rank counter animation
        this.animateCounters();
    }

    // Animated counters for stats
    animateCounters() {
        const statItems = document.querySelectorAll('.stat-item h3');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const text = target.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    
                    if (number) {
                        let current = 0;
                        const increment = number / 50;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= number) {
                                target.textContent = text;
                                clearInterval(timer);
                            } else {
                                target.textContent = Math.floor(current) + (text.includes('M') ? 'M+' : '');
                            }
                        }, 30);
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        statItems.forEach(item => observer.observe(item));
    }

    // Like buttons with heart animation
    setupLikeButtons() {
        const likeButtons = document.querySelectorAll('.like-btn');
        
        likeButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                this.classList.toggle('liked');
                
                if (this.classList.contains('liked')) {
                    this.textContent = '❤️';
                    
                    // Create floating hearts
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            this.createFloatingHeart(e.clientX, e.clientY);
                        }, i * 100);
                    }
                } else {
                    this.textContent = '🤍';
                }
            });
        });
    }

    createFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = '20px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '10000';
        heart.style.animation = 'floatHeart 2s ease-out forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 2000);
    }

    // Filter buttons with smooth transition
    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const discographyItems = document.querySelectorAll('.discography-item');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.textContent.toLowerCase();
                
                // Animate items out
                discographyItems.forEach((item, index) => {
                    item.style.animation = 'none';
                    setTimeout(() => {
                        item.style.animation = `zoomIn 0.6s ease-out ${index * 0.1}s forwards`;
                    }, 10);
                });
                
                // Filter logic (if you want to actually filter)
                // You can implement filtering based on data attributes
            });
        });
    }

    // Page transitions
    setupPageTransitions() {
        // Smooth page exit animation
        const links = document.querySelectorAll('a:not([target="_blank"])');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's an anchor link
                if (href && href.startsWith('#')) return;
                
                e.preventDefault();
                
                // Fade out animation
                document.body.style.transition = 'opacity 0.3s ease-out';
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes floatHeart {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ArtistPageInteractions();
    });
} else {
    new ArtistPageInteractions();
}

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
