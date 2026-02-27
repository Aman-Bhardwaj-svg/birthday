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
const topperBtn = document.getElementById('topper-btn');
const cakeContainer = document.getElementById('cake-container');
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
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd700', '#87ceeb'];
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.left = Math.random() * 100 + 'vw';
    balloon.style.setProperty('--duration', (Math.random() * 4 + 5) + 's');
    balloon.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
    document.body.appendChild(balloon);
    setTimeout(() => balloon.remove(), 9000);
}

cakeBtn.addEventListener('click', () => {
    cakeContainer.classList.remove('hidden');
    cakeBtn.style.display = 'none';
    sprinklesBtn.classList.remove('hidden');
    frostingBtn.classList.remove('hidden');
    topperBtn.classList.remove('hidden');
    
    // Show candles one by one
    const candles = document.querySelectorAll('.candle');
    const candleColors = [
        'linear-gradient(to bottom, #ffeb3b, #f44336)',
        'linear-gradient(to bottom, #b3ffab, #12fff7)',
        'linear-gradient(to bottom, #ff9a9e, #fecfef)',
        'linear-gradient(to bottom, #a1c4fd, #c2e9fb)',
        'linear-gradient(to bottom, #f6d365, #fda085)'
    ];

    candles.forEach((candle, i) => {
        // Unique height and color for each candle
        const randomHeight = Math.floor(Math.random() * 15) + 25; // 25px to 40px
        const randomColor = candleColors[Math.floor(Math.random() * candleColors.length)];
        
        candle.style.height = randomHeight + 'px';
        candle.style.background = randomColor;

        setTimeout(() => {
            candle.classList.add('visible');
            candle.addEventListener('click', blowCandle, { once: true });
        }, (i + 1) * 800);
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

topperBtn.addEventListener('click', () => {
    const topper = document.getElementById('cake-topper');
    topper.classList.remove('hidden');
    setTimeout(() => topper.classList.add('visible'), 10);
    topperBtn.style.display = 'none';
    triggerFireworks(3);
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
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.friction = 0.95;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

function triggerFireworks(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;
        const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        for (let j = 0; j < 30; j++) {
            particles.push(new Particle(x, y, color));
        }
    }
}

function animateFireworks() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
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
