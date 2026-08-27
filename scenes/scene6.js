// ==========================================
// SCENE 6 - COMPLETE WITH CONTINUOUS MUSIC
// ==========================================

// ---------------- MUSIC ----------------

const songs = {
    1: "../assets/music/ashiyan.mp3",
    2: "../assets/music/phoolo.mp3"
};

// Song order for auto-play
const songOrder = ["1", "2"];
let currentIndex = 0;
let current = sessionStorage.getItem("selectedSong") || "1";
currentIndex = songOrder.indexOf(current);
let isPlaying = false;

const player = document.getElementById("player");
const pauseBtn = document.getElementById("pauseBtn");
const musicBtn = document.getElementById("musicBtn");

// ---------- UPDATE VISUAL STATE ----------
function updateVisualState(playing) {
    if (playing) {
        pauseBtn.innerHTML = "⏸";
    } else {
        pauseBtn.innerHTML = "▶";
    }
}

// ---------- PLAY / PAUSE TOGGLE ----------
function togglePlay() {
    if (isPlaying) {
        player.pause();
        isPlaying = false;
        updateVisualState(false);
        sessionStorage.setItem("songIsPlaying", "false");
        sessionStorage.setItem("songCurrentTime", player.currentTime);
    } else {
        if (player.src) {
            player.play()
                .then(() => {
                    isPlaying = true;
                    updateVisualState(true);
                    sessionStorage.setItem("songIsPlaying", "true");
                })
                .catch(err => {
                    console.log("Playback error:", err);
                });
        } else {
            player.src = songs[current];
            player.play()
                .then(() => {
                    isPlaying = true;
                    updateVisualState(true);
                    sessionStorage.setItem("songIsPlaying", "true");
                })
                .catch(err => {
                    console.log("Playback error:", err);
                });
        }
    }
}

// ---------- AUTO-PLAY NEXT SONG ----------
function playNextSong() {
    currentIndex = (currentIndex + 1) % songOrder.length;
    const nextSong = songOrder[currentIndex];
    current = nextSong;

    player.src = songs[nextSong];
    player.play()
        .then(() => {
            isPlaying = true;
            updateVisualState(true);
            sessionStorage.setItem("selectedSong", nextSong);
            sessionStorage.setItem("songCurrentTime", 0);
            sessionStorage.setItem("songIsPlaying", "true");
        })
        .catch(err => {
            console.log("Auto-play error:", err);
        });
}

// ---------- SONG ENDED EVENT ----------
player.addEventListener("ended", function () {
    playNextSong();
});

// ---------- PLAY/PAUSE BUTTON ----------
pauseBtn.addEventListener("click", togglePlay);

// ---------- MUSIC POPUP (placeholder) ----------
musicBtn.addEventListener("click", () => {
    togglePlay();
});

// ---------- LOAD ON PAGE START - RESTORE STATE ----------
window.addEventListener("load", () => {
    const savedSong = sessionStorage.getItem("selectedSong");
    const savedTime = parseFloat(sessionStorage.getItem("songCurrentTime")) || 0;
    const wasPlaying = sessionStorage.getItem("songIsPlaying") === "true";

    if (savedSong && songs[savedSong]) {
        current = savedSong;
        currentIndex = songOrder.indexOf(savedSong);
    }

    player.src = songs[current];

    if (savedTime > 0) {
        player.currentTime = savedTime;
    }

    if (wasPlaying) {
        player.play()
            .then(() => {
                isPlaying = true;
                updateVisualState(true);
            })
            .catch(err => {
                console.log("Playback error:", err);
                isPlaying = false;
                updateVisualState(false);
            });
    } else {
        isPlaying = false;
        updateVisualState(false);
    }
});

// ---------------- STAGES ----------------

const intro = document.getElementById("intro");
const giftStage = document.getElementById("giftStage");
const reward = document.getElementById("reward");
const gift = document.getElementById("giftBox");

// Stage 1 -> Stage 2
setTimeout(() => {
    intro.classList.add("fadeOut");
    setTimeout(() => {
        intro.classList.add("hidden");
        giftStage.classList.remove("hidden");
    }, 700);
}, 2500);

// Tap gift
gift.onclick = () => {
    gift.classList.add("popOpen");
    setTimeout(() => {
        giftStage.classList.add("hidden");
        reward.classList.remove("hidden");
    }, 650);
};

// Continue - ✅ Save music state
document.getElementById("continueBtn").onclick = () => {
    // Save current song, time, and playing state
    sessionStorage.setItem("selectedSong", current);
    sessionStorage.setItem("songCurrentTime", player.currentTime);
    sessionStorage.setItem("songIsPlaying", isPlaying ? "true" : "false");

    document.body.style.opacity = "0";
    setTimeout(() => {
        window.location.href = "scene7.html";
    }, 700);
};

// ---------------- SPARKLES ----------------

const sparkleContainer = document.getElementById("sparkleContainer");

for (let i = 0; i < 45; i++) {
    const s = document.createElement("div");
    s.className = "spark";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    s.style.animationDelay = Math.random() * 4 + "s";
    sparkleContainer.appendChild(s);
}

// ---------------- FLOATING RAKHI ----------------

const rakhiContainer = document.getElementById("rakhiContainer");

function createRakhi() {
    const r = document.createElement("div");
    r.className = "rakhi";
    const size = 24 + Math.random() * 14;
    r.style.width = size + "px";
    r.style.height = size + "px";
    r.style.left = Math.random() * 100 + "vw";
    r.style.bottom = "-40px";
    const duration = 18 + Math.random() * 8;
    r.style.animationDuration = duration + "s";
    rakhiContainer.appendChild(r);
    setTimeout(() => {
        r.remove();
    }, duration * 1000);
}

for (let i = 0; i < 10; i++) {
    setTimeout(createRakhi, i * 800);
}

setInterval(createRakhi, 1500);