// Main Application Controller
class PortfolioApp {
    constructor() {
        this.particles = null;
        this.neuralNetwork = null;
        this.starField = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.waitForDOMReady();
            this.setupBackgroundEffects();
            this.setupResponsiveHandlers();
            this.setupPerformanceOptimizations();
            this.setupAccessibility();
            this.isInitialized = true;
            
            console.log('🚀 Portfolio application initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize portfolio application:', error);
        }
    }
    
    waitForDOMReady() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    setupBackgroundEffects() {
        // Initialize star field
        const starsContainer = document.getElementById('starsContainer');
        if (starsContainer && window.StarField) {
            this.starField = new StarField(starsContainer);
        }
        
        // Initialize neural network
        const neuralNetwork = document.getElementById('neuralNetwork');
        if (neuralNetwork && window.NeuralNetwork) {
            this.neuralNetwork = new NeuralNetwork(neuralNetwork);
        }
        
        // Initialize particle system for other sections
        this.initializeSectionParticles();
    }
    
    initializeSectionParticles() {
        // Add subtle particle effects to sections
        const sections = document.querySelectorAll('section:not(#home)');
        
        sections.forEach(section => {
            if (Math.random() > 0.5) { // Random distribution
                const particleContainer = document.createElement('div');
                particleContainer.className = 'particle-field';
                section.appendChild(particleContainer);
                
                // Lighter particle system for sections
                if (window.ParticleSystem) {
                    new ParticleSystem(particleContainer);
                }
            }
        });
    }
    
    setupResponsiveHandlers() {
        let resizeTimeout;
        
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResponsiveChanges();
            }, 250);
        };
        
        window.addEventListener('resize', handleResize, { passive: true });
        
        // Initial responsive setup
        this.handleResponsiveChanges();
    }
    
    handleResponsiveChanges() {
        const width = window.innerWidth;
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1024;
        const isDesktop = width >= 1024;
        
        // Update CSS custom properties for responsive scaling
        document.documentElement.style.setProperty(
            '--responsive-scale',
            isMobile ? '0.8' : isTablet ? '0.9' : '1'
        );
        
        // Adjust particle counts based on device performance
        this.adjustPerformanceSettings(isMobile, isTablet);
        
        // Update navigation behavior
        this.updateNavigationBehavior(isMobile);
    }
    
    adjustPerformanceSettings(isMobile, isTablet) {
        const performanceLevel = isMobile ? 'low' : isTablet ? 'medium' : 'high';
        
        // Adjust animation performance
        document.documentElement.setAttribute('data-performance', performanceLevel);
        
        // Disable heavy effects on mobile
        if (isMobile) {
            const heavyEffects = document.querySelectorAll('.particle-field, .neural-network');
            heavyEffects.forEach(effect => {
                effect.style.display = 'none';
            });
        }
    }
    
    updateNavigationBehavior(isMobile) {
        const nav = document.querySelector('.nav-container');
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (isMobile) {
            // Mobile navigation behavior
            nav.classList.add('mobile');
            
            // Close navigation when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        } else {
            nav.classList.remove('mobile');
        }
    }
    
    setupPerformanceOptimizations() {
        // Lazy loading for sections
        this.setupLazyLoading();
        
        // Throttle scroll events
        this.setupScrollThrottling();
        
        // Optimize animations based on user preferences
        this.setupAnimationOptimizations();
        
        // Setup intersection observers for performance
        this.setupPerformanceObservers();
    }
    
    setupLazyLoading() {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const src = element.getAttribute('data-lazy');
                        
                        if (src) {
                            element.src = src;
                            element.removeAttribute('data-lazy');
                        }
                        
                        lazyObserver.unobserve(element);
                    }
                });
            });
            
            lazyElements.forEach(element => {
                lazyObserver.observe(element);
            });
        }
    }
    
    setupScrollThrottling() {
        let ticking = false;
        let lastScrollY = 0;
        
        const throttledScroll = () => {
            const scrollY = window.scrollY;
            const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
            
            // Update scroll direction
            document.documentElement.setAttribute('data-scroll-direction', scrollDirection);
            
            // Performance optimizations based on scroll speed
            const scrollSpeed = Math.abs(scrollY - lastScrollY);
            if (scrollSpeed > 10) {
                document.documentElement.classList.add('fast-scroll');
            } else {
                document.documentElement.classList.remove('fast-scroll');
            }
            
            lastScrollY = scrollY;
            ticking = false;
        };
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(throttledScroll);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    setupAnimationOptimizations() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = (mediaQuery) => {
            if (mediaQuery.matches) {
                document.documentElement.classList.add('reduce-motion');
                this.disableHeavyAnimations();
            } else {
                document.documentElement.classList.remove('reduce-motion');
                this.enableAnimations();
            }
        };
        
        prefersReducedMotion.addEventListener('change', handleReducedMotion);
        handleReducedMotion(prefersReducedMotion);
    }
    
    setupPerformanceObservers() {
        // Monitor frame rate and adjust accordingly
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitorFrameRate = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Adjust performance based on FPS
                if (fps < 30) {
                    this.reducePerfomance();
                } else if (fps > 50) {
                    this.increasePerfomance();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitorFrameRate);
        };
        
        requestAnimationFrame(monitorFrameRate);
    }
    
    reducePerfomance() {
        document.documentElement.classList.add('low-performance');
        
        // Reduce particle counts
        if (this.particles) {
            this.particles.maxParticles = Math.max(20, this.particles.maxParticles * 0.5);
        }
        
        // Disable heavy effects
        const heavyEffects = document.querySelectorAll('.holographic, .plasma, .liquid');
        heavyEffects.forEach(effect => {
            effect.style.animation = 'none';
        });
    }
    
    increasePerfomance() {
        document.documentElement.classList.remove('low-performance');
        
        // Allow normal performance
        const effects = document.querySelectorAll('.holographic, .plasma, .liquid');
        effects.forEach(effect => {
            effect.style.animation = '';
        });
    }
    
    disableHeavyAnimations() {
        // Disable resource-intensive animations
        const heavyAnimations = document.querySelectorAll(
            '.rotate-globe, .neural-network, .particle-field, .holographic'
        );
        
        heavyAnimations.forEach(element => {
            element.style.animation = 'none';
        });
    }
    
    enableAnimations() {
        // Re-enable animations
        const elements = document.querySelectorAll('[style*="animation: none"]');
        elements.forEach(element => {
            element.style.animation = '';
        });
    }
    
    setupAccessibility() {
        // Keyboard navigation improvements
        this.setupKeyboardNavigation();
        
        // Focus management
        this.setupFocusManagement();
        
        // ARIA updates
        this.setupARIAUpdates();
        
        // Screen reader optimizations
        this.setupScreenReaderOptimizations();
    }
    
    setupKeyboardNavigation() {
        // Tab navigation for interactive elements
        const interactiveElements = document.querySelectorAll(
            'button, a, input, textarea, .project-cube, .skill-planet, .cert-badge'
        );
        
        interactiveElements.forEach((element, index) => {
            element.setAttribute('tabindex', index === 0 ? '0' : '-1');
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
                
                // Arrow key navigation for grid elements
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    this.handleArrowKeyNavigation(e, element, interactiveElements);
                }
            });
        });
    }
    
    handleArrowKeyNavigation(event, currentElement, allElements) {
        event.preventDefault();
        
        const currentIndex = Array.from(allElements).indexOf(currentElement);
        let nextIndex;
        
        switch (event.key) {
            case 'ArrowUp':
                nextIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowDown':
                nextIndex = Math.min(allElements.length - 1, currentIndex + 1);
                break;
            case 'ArrowLeft':
                nextIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowRight':
                nextIndex = Math.min(allElements.length - 1, currentIndex + 1);
                break;
            default:
                return;
        }
        
        allElements[nextIndex].focus();
    }
    
    setupFocusManagement() {
        // Focus trap for modals
        const modal = document.getElementById('projectModal');
        
        if (modal) {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.trapFocus(e, modal);
                }
            });
        }
        
        // Focus restoration
        let lastFocusedElement = null;
        
        document.addEventListener('focusin', (e) => {
            lastFocusedElement = e.target;
        });
        
        // Restore focus when modal closes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('modal') && !target.classList.contains('active')) {
                        if (lastFocusedElement) {
                            lastFocusedElement.focus();
                        }
                    }
                }
            });
        });
        
        if (modal) {
            observer.observe(modal, { attributes: true });
        }
    }
    
    trapFocus(event, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    }
    
    setupARIAUpdates() {
        // Update ARIA labels and descriptions dynamically
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const heading = section.querySelector('h2');
            if (heading) {
                section.setAttribute('aria-labelledby', heading.id || `heading-${Math.random().toString(36).substr(2, 9)}`);
            }
        });
        
        // Update progress indicators
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const progress = bar.style.width;
            bar.setAttribute('aria-valuenow', progress.replace('%', ''));
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', '100');
            bar.setAttribute('role', 'progressbar');
        });
    }
    
    setupScreenReaderOptimizations() {
        // Live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
        
        // Announce section changes
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.getAttribute('aria-label') || 
                                       entry.target.querySelector('h2')?.textContent || 
                                       'Section';
                    
                    liveRegion.textContent = `Entered ${sectionName} section`;
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('section').forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    destroy() {
        // Clean up resources
        if (this.particles) {
            this.particles.destroy();
        }
        
        if (this.neuralNetwork) {
            this.neuralNetwork.destroy();
        }
        
        if (this.starField) {
            this.starField.destroy();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
        
        this.isInitialized = false;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.portfolioApp) {
        if (document.hidden) {
            // Pause heavy animations when page is hidden
            document.documentElement.classList.add('page-hidden');
        } else {
            // Resume animations when page is visible
            document.documentElement.classList.remove('page-hidden');
        }
    }
});

// Export for global access
window.PortfolioApp = PortfolioApp;