// Animation and Scroll Effects
class ScrollAnimationManager {
    constructor() {
        this.observers = [];
        this.animatedElements = new Set();
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupScrollListeners();
        this.animateCounters();
        this.animateProgressBars();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, options);
        
        // Observe all elements with animation attributes
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
        
        this.observers.push(observer);
    }
    
    animateElement(element) {
        const animationType = element.getAttribute('data-aos');
        const delay = element.getAttribute('data-aos-delay') || 0;
        
        setTimeout(() => {
            element.classList.add('aos-animate');
            
            // Special handling for different animation types
            switch (animationType) {
                case 'counter':
                    this.animateCounter(element);
                    break;
                case 'progress':
                    this.animateProgressBar(element);
                    break;
                case 'typing':
                    this.animateTyping(element);
                    break;
            }
        }, delay);
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count') || '0');
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(target * easeOut);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    animateProgressBar(element) {
        const progress = element.getAttribute('data-progress');
        const progressFill = element.querySelector('.progress-fill');
        
        if (progressFill && progress) {
            setTimeout(() => {
                progressFill.style.width = progress + '%';
            }, 300);
        }
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.counter[data-count]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
        
        this.observers.push(counterObserver);
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateProgressBar(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
        
        this.observers.push(progressObserver);
    }
    
    setupScrollListeners() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    updateScrollAnimations() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Parallax effects
        this.updateParallax(scrollY);
        
        // Navigation background
        this.updateNavigation(scrollY);
        
        // Floating elements
        this.updateFloatingElements(scrollY);
    }
    
    updateParallax(scrollY) {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Holographic globe parallax
        const globe = document.getElementById('holographicGlobe');
        if (globe) {
            const globeSpeed = 0.3;
            const rotation = scrollY * 0.2;
            globe.style.transform = `translateY(${-50 + scrollY * globeSpeed}%) rotate(${rotation}deg)`;
        }
    }
    
    updateNavigation(scrollY) {
        const nav = document.querySelector('.nav-container');
        if (nav) {
            if (scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    }
    
    updateFloatingElements(scrollY) {
        const floatingElements = document.querySelectorAll('.floating');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = Math.sin(scrollY * 0.01 + index) * 10;
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.animatedElements.clear();
    }
}

// Typing Animation
class TypewriterEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            speed: 50,
            delay: 1000,
            cursor: '|',
            loop: false,
            ...options
        };
        
        this.text = this.element.textContent;
        this.element.textContent = '';
        this.currentIndex = 0;
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        setTimeout(() => {
            this.startTyping();
        }, this.options.delay);
    }
    
    startTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        this.typeNextCharacter();
    }
    
    typeNextCharacter() {
        if (this.currentIndex < this.text.length) {
            this.element.textContent = this.text.substring(0, this.currentIndex + 1);
            this.currentIndex++;
            
            setTimeout(() => {
                this.typeNextCharacter();
            }, this.options.speed + Math.random() * 50);
        } else {
            this.isTyping = false;
            
            if (this.options.loop) {
                setTimeout(() => {
                    this.reset();
                    this.startTyping();
                }, 2000);
            }
        }
    }
    
    reset() {
        this.currentIndex = 0;
        this.element.textContent = '';
    }
}

// Glitch Effect
class GlitchEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            intensity: 1,
            duration: 3000,
            interval: 100,
            ...options
        };
        
        this.originalText = this.element.textContent;
        this.glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.startGlitching();
    }
    
    startGlitching() {
        let elapsed = 0;
        const startTime = Date.now();
        
        const glitch = () => {
            elapsed = Date.now() - startTime;
            
            if (elapsed < this.options.duration) {
                if (Math.random() < 0.1 * this.options.intensity) {
                    this.applyGlitch();
                    
                    setTimeout(() => {
                        this.element.textContent = this.originalText;
                    }, 50);
                }
                
                this.animationId = setTimeout(glitch, this.options.interval);
            }
        };
        
        glitch();
    }
    
    applyGlitch() {
        const text = this.originalText;
        let glitchedText = '';
        
        for (let i = 0; i < text.length; i++) {
            if (Math.random() < 0.1) {
                glitchedText += this.glitchChars.charAt(
                    Math.floor(Math.random() * this.glitchChars.length)
                );
            } else {
                glitchedText += text[i];
            }
        }
        
        this.element.textContent = glitchedText;
    }
    
    stop() {
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
        this.element.textContent = this.originalText;
    }
}

// Magnetic Button Effect
class MagneticButton {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            strength: 20,
            ...options
        };
        
        this.rect = null;
        this.centerX = 0;
        this.centerY = 0;
        
        this.init();
    }
    
    init() {
        this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }
    
    handleMouseEnter() {
        this.rect = this.element.getBoundingClientRect();
        this.centerX = this.rect.left + this.rect.width / 2;
        this.centerY = this.rect.top + this.rect.height / 2;
    }
    
    handleMouseMove(e) {
        const deltaX = e.clientX - this.centerX;
        const deltaY = e.clientY - this.centerY;
        
        const moveX = deltaX * (this.options.strength / 100);
        const moveY = deltaY * (this.options.strength / 100);
        
        this.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    handleMouseLeave() {
        this.element.style.transform = 'translate(0, 0)';
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    window.scrollAnimationManager = new ScrollAnimationManager();
    
    // Initialize typing effect for hero tagline
    const typingText = document.getElementById('typingText');
    if (typingText) {
        new TypewriterEffect(typingText, {
            speed: 80,
            delay: 2000
        });
    }
    
    // Initialize glitch effect for hero name
    const heroName = document.querySelector('.glitch-text');
    if (heroName) {
        new GlitchEffect(heroName, {
            intensity: 0.5,
            duration: 5000,
            interval: 200
        });
    }
    
    // Initialize magnetic buttons
    document.querySelectorAll('.cta-button, .form-submit').forEach(button => {
        new MagneticButton(button);
    });
});

// Export for use in other files
window.ScrollAnimationManager = ScrollAnimationManager;
window.TypewriterEffect = TypewriterEffect;
window.GlitchEffect = GlitchEffect;
window.MagneticButton = MagneticButton;