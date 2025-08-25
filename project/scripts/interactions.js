// Interactive Elements and User Interactions
class InteractionManager {
    constructor() {
        this.projectData = this.getProjectData();
        this.musicPlaying = false;
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupMusicToggle();
        this.setupProjectCubes();
        this.setupSkillPlanets();
        this.setupContactForm();
        this.setupCertificationBadges();
        this.setupScrollIndicator();
        this.setupKeyboardNavigation();
    }
    
    setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
        
        // Smooth scroll for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId.substring(1));
                
                // Close mobile menu
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
                
                // Update active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }
    
    setupMusicToggle() {
        const musicToggle = document.getElementById('musicToggle');
        const backgroundMusic = document.getElementById('backgroundMusic');
        
        if (musicToggle && backgroundMusic) {
            musicToggle.addEventListener('click', () => {
                if (this.musicPlaying) {
                    backgroundMusic.pause();
                    musicToggle.classList.remove('playing');
                    musicToggle.title = 'Play background music';
                } else {
                    backgroundMusic.play();
                    musicToggle.classList.add('playing');
                    musicToggle.title = 'Pause background music';
                }
                this.musicPlaying = !this.musicPlaying;
            });
            
            // Handle autoplay restrictions
            backgroundMusic.addEventListener('canplaythrough', () => {
                musicToggle.style.display = 'flex';
            });
        }
    }
    
    setupProjectCubes() {
        document.querySelectorAll('.project-cube').forEach(cube => {
            cube.addEventListener('click', () => {
                const projectId = cube.getAttribute('data-project');
                this.showProjectModal(projectId);
            });
            
            cube.addEventListener('mouseenter', () => {
                cube.classList.add('hover');
            });
            
            cube.addEventListener('mouseleave', () => {
                cube.classList.remove('hover');
            });
        });
    }
    
