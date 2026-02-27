document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const introScreen = document.getElementById('intro-screen');
    const storyScreen = document.getElementById('story-screen');
    const startBtn = document.getElementById('start-btn');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    const bgMusic = document.getElementById('bg-music');
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const finalControls = document.getElementById('final-controls');
    
    const decorateBtn = document.getElementById('decorate-btn');
    const balloonsBtn = document.getElementById('balloons-btn');
    const cakeBtn = document.getElementById('cake-btn');
    const cakeContainer = document.getElementById('cake-container');
    const candles = document.querySelectorAll('.candle');
    const finalMessage = document.getElementById('final-message');

    let currentSlide = 0;
    let musicPlaying = false;
    let candlesBlown = 0;

    // Canvas Setup
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- 1. Intro Screen Logic ---
    startBtn.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        storyScreen.classList.remove('hidden');
        playMusic();
        startBackgroundAnimations();
    });

    // --- 8. Music Logic ---
    function playMusic() {
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicIcon.textContent = '🎵';
        }).catch(err => console.log("Autoplay blocked or file missing"));
    }

    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            musicIcon.textContent = '🔇';
        } else {
            bgMusic.play();
            musicIcon.textContent = '🎵';
        }
        musicPlaying = !musicPlaying;
    });

    // --- 2. Slider Logic ---
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        // Show final controls only on the last slide
        if (currentSlide === slides.length - 1) {
            finalControls.classList.remove('hidden');
        } else {
            finalControls.classList.add('hidden');
        }
    }

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    });

    // --- 3. Background Animations (Hearts & Particles) ---
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }

    function startBackgroundAnimations() {
        setInterval(createHeart, 800);
        animateParticles();
    }

    // --- 5. Button Interactions ---
    decorateBtn.addEventListener('click', () => {
        // More hearts
        for(let i=0; i<15; i++) {
            setTimeout(createHeart, i * 100);
        }
        // Burst fireworks
        createFireworkBurst();
        // Sparkle effect (handled by canvas or simple divs)
        showSparkles();
    });

    balloonsBtn.addEventListener('click', () => {
        for(let i=0; i<10; i++) {
            setTimeout(createBalloon, i * 200);
        }
    });

    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        const colors = ['#ff75a0', '#ffafbd', '#ffd700', '#ffffff', '#ff4b82'];
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.left = Math.random() * 100 + 'vw';
        balloon.style.animationDuration = (Math.random() * 4 + 4) + 's';
        document.body.appendChild(balloon);
        setTimeout(() => balloon.remove(), 8000);
    }

    cakeBtn.addEventListener('click', () => {
        cakeContainer.style.display = 'block';
        
        // Add dynamic sprinkles
        const cake = document.querySelector('.cake');
        const sprinkleColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];
        
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const sprinkle = document.createElement('div');
                sprinkle.className = 'sprinkle';
                sprinkle.style.backgroundColor = sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)];
                sprinkle.style.left = Math.random() * 100 + '%';
                sprinkle.style.top = Math.random() * 100 + '%';
                sprinkle.style.transform = `rotate(${Math.random() * 360}deg)`;
                cake.appendChild(sprinkle);
            }, i * 20);
        }

        // Show candles one by one with varied pop-up animations
        candles.forEach((candle, index) => {
            setTimeout(() => {
                candle.classList.add(`pop-up-${index + 1}`);
            }, 1500 + (index * 450));
        });
    });

    // --- 6. Candle Interaction ---
    candles.forEach(candle => {
        candle.addEventListener('click', function() {
            const flame = this.querySelector('.flame');
            if (flame && flame.style.display !== 'none') {
                flame.style.display = 'none';
                
                // Smoke animation
                const smoke = document.createElement('div');
                smoke.className = 'smoke';
                this.appendChild(smoke);
                
                // Trigger firework
                createFireworkBurst();
                
                candlesBlown++;
                if (candlesBlown === candles.length) {
                    startFinalMoment();
                }
            }
        });
    });

    // --- 7. Final Moment ---
    function startFinalMoment() {
        // Typing animation
        const text = "Happy Birthday ❤️\nMay your life be filled with love, dreams and magic ✨";
        let i = 0;
        finalMessage.innerHTML = "";
        
        function type() {
            if (i < text.length) {
                finalMessage.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
                i++;
                setTimeout(type, 100);
            } else {
                // Big celebration
                setInterval(createFireworkBurst, 1000);
                document.body.style.background = 'radial-gradient(circle, #ff4b82, #000)';
            }
        }
        
        setTimeout(type, 1000);
    }

    // --- Canvas Fireworks & Particles ---
    let particles = [];
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.alpha -= 0.01;
            
            if (p.alpha <= 0) {
                particles.splice(index, 1);
            } else {
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        requestAnimationFrame(animateParticles);
    }

    function createFireworkBurst() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 2);
        const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: Math.random() * 3 + 1,
                color: color,
                alpha: 1
            });
        }
    }

    function showSparkles() {
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 2,
                color: '#fff',
                alpha: 1
            });
        }
    }
});
