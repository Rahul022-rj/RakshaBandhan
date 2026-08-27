// ==========================================
// SCENE 5 - COMPLETE WITH CONTINUOUS MUSIC
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
            // Load and play
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

    // Restore playback position
    if (savedTime > 0) {
        player.currentTime = savedTime;
    }

    // Resume if it was playing
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

// ---------------- QUIZ ----------------

const quiz = [

    {
        q: "Who's more dramatic?",
        left: "Me 🫶",
        right: "You 🫶",
        leftRes: "Okay, fair. I'll take that one.",
        rightRes: "Ha! Knew it."
    },

    {
        q: "Who steals whose clothes more?",
        left: "I steal yours",
        right: "You steal mine",
        leftRes: "Guilty as charged. 😅",
        rightRes: "It's still in your cupboard, isn't it."
    },

    {
        q: "Who wins the fights that don't matter?",
        left: "Obviously me",
        right: "Obviously you",
        leftRes: "You let me win. I know.",
        rightRes: "Every single time."
    }

];

let index = 0;

const question = document.getElementById("question");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const response = document.getElementById("response");
const dots = document.querySelectorAll(".progress span");

function loadQuestion() {
    const item = quiz[index];
    question.innerHTML = item.q;
    leftBtn.innerHTML = item.left;
    rightBtn.innerHTML = item.right;
    response.innerHTML = "";
    leftBtn.classList.remove("active");
    rightBtn.classList.remove("active");
    leftBtn.classList.remove("right");
    rightBtn.classList.add("right");
    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
}

const quizCard = document.querySelector(".quizCard");

function choose(side) {
    leftBtn.disabled = true;
    rightBtn.disabled = true;

    if (side === "left") {
        leftBtn.classList.add("active");
        response.textContent = quiz[index].leftRes;
    } else {
        rightBtn.classList.remove("right");
        rightBtn.classList.add("active");
        response.textContent = quiz[index].rightRes;
    }

    // Wait so user can read the response
    setTimeout(() => {
        quizCard.classList.add("switching");

        setTimeout(() => {
            index++;

            if (index < quiz.length) {
                loadQuestion();
                quizCard.classList.remove("switching");
                quizCard.classList.add("show");
                setTimeout(() => {
                    quizCard.classList.remove("show");
                }, 550);
                leftBtn.disabled = false;
                rightBtn.disabled = false;
            } else {
                // ✅ Save music state before leaving
                sessionStorage.setItem("selectedSong", current);
                sessionStorage.setItem("songCurrentTime", player.currentTime);
                sessionStorage.setItem("songIsPlaying", isPlaying ? "true" : "false");

                document.body.classList.add("pageExit");
                setTimeout(() => {
                    window.location.href = "scene6.html";
                }, 700);
            }
        }, 420);
    }, 1000);
}

leftBtn.onclick = () => choose("left");
rightBtn.onclick = () => choose("right");

loadQuestion();

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
    setTimeout(() => r.remove(), duration * 1000);
}

for (let i = 0; i < 10; i++) {
    setTimeout(createRakhi, i * 800);
}

setInterval(createRakhi, 1500);