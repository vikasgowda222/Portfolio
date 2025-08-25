// Particle System for Background Effects
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.maxParticles = 100;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = {
            element: document.createElement('div'),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            life: Math.random() * 1000 + 2000
        };
        
        particle.element.className = 'particle';
        particle.element.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: rgba(20, 184, 166, ${particle.opacity});
            border-radius: 50%;
            box-shadow: 0 0 ${particle.size * 2}px rgba(20, 184, 166, 0.5);
            pointer-events: none;
            z-index: 1;
        `;
        
        // Random color variations
        const colors = [
            'rgba(20, 184, 166, ' + (particle.opacity * 0.8) + ')', // Teal
            'rgba(59, 130, 246, ' + (particle.opacity * 0.7) + ')', // Blue
            'rgba(249, 115, 22, ' + (particle.opacity * 0.6) + ')' // Orange
        ];
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.element.style.background = randomColor;
        particle.element.style.boxShadow = `0 0 ${particle.size * 3}px ${randomColor}`;
        
        this.container.appendChild(particle.element);
        this.particles.push(particle);
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.y < 0) particle.y = window.innerHeight;
        if (particle.y > window.innerHeight) particle.y = 0;
        
        // Update position
        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
        
        // Fade out as life decreases
        const lifeRatio = particle.life / 2000;
        particle.element.style.opacity = particle.opacity * Math.max(0, lifeRatio);
        
        // Remove dead particles
        if (particle.life <= 0) {
            particle.element.remove();
            const index = this.particles.indexOf(particle);
            this.particles.splice(index, 1);
            this.createParticle(); // Create new particle to replace it
        }
    }
    
    animate() {
        this.particles.forEach(particle => this.updateParticle(particle));
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles.forEach(particle => particle.element.remove());
        this.particles = [];
    }
}

// Neural Network Animation
class NeuralNetwork {
    constructor(container) {
        this.container = container;
        this.svg = null;
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createSVG();
        this.generateNetwork();
        this.animate();
    }
    
    createSVG() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
        `;
        this.container.appendChild(this.svg);
    }
    
    generateNetwork() {
        const nodeCount = 20;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            const node = {
                id: i,
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                element: document.createElementNS('http://www.w3.org/2000/svg', 'circle')
            };
            
            node.element.setAttribute('cx', node.x);
            node.element.setAttribute('cy', node.y);
            node.element.setAttribute('r', Math.random() * 3 + 2);
            node.element.setAttribute('fill', 'rgba(20, 184, 166, 0.6)');
            node.element.setAttribute('class', 'neural-node');
            
            this.svg.appendChild(node.element);
            this.nodes.push(node);
        }
        
        // Create connections between nearby nodes
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const node1 = this.nodes[i];
                const node2 = this.nodes[j];
                const distance = Math.sqrt(
                    Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
                );
                
                if (distance < 150) {
                    const connection = {
                        node1: node1,
                        node2: node2,
                        element: document.createElementNS('http://www.w3.org/2000/svg', 'line')
                    };
                    
                    connection.element.setAttribute('x1', node1.x);
                    connection.element.setAttribute('y1', node1.y);
                    connection.element.setAttribute('x2', node2.x);
                    connection.element.setAttribute('y2', node2.y);
                    connection.element.setAttribute('stroke', 'rgba(59, 130, 246, 0.2)');
                    connection.element.setAttribute('stroke-width', '1');
                    connection.element.setAttribute('class', 'neural-connection');
                    
                    this.svg.appendChild(connection.element);
                    this.connections.push(connection);
                }
            }
        }
    }
    
    updateNetwork() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update nodes
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x <= 0 || node.x >= width) node.vx *= -1;
            if (node.y <= 0 || node.y >= height) node.vy *= -1;
            
            // Keep within bounds
            node.x = Math.max(0, Math.min(width, node.x));
            node.y = Math.max(0, Math.min(height, node.y));
            
            node.element.setAttribute('cx', node.x);
            node.element.setAttribute('cy', node.y);
        });
        
        // Update connections
        this.connections.forEach(connection => {
            connection.element.setAttribute('x1', connection.node1.x);
            connection.element.setAttribute('y1', connection.node1.y);
            connection.element.setAttribute('x2', connection.node2.x);
            connection.element.setAttribute('y2', connection.node2.y);
        });
    }
    
    animate() {
        this.updateNetwork();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.svg) {
            this.svg.remove();
        }
        this.nodes = [];
        this.connections = [];
    }
}

// Matrix Rain Effect
class MatrixRain {
    constructor(container) {
        this.container = container;
        this.columns = [];
        this.animationId = null;
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        this.init();
    }
    
    init() {
        this.createColumns();
        this.animate();
    }
    
    createColumns() {
        const columnWidth = 20;
        const columnCount = Math.floor(window.innerWidth / columnWidth);
        
        for (let i = 0; i < columnCount; i++) {
            this.createColumn(i * columnWidth);
        }
    }
    
    createColumn(x) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = x + 'px';
        column.style.animationDuration = (Math.random() * 3 + 2) + 's';
        column.style.animationDelay = Math.random() * 2 + 's';
        
        // Fill column with random characters
        let text = '';
        const charCount = Math.floor(window.innerHeight / 14) + 10;
        for (let i = 0; i < charCount; i++) {
            text += this.characters.charAt(Math.floor(Math.random() * this.characters.length)) + '<br>';
        }
        column.innerHTML = text;
        
        this.container.appendChild(column);
        this.columns.push(column);
    }
    
    animate() {
        // Randomly update characters
        this.columns.forEach(column => {
            if (Math.random() < 0.1) {
                const lines = column.innerHTML.split('<br>');
                const randomLineIndex = Math.floor(Math.random() * lines.length);
                if (lines[randomLineIndex]) {
                    lines[randomLineIndex] = this.characters.charAt(
                        Math.floor(Math.random() * this.characters.length)
                    );
                    column.innerHTML = lines.join('<br>');
                }
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.columns.forEach(column => column.remove());
        this.columns = [];
    }
}

// Stars Animation
class StarField {
    constructor(container) {
        this.container = container;
        this.stars = [];
        this.maxStars = 150;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createStars();
        this.animate();
    }
    
    createStars() {
        for (let i = 0; i < this.maxStars; i++) {
            this.createStar();
        }
    }
    
    createStar() {
        const star = {
            element: document.createElement('div'),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.01
        };
        
        star.element.style.cssText = `
            position: absolute;
            width: ${star.size}px;
            height: ${star.size}px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            box-shadow: 0 0 ${star.size * 3}px rgba(255, 255, 255, 0.4);
            pointer-events: none;
            z-index: 1;
        `;
        
        star.element.style.left = star.x + 'px';
        star.element.style.top = star.y + 'px';
        star.element.style.opacity = star.opacity;
        
        this.container.appendChild(star.element);
        this.stars.push(star);
    }
    
    updateStars() {
        this.stars.forEach(star => {
            // Twinkling effect
            star.opacity += (Math.random() - 0.5) * star.twinkleSpeed;
            star.opacity = Math.max(0.1, Math.min(1, star.opacity));
            star.element.style.opacity = star.opacity;
        });
    }
    
    animate() {
        this.updateStars();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.stars.forEach(star => star.element.remove());
        this.stars = [];
    }
}

// Export for use in other files
window.ParticleSystem = ParticleSystem;
window.NeuralNetwork = NeuralNetwork;
window.MatrixRain = MatrixRain;
window.StarField = StarField;