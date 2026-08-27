// ==========================================
// SCENE 10 - SISTERS' GALLERY
// ==========================================

// ---------- Music ----------
const bgMusic = document.getElementById("bgMusic");
const pauseBtn = document.getElementById("pauseBtn");
const musicBtn = document.getElementById("musicBtn");
const playlistModal = document.getElementById("playlistModal");
const trackItems = document.querySelectorAll(".track-item");

let isPlaying = false;
let currentSong = sessionStorage.getItem("selectedSong") || "1";

const songs = {
    "1": {
        title: "Ashiyan",
        desc: "for my favourite sibling",
        src: "../assets/music/ashiyan.mp3"
    },
    "2": {
        title: "Phoolo Ka Taaro Ka",
        desc: "the one we both know",
        src: "../assets/music/phoolo.mp3"
    }
};

const songOrder = ["1", "2"];
let currentIndex = songOrder.indexOf(currentSong);

function updateVisualState(playing) {
    pauseBtn.innerHTML = playing ? "⏸" : "▶";
}

function togglePlay() {
    if (isPlaying) {
        bgMusic.pause();
        isPlaying = false;
        updateVisualState(false);
        sessionStorage.setItem("songIsPlaying", "false");
        sessionStorage.setItem("songCurrentTime", bgMusic.currentTime);
    } else {
        if (bgMusic.src) {
            bgMusic.play().then(() => {
                isPlaying = true;
                updateVisualState(true);
                sessionStorage.setItem("songIsPlaying", "true");
            }).catch(() => { });
        } else {
            bgMusic.src = songs[currentSong].src;
            bgMusic.play().then(() => {
                isPlaying = true;
                updateVisualState(true);
                sessionStorage.setItem("songIsPlaying", "true");
            }).catch(() => { });
        }
    }
}

function playNextSong() {
    currentIndex = (currentIndex + 1) % songOrder.length;
    const nextSong = songOrder[currentIndex];
    currentSong = nextSong;
    bgMusic.src = songs[nextSong].src;
    bgMusic.play().then(() => {
        isPlaying = true;
        updateVisualState(true);
        sessionStorage.setItem("selectedSong", nextSong);
        sessionStorage.setItem("songCurrentTime", 0);
        sessionStorage.setItem("songIsPlaying", "true");
        trackItems.forEach((t) => {
            t.classList.remove("active");
            if (t.getAttribute("data-src") === songs[nextSong].src) {
                t.classList.add("active");
            }
        });
    }).catch(() => { });
}

bgMusic.addEventListener("ended", playNextSong);
pauseBtn.addEventListener("click", togglePlay);

musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    playlistModal.classList.toggle("active");
});

document.addEventListener("click", (e) => {
    if (!playlistModal.contains(e.target) && e.target !== musicBtn) {
        playlistModal.classList.remove("active");
    }
});

trackItems.forEach((item) => {
    item.onclick = () => {
        trackItems.forEach((t) => t.classList.remove("active"));
        item.classList.add("active");
        const trackSrc = item.getAttribute("data-src");
        currentSong = trackSrc === songs["1"].src ? "1" : "2";
        currentIndex = songOrder.indexOf(currentSong);
        bgMusic.src = trackSrc;
        bgMusic.play().then(() => {
            isPlaying = true;
            pauseBtn.innerHTML = "⏸";
            sessionStorage.setItem("selectedSong", currentSong);
            sessionStorage.setItem("songIsPlaying", "true");
        }).catch(() => { });
    };
});

window.addEventListener("load", () => {
    const savedSong = sessionStorage.getItem("selectedSong");
    const savedTime = parseFloat(sessionStorage.getItem("songCurrentTime")) || 0;
    const wasPlaying = sessionStorage.getItem("songIsPlaying") === "true";
    if (savedSong && songs[savedSong]) {
        currentSong = savedSong;
        currentIndex = songOrder.indexOf(savedSong);
    }
    bgMusic.src = songs[currentSong].src;
    trackItems.forEach((t) => {
        t.classList.remove("active");
        if (t.getAttribute("data-src") === songs[currentSong].src) {
            t.classList.add("active");
        }
    });
    if (savedTime > 0) {
        bgMusic.currentTime = savedTime;
    }
    if (wasPlaying) {
        bgMusic.play().then(() => {
            isPlaying = true;
            updateVisualState(true);
        }).catch(() => {
            isPlaying = false;
            updateVisualState(false);
        });
    } else {
        isPlaying = false;
        updateVisualState(false);
    }
});