    setupSkillPlanets() {
        document.querySelectorAll('.skill-planet').forEach(planet => {
            planet.addEventListener('click', () => {
                const skill = planet.getAttribute('data-skill');
                this.showSkillModal(skill);
            });
            
            planet.addEventListener('mouseenter', () => {
                planet.style.animationPlayState = 'paused';
            });
            
            planet.addEventListener('mouseleave', () => {
                planet.style.animationPlayState = 'running';
            });
        });
    }
    
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                try {
                    await this.submitContactForm(data);
                    this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } catch (error) {
                    this.showNotification('Failed to send message. Please try again.', 'error');
                }
            });
            
            // Add input focus effects
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('focused');
                    }
                });
            });
        }
    }
    
    setupCertificationBadges() {
        document.querySelectorAll('.cert-badge').forEach(badge => {
            badge.addEventListener('click', () => {
                const certId = badge.onclick?.toString().match(/openCertModal\('(.+)'\)/)?.[1];
                if (certId) {
                    this.showCertificationModal(certId);
                }
            });
        });
    }
    
    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                this.scrollToSection('journey');
            });
        }
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC to close modals
            if (e.key === 'Escape') {
                this.closeModal();
            }
            
            // Space to pause/play music
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                const musicToggle = document.getElementById('musicToggle');
                if (musicToggle) {
                    musicToggle.click();
                }
            }
        });
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = document.querySelector('.nav-container').offsetHeight;
            const targetPosition = section.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    showProjectModal(projectId) {
        const project = this.projectData[projectId];
        if (!project) return;
        
        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = project.title;
        modalBody.innerHTML = `
            <div class="project-details">
                <div class="project-header">
                    <div class="project-icon">${project.icon}</div>
                    <div class="project-meta">
                        <h4>${project.title}</h4>
                        <p class="project-description">${project.description}</p>
                    </div>
                </div>
                
                <div class="project-stats">
                    <h5>Key Metrics</h5>
                    <div class="stats-grid">
                        ${project.metrics.map(metric => `
                            <div class="stat-item">
                                <span class="stat-value">${metric.value}</span>
                                <span class="stat-label">${metric.label}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="project-tech">
                    <h5>Technologies Used</h5>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `
                            <span class="tech-tag">${tech}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="project-features">
                    <h5>Key Features</h5>
                    <ul class="features-list">
                        ${project.features.map(feature => `
                            <li>${feature}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="project-links">
                    ${project.githubUrl ? `
                        <a href="${project.githubUrl}" target="_blank" class="project-link github">
                            <span>View on GitHub</span>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                            </svg>
                        </a>
                    ` : ''}
                    ${project.demoUrl ? `
                        <a href="${project.demoUrl}" target="_blank" class="project-link demo">
                            <span>Live Demo</span>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                                <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                            </svg>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    showSkillModal(skillId) {
        const skills = this.getSkillData();
        const skill = skills[skillId];
        if (!skill) return;
        
        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = skill.name;
        modalBody.innerHTML = `
            <div class="skill-details">
                <div class="skill-header">
                    <div class="skill-icon">${skill.icon}</div>
                    <div class="skill-meta">
                        <h4>${skill.name}</h4>
                        <div class="skill-level">
                            <span>Proficiency Level</span>
                            <div class="level-bar">
                                <div class="level-fill" style="width: ${skill.level}%"></div>
                            </div>
                            <span>${skill.level}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="skill-description">
                    <p>${skill.description}</p>
                </div>
                
                <div class="skill-projects">
                    <h5>Used In Projects</h5>
                    <ul>
                        ${skill.projects.map(project => `<li>${project}</li>`).join('')}
                    </ul>
                </div>
                
                ${skill.certification ? `
                    <div class="skill-certification">
                        <h5>Certification</h5>
                        <a href="${skill.certification.url}" target="_blank" class="cert-link">
                            ${skill.certification.name}
                        </a>
                    </div>
                ` : ''}
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    showCertificationModal(certId) {
        const certifications = this.getCertificationData();
        const cert = certifications[certId];
        if (!cert) return;
        
        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = cert.name;
        modalBody.innerHTML = `
            <div class="certification-details">
                <div class="cert-header">
                    <div class="cert-logo">${cert.logo}</div>
                    <div class="cert-meta">
                        <h4>${cert.name}</h4>
                        <p class="cert-issuer">Issued by ${cert.issuer}</p>
                        <p class="cert-date">Completed: ${cert.date}</p>
                    </div>
                </div>
                
                <div class="cert-description">
                    <p>${cert.description}</p>
                </div>
                
                <div class="cert-skills">
                    <h5>Skills Covered</h5>
                    <div class="skills-tags">
                        ${cert.skills.map(skill => `
                            <span class="skill-tag">${skill}</span>
                        `).join('')}
                    </div>
                </div>
                
                ${cert.url ? `
                    <div class="cert-link">
                        <a href="${cert.url}" target="_blank" class="certification-link">
                            View Certificate
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                                <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                            </svg>
                        </a>
                    </div>
                ` : ''}
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const modal = document.getElementById('projectModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    async submitContactForm(data) {
        // Simulate form submission (replace with actual implementation)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate for demo
                    resolve();
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 1000);
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-green)' : 'var(--error-red)'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    downloadResume() {
        // Updated Google Drive resume link
        const resumeUrl = 'https://drive.google.com/file/d/1N10zTG34zcJTmbIJ530kYCVyzUhtjYgP/view?usp=drivesdk';
        window.open(resumeUrl, '_blank');
    }
    
    getProjectData() {
        return {
            'flight-price': {
                title: 'Flight Price Forecasting & Sentiment Classification',
                icon: '✈️',
                description: 'An advanced machine learning application that predicts flight prices and analyzes customer sentiment using sophisticated algorithms.',
                metrics: [
                    { value: 'R² = 0.84', label: 'Prediction Accuracy' },
                    { value: '96%', label: 'Sentiment Accuracy' },
                    { value: '1000+', label: 'Flights Analyzed' },
                    { value: '30ms', label: 'Avg Response Time' }
                ],
                technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Flask', 'React'],
                features: [
                    'Real-time flight price prediction',
                    'Customer sentiment analysis',
                    'Interactive data visualization',
                    'RESTful API integration',
                    'Responsive web interface'
                ],
                githubUrl: 'https://github.com/vikasgowda222/Flight-Price-Forecasting-and-Sentiment-Classification-App',
                demoUrl: null
            },
            'skillforge-ai': {
                title: 'SkillForge AI - Full Stack AI Mock Interview App',
                icon: '🤖',
                description: 'A comprehensive AI-powered mock interview platform that helps users improve their interview skills with personalized feedback.',
                metrics: [
                    { value: '40%', label: 'Score Improvement' },
                    { value: '100+', label: 'Active Users' },
                    { value: '500+', label: 'Interviews Conducted' },
                    { value: '4.8/5', label: 'User Rating' }
                ],
                technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'OpenAI API', 'WebRTC'],
                features: [
                    'AI-powered interview simulation',
                    'Real-time feedback and scoring',
                    'Industry-specific question banks',
                    'Video recording and analysis',
                    'Progress tracking dashboard'
                ],
                githubUrl: 'https://github.com/vikasgowda222/SkillForge-AI-Full-Stack-AI-Mock-Interview-App',
                demoUrl: null
            },
            'data-viz': {
                title: 'AI-Powered Data Visualization Agent',
                icon: '📊',
                description: 'An intelligent data visualization tool that transforms natural language queries into interactive charts and graphs.',
                metrics: [
                    { value: '10+', label: 'Chart Types' },
                    { value: 'NLP', label: 'Powered' },
                    { value: '2s', label: 'Avg Generation Time' },
                    { value: '95%', label: 'Query Accuracy' }
                ],
                technologies: ['Python', 'FastAPI', 'LLM Integration', 'D3.js', 'React', 'Chart.js'],
                features: [
                    'Natural language chart generation',
                    'Multiple visualization types',
                    'Interactive data exploration',
                    'Export capabilities',
                    'Real-time data updates'
                ],
                githubUrl: 'https://github.com/vikasgowda222/ai-powered-data-visualizer',
                demoUrl: null
            },
            'power-management': {
                title: 'AI-Based Intelligent Power Management System',
                icon: '⚡',
                description: 'A smart power management system using computer vision and AI to optimize energy consumption in buildings.',
                metrics: [
                    { value: '25%', label: 'Energy Savings' },
                    { value: 'OpenCV', label: 'Based' },
                    { value: '24/7', label: 'Monitoring' },
                    { value: 'IoT', label: 'Integrated' }
                ],
                technologies: ['Python', 'OpenCV', 'TensorFlow', 'IoT Sensors', 'Flask', 'SQLite'],
                features: [
                    'Computer vision-based occupancy detection',
                    'Automated lighting control',
                    'Energy consumption analytics',
                    'IoT device integration',
                    'Real-time monitoring dashboard'
                ],
                githubUrl: null,
                demoUrl: null
            }
        };
    }
    
    getSkillData() {
        return {
            'python': {
                name: 'Python',
                icon: '🐍',
                level: 95,
                description: 'Advanced Python programming with expertise in data science, machine learning, and web development frameworks.',
                projects: ['Flight Price Forecasting', 'Data Visualization Agent', 'Power Management System'],
                certification: {
                    name: 'Python Pro Bootcamp - Udemy',
                    url: 'https://udemy-certificate.s3.amazonaws.com/pdf/UC-d801af64-cc43-4ef5-a99a-9b6f8acf684a.pdf'
                }
            },
            'machine-learning': {
                name: 'Machine Learning',
                icon: '🧠',
                level: 90,
                description: 'Deep understanding of ML algorithms, model training, and deployment with practical experience in various domains.',
                projects: ['Flight Price Forecasting', 'SkillForge AI', 'Power Management System'],
                certification: {
                    name: 'Data Analysis with Python - IBM',
                    url: 'https://courses.cognitiveclass.ai/certificates/0a318a7ced874c27b6da0706a7fb95ef'
                }
            },
            'tensorflow': {
                name: 'TensorFlow',
                icon: '🔥',
                level: 85,
                description: 'Proficient in building and deploying deep learning models using TensorFlow for various AI applications.',
                projects: ['SkillForge AI', 'Power Management System'],
                certification: null
            },
            'pytorch': {
                name: 'PyTorch',
                icon: '⚡',
                level: 80,
                description: 'Experience with PyTorch for research-oriented deep learning projects and computer vision applications.',
                projects: ['Power Management System'],
                certification: null
            },
            'nodejs': {
                name: 'Node.js',
                icon: '📗',
                level: 88,
                description: 'Full-stack JavaScript development with Node.js, creating scalable backend applications and APIs.',
                projects: ['SkillForge AI'],
                certification: {
                    name: 'Full Stack Certification - OneRoadmap.io',
                    url: 'https://oneroadmap.io/skills/fs/certificate/CERT-FC9656C4'
                }
            },
            'react': {
                name: 'React',
                icon: '⚛️',
                level: 85,
                description: 'Modern React development with hooks, context, and state management for dynamic user interfaces.',
                projects: ['SkillForge AI', 'Data Visualization Agent'],
                certification: null
            },
            'flask': {
                name: 'Flask',
                icon: '🌶️',
                level: 82,
                description: 'Lightweight web framework for building Python APIs and web applications with clean architecture.',
                projects: ['Flight Price Forecasting', 'Data Visualization Agent'],
                certification: null
            },
            'django': {
                name: 'Django',
                icon: '🎸',
                level: 75,
                description: 'Full-featured Python web framework for rapid development of secure and maintainable web applications.',
                projects: [],
                certification: null
            },
            'sql': {
                name: 'SQL',
                icon: '💾',
                level: 90,
                description: 'Advanced database design and query optimization for efficient data storage and retrieval systems.',
                projects: ['SkillForge AI', 'Power Management System'],
                certification: null
            },
            'git': {
                name: 'Git',
                icon: '🌿',
                level: 88,
                description: 'Version control expertise with Git for collaborative development and project management.',
                projects: ['All Projects'],
                certification: null
            }
        };
    }
    
    getCertificationData() {
        return {
            'ibm': {
                name: 'Data Analysis with Python',
                issuer: 'IBM',
                logo: 'IBM',
                date: '2024',
                description: 'Comprehensive course covering Python for data analysis, including pandas, numpy, and visualization libraries.',
                skills: ['Python', 'Pandas', 'NumPy', 'Data Visualization', 'Statistical Analysis'],
                url: 'https://courses.cognitiveclass.ai/certificates/0a318a7ced874c27b6da0706a7fb95ef'
            },
            'google': {
                name: 'Google Analytics Certification',
                issuer: 'Google',
                logo: 'G',
                date: '2024',
                description: 'Professional certification in Google Analytics for web analytics and digital marketing insights.',
                skills: ['Google Analytics', 'Web Analytics', 'Data Analysis', 'Digital Marketing'],
                url: 'https://skillshop.credential.net/4d523ff0-d3b5-4055-b8ec-e75aa90dbcff#acc.Zme7NRjJ'
            },
            'accenture': {
                name: 'Software Engineering Virtual Experience',
                issuer: 'Accenture',
                logo: 'A',
                date: '2024',
                description: 'Virtual internship program covering software engineering best practices and industry standards.',
                skills: ['Software Engineering', 'Agile Development', 'Testing', 'Architecture Design'],
                url: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/xhih9yFWsf6AYfngd/HNpZwZcuYwona2d8Y_xhih9yFWsf6AYfngd_XXuZM7oX7o8WhDDwQ_1752342120005_completion_certificate.pdf'
            },
            'fullstack': {
                name: 'Full Stack Skill Certification',
                issuer: 'OneRoadmap.io',
                logo: 'FS',
                date: '2024',
                description: 'Comprehensive full-stack development certification covering frontend and backend technologies.',
                skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML/CSS'],
                url: 'https://oneroadmap.io/skills/fs/certificate/CERT-FC9656C4'
            },
            'udemy': {
                name: 'Python Pro Bootcamp',
                issuer: 'Udemy',
                logo: 'U',
                date: '2024',
                description: 'Complete Python programming bootcamp covering advanced concepts and practical applications.',
                skills: ['Python', 'Django', 'Flask', 'APIs', 'Data Structures', 'Algorithms'],
                url: 'https://udemy-certificate.s3.amazonaws.com/pdf/UC-d801af64-cc43-4ef5-a99a-9b6f8acf684a.pdf'
            }
        };
    }
}

// Global functions for inline event handlers
window.scrollToSection = function(sectionId) {
    if (window.interactionManager) {
        window.interactionManager.scrollToSection(sectionId);
    }
};

window.downloadResume = function() {
    if (window.interactionManager) {
        window.interactionManager.downloadResume();
    }
};

window.openCertModal = function(certId) {
    if (window.interactionManager) {
        window.interactionManager.showCertificationModal(certId);
    }
};

window.closeModal = function() {
    if (window.interactionManager) {
        window.interactionManager.closeModal();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.interactionManager = new InteractionManager();
});

// Export for use in other files
window.InteractionManager = InteractionManager;