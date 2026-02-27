// State Management
let currentSlide = 0;
const totalSlides = 5;
let candlesBlown = 0;
const totalCandles = 3;
let isMusicPlaying = false;

// DOM Elements
const introScreen = document.getElementById('intro-screen');
const storySlider = document.getElementById('story-slider');
const finalSlide = document.getElementById('final-slide');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const slides = document.querySelectorAll('.slide');
const decorateBtn = document.getElementById('decorate-btn');
const balloonsBtn = document.getElementById('balloons-btn');
const cakeBtn = document.getElementById('cake-btn');
const sprinklesBtn = document.getElementById('sprinkles-btn');
const frostingBtn = document.getElementById('frosting-btn');
const cakeContainer = document.getElementById('cake-container');
const cakeInstruction = document.getElementById('cake-instruction');
const finalMessage = document.getElementById('final-message');
const heartsContainer = document.getElementById('hearts-container');

// --- Intro Logic ---
startBtn.addEventListener('click', () => {
    introScreen.classList.remove('active');
    storySlider.classList.add('active');
    
    // Start Music
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicToggle.classList.remove('hidden');
    }).catch(err => console.log("Autoplay blocked, waiting for user interaction"));
    
    startBackgroundAnimations();
});

// --- Slider Logic ---
function updateSlides() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    if (currentSlide === totalSlides - 1) {
        // Transition to final slide after a short delay on the black screen
        setTimeout(() => {
            storySlider.classList.remove('active');
            finalSlide.classList.add('active');
            triggerFireworks(5);
        }, 1500);
    }
}

nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlides();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlides();
    }
});

// --- Music Logic ---
musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
    } else {
        bgMusic.play();
        musicToggle.textContent = '🎵';
    }
    isMusicPlaying = !isMusicPlaying;
});

// --- Background Animations ---
function startBackgroundAnimations() {
    // Floating Hearts
    setInterval(() => {
        createHeart();
    }, 800);

    // Occasional Fireworks
    setInterval(() => {
        if (Math.random() > 0.7) triggerFireworks(1);
    }, 4000);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.setProperty('--duration', (Math.random() * 3 + 4) + 's');
    heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 7000);
}

// --- Final Slide Interactions ---
decorateBtn.addEventListener('click', () => {
    // More hearts
    for(let i=0; i<15; i++) {
        setTimeout(createHeart, i * 100);
    }
    triggerFireworks(3);
    decorateBtn.style.display = 'none';
});

balloonsBtn.addEventListener('click', () => {
    for(let i=0; i<10; i++) {
        setTimeout(createBalloon, i * 200);
    }
    balloonsBtn.style.display = 'none';
});

function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd700', '#87ceeb', '#9b5de5', '#00f5d4'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.backgroundColor = color;
    
    const knot = document.createElement('div');
    knot.className = 'balloon-knot';
    knot.style.backgroundColor = color;
    balloon.appendChild(knot);

    const tie = document.createElement('div');
    tie.className = 'balloon-tie';
    balloon.appendChild(tie);

    // Wavy "snake-like" string
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 20 60");
    svg.setAttribute("class", "balloon-string");
    
    const path = document.createElementNS(svgNS, "path");
    // Wavy path: M(Move) Q(Quadratic Bezier) T(Smooth Quadratic Bezier)
    path.setAttribute("d", "M10 0 Q 15 15 10 30 T 10 60");
    path.setAttribute("stroke", "rgba(255, 255, 255, 0.5)");
    path.setAttribute("stroke-width", "1.5");
    path.setAttribute("fill", "none");
    
    svg.appendChild(path);
    balloon.appendChild(svg);

    balloon.style.left = Math.random() * 100 + 'vw';
    balloon.style.setProperty('--duration', (Math.random() * 4 + 6) + 's');
    balloon.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
    document.body.appendChild(balloon);
    setTimeout(() => balloon.remove(), 11000);
}

cakeBtn.addEventListener('click', () => {
    cakeContainer.classList.remove('hidden');
    cakeInstruction.classList.remove('hidden');
    cakeBtn.style.display = 'none';
    sprinklesBtn.classList.remove('hidden');
    frostingBtn.classList.remove('hidden');
    
    // Show candles one by one
    const candles = document.querySelectorAll('.candle');
    const candleColors = [
        ['#ffeb3b', '#f44336'],
        ['#b3ffab', '#12fff7'],
        ['#ff9a9e', '#fecfef'],
        ['#a1c4fd', '#c2e9fb'],
        ['#f6d365', '#fda085']
    ];

    candles.forEach((candle, i) => {
        // Unique height and striped color for each candle
        const randomHeight = Math.floor(Math.random() * 15) + 35; // 35px to 50px
        const colorPair = candleColors[Math.floor(Math.random() * candleColors.length)];
        
        candle.style.height = randomHeight + 'px';
        candle.style.background = `repeating-linear-gradient(45deg, ${colorPair[0]}, ${colorPair[0]} 5px, ${colorPair[1]} 5px, ${colorPair[1]} 10px)`;

        setTimeout(() => {
            candle.classList.add('visible');
            candle.addEventListener('click', blowCandle, { once: true });
        }, (i + 1) * 600);
    });
});

sprinklesBtn.addEventListener('click', () => {
    addSprinkles();
    sprinklesBtn.style.display = 'none';
    triggerFireworks(2);
});

frostingBtn.addEventListener('click', () => {
    addFrosting();
    frostingBtn.style.display = 'none';
    triggerFireworks(2);
});

function addSprinkles() {
    const cake = document.querySelector('.cake');
    const colors = ['#FF69B4', '#FFD700', '#00BFFF', '#ADFF2F', '#FF4500', '#FF1493', '#00FA9A'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const sprinkle = document.createElement('div');
            sprinkle.className = 'sprinkle';
            sprinkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random horizontal position within the cake area
            sprinkle.style.left = (Math.random() * 80 + 10) + '%';
            // Random vertical "landing" position on the cake
            sprinkle.style.top = (Math.random() * 70 + 10) + '%';
            
            // Animation properties
            sprinkle.style.setProperty('--fall-duration', (Math.random() * 0.5 + 0.5) + 's');
            sprinkle.style.setProperty('--rotation', (Math.random() * 360) + 'deg');
            
            cake.appendChild(sprinkle);
        }, i * 20); // Staggered entry for "falling" effect
    }
}

function addFrosting() {
    const icing = document.querySelector('.icing');
    for (let i = 0; i < 5; i++) {
        const drip = document.createElement('div');
        drip.className = 'frosting-drip';
        drip.style.left = (i * 20 + 10) + '%';
        drip.style.height = (Math.random() * 15 + 10) + 'px';
        icing.appendChild(drip);
        setTimeout(() => drip.classList.add('visible'), i * 100);
    }
}

function blowCandle(e) {
    const candle = e.currentTarget;
    const flame = candle.querySelector('.flame');
    if (flame) {
        flame.remove();
        candle.classList.add('blown');
        
        // Distinct Smoke effect (multiple particles)
        for (let i = 0; i < 6; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-particle';
            // Randomize drift and duration for each particle
            smoke.style.setProperty('--x', (Math.random() * 30 - 15) + 'px');
            smoke.style.setProperty('--x2', (Math.random() * 60 - 30) + 'px');
            smoke.style.setProperty('--d', (Math.random() * 1.5 + 1.5) + 's');
            smoke.style.animationDelay = (i * 0.15) + 's';
            candle.appendChild(smoke);
            
            // Cleanup
            setTimeout(() => smoke.remove(), 4000);
        }
        
        candlesBlown++;
        triggerFireworks(1);

        if (candlesBlown === totalCandles) {
            cakeInstruction.classList.add('hidden');
            startFinalMoment();
        }
    }
}

function startFinalMoment() {
    setTimeout(() => {
        finalMessage.classList.remove('hidden');
        typeWriter("Happy Birthday ❤️\nMay your life be filled with love, dreams and magic ✨", finalMessage);
        
        triggerFireworks(10);
        document.getElementById('bg-glow').style.background = 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.3), transparent 70%)';
        
        // Continuous celebration
        setInterval(() => createHeart(), 300);
        setInterval(() => triggerFireworks(2), 2000);
    }, 1000);
}

function typeWriter(text, element) {
    let i = 0;
    element.innerHTML = "";
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    type();
}

// --- Fireworks Canvas Logic ---
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color, speedMultiplier = 1) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const force = (Math.random() * 6 + 4) * speedMultiplier;
        this.velocity = {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force
        };
        this.alpha = 1;
        this.friction = 0.97;
        this.gravity = 0.12;
        this.size = Math.random() * 3 + 1;
        this.life = 1.0;
        this.decay = Math.random() * 0.015 + 0.01;
        this.isSparkle = Math.random() > 0.8;
    }
    draw() {
        ctx.save();
        // Anime style: very bright, glowing particles
        let currentAlpha = this.alpha;
        if (this.isSparkle) {
            currentAlpha *= (Math.sin(Date.now() * 0.02) * 0.5 + 0.5);
        }
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
}

function triggerFireworks(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.4;
        const hue = Math.random() * 360;
        const color = `hsl(${hue}, 100%, 70%)`;
        
        // Anime style: Layered explosion
        // Inner ring
        for (let j = 0; j < 30; j++) {
            particles.push(new Particle(x, y, color, 0.6));
        }
        // Outer ring
        for (let j = 0; j < 50; j++) {
            particles.push(new Particle(x, y, color, 1.2));
        }
        
        // Central flash
        const flashColor = `hsla(${hue}, 100%, 90%, 0.8)`;
        for (let j = 0; j < 5; j++) {
            const p = new Particle(x, y, '#ffffff', 0.2);
            p.size = 10;
            p.decay = 0.1;
            particles.push(p);
        }
    }
}

function animateFireworks() {
    // Anime style: longer trails by reducing clear alpha
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, i) => {
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        } else {
            p.update();
            p.draw();
        }
    });
    requestAnimationFrame(animateFireworks);
}
animateFireworks();