// ==========================================
// SISTER CARDS - ONE BY ONE REVEAL
// ==========================================

const cards = document.querySelectorAll('.sister-card');

cards.forEach((card, index) => {
    setTimeout(() => {
        card.classList.add('visible');
    }, 300 + (index * 400));
});

// ==========================================
// FLIP CARD ON CLICK
// ==========================================

cards.forEach(card => {
    card.addEventListener('click', function () {
        cards.forEach(c => c.classList.remove('flipped'));
        this.classList.add('flipped');

        setTimeout(() => {
            this.classList.remove('flipped');
        }, 4000);
    });
});

document.addEventListener('click', function (e) {
    if (!e.target.closest('.sister-card')) {
        cards.forEach(c => c.classList.remove('flipped'));
    }
});

// ==========================================
// BACKGROUND PARTICLES
// ==========================================

const particleContainer = document.getElementById('particles');

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (15 + Math.random() * 20) + 's';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.background = `rgba(255, 215, 0, ${Math.random() * 0.3 + 0.1})`;
    particleContainer.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 30000);
}

for (let i = 0; i < 30; i++) {
    setTimeout(createParticle, i * 500);
}

setInterval(createParticle, 2000);

// ==========================================
// FLOATING HEARTS
// ==========================================

const heartsContainer = document.getElementById('floatingHearts');
const heartEmojis = ['💕', '💖', '💗', '❤️', '💝', '🌸'];

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (16 + Math.random() * 20) + 'px';
    heart.style.animationDuration = (20 + Math.random() * 15) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 35000);
}

for (let i = 0; i < 15; i++) {
    setTimeout(createHeart, i * 600);
}

setInterval(createHeart, 2500);

// ==========================================
// NEXT BUTTON - NAVIGATE TO SCENE 11
// ==========================================

const nextBtn = document.getElementById('nextBtn');
if (nextBtn) {
    nextBtn.onclick = () => {
        sessionStorage.setItem('selectedSong', currentSong);
        sessionStorage.setItem('songCurrentTime', bgMusic.currentTime);
        sessionStorage.setItem('songIsPlaying', isPlaying ? 'true' : 'false');

        document.body.style.transition = 'opacity 0.8s ease';
        document.body.style.opacity = '0';

        setTimeout(() => {
            window.location.href = 'scene11.html';
        }, 800);
    };
}

// ==========================================
// HOME BUTTON
// ==========================================

document.getElementById('homeBtn').onclick = () => {
    sessionStorage.setItem('selectedSong', currentSong);
    sessionStorage.setItem('songCurrentTime', bgMusic.currentTime);
    sessionStorage.setItem('songIsPlaying', isPlaying ? 'true' : 'false');

    document.body.style.transition = 'opacity 0.8s ease';
    document.body.style.opacity = '0';

    setTimeout(() => {
        window.location.href = '../index.html';
    }, 800);
};

// ==========================================
// DYNAMIC STYLES
// ==========================================

const style = document.createElement("style");
style.innerHTML = `
.fairy {
  position: absolute;
  border-radius: 50%;
  background: #FFD76A;
  box-shadow: 0 0 10px #FFD76A;
  animation: glow infinite alternate;
  opacity: .8;
}
@keyframes glow {
  from { transform: scale(.7); opacity: .4; }
  to { transform: scale(1.4); opacity: 1; }
}
.petal {
  position: absolute;
  top: -40px;
  animation: fall linear forwards;
  pointer-events: none;
}
@keyframes fall {
  to { transform: translateY(110vh) rotate(360deg); opacity: .9; }
}
.floatingDownload {
  position: fixed;
  bottom: 25px;
  left: 25px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(10px);
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
  transition: transform 0.3s ease;
  z-index: 100;
}
.floatingDownload:hover {
  transform: scale(1.1);
}
`;
document.head.appendChild(style);