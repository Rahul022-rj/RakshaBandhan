// ============================================
// SCENE 9 - COMPLETE WITH CONTINUOUS MUSIC
// ============================================

// =======================
// MUSIC CONTINUITY
// =======================

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

// =======================
// STARRY BACKGROUND
// =======================

const stars = document.getElementById("stars");

for (let i = 0; i < 90; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.animationDelay = Math.random() * 4 + "s";
    stars.appendChild(star);
}

// =======================
// GOLD SPARKLES
// =======================

const sparkles = document.getElementById("sparkles");

for (let i = 0; i < 35; i++) {
    const s = document.createElement("div");
    s.className = "spark";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    s.style.animationDelay = Math.random() * 5 + "s";
    sparkles.appendChild(s);
}

// =======================
// FLOATING RAKHI
// =======================

const rakhiLayer = document.getElementById("rakhiContainer");

function createRakhi() {
    const r = document.createElement("div");
    r.className = "rakhi";
    r.style.left = Math.random() * 100 + "vw";
    r.style.bottom = "-50px";
    const size = 24 + Math.random() * 16;
    r.style.width = size + "px";
    r.style.height = size + "px";
    const duration = 16 + Math.random() * 8;
    r.style.animationDuration = duration + "s";
    rakhiLayer.appendChild(r);
    setTimeout(() => {
        r.remove();
    }, duration * 1000);
}

for (let i = 0; i < 8; i++) {
    setTimeout(createRakhi, i * 700);
}
setInterval(createRakhi, 1800);

// =======================
// TYPEWRITER LETTER
// =======================

const letterText = `I know I don't say this all the time.

But I got really lucky with you as my sibling.

We've grown up, we've changed, we've fought over nothing.

And through every bit of it, you stayed my person.

So here's your reminder: you'll always have me.`;

const typewriter = document.getElementById("typewriter");
let index = 0;

function type() {
    if (index <= letterText.length) {
        typewriter.innerHTML = letterText.substring(0, index) + '<span class="cursor"></span>';
        index++;
        const speed = letterText[index - 1] === "\n" ? 140 : 38;
        setTimeout(type, speed);
    } else {
        typewriter.innerHTML = letterText;
        // Wait 2.5 sec then open stage 2
        setTimeout(showGiftStage, 2500);
    }
}

setTimeout(type, 700);

// =======================
// STAGE TRANSITION - ✅ SAVE MUSIC STATE
// =======================

const stage1 = document.getElementById("stage1");
const stage2 = document.getElementById("stage2");

function showGiftStage() {
    stage1.classList.remove("active");
    stage1.classList.add("hidden");

    setTimeout(() => {
        stage2.classList.remove("hidden");
        stage2.classList.add("active");
    }, 500);
}

// =======================
// GIFT OPEN - ✅ SAVE MUSIC STATE
// =======================

const giftBox = document.getElementById("giftBox");
const openGift = document.getElementById("openGift");

function goNext() {
    // Save music state before leaving
    sessionStorage.setItem("selectedSong", current);
    sessionStorage.setItem("songCurrentTime", player.currentTime);
    sessionStorage.setItem("songIsPlaying", isPlaying ? "true" : "false");

    document.body.classList.add("pageExit");
    setTimeout(() => {
        window.location.href = "scene10.html";
    }, 800);
}

giftBox.onclick = goNext;
openGift.onclick = goNext;