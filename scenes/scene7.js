// ==========================================
// SCENE 7 - COMPLETE WITH CONTINUOUS MUSIC
// ==========================================

// ==========================
// MUSIC CONTINUITY
// ==========================

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

// ==========================
// MEMORY GAME
// ==========================

const images = [
    "../assets/images/rakhi1.png",
    "../assets/images/rakhi1.png",
    "../assets/images/rakhi2.png",
    "../assets/images/rakhi2.png",
    "../assets/images/rakhi3.png",
    "../assets/images/rakhi3.png"
];

// Shuffle cards
images.sort(() => Math.random() - 0.5);

const grid = document.getElementById("grid");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

// Create Cards
images.forEach(src => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.image = src;

    card.innerHTML = `
        <div class="inner">
            <div class="front">
                <img src="../assets/images/cardBack.png" alt="Card back">
            </div>
            <div class="back">
                <img src="${src}" alt="Rakhi">
            </div>
        </div>
    `;

    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
});

// Flip Logic
function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;
    card.classList.add("flip");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;
    checkMatch();
}

// Match Check
function checkMatch() {
    if (firstCard.dataset.image === secondCard.dataset.image) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedPairs++;

        resetBoard();

        if (matchedPairs === 3) {
            setTimeout(showGiftOverlay, 800);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");
            resetBoard();
        }, 850);
    }
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// ==========================
// GIFT OVERLAY
// ==========================

const giftOverlay = document.getElementById("giftOverlay");
const giftStage = document.getElementById("giftStage");
const giftBox = document.getElementById("giftBox");
const rewardCard = document.getElementById("rewardCard");
const nextBtn = document.getElementById("nextBtn");

function showGiftOverlay() {
    giftOverlay.classList.remove("hidden");
}

// Open Gift
giftBox.onclick = () => {
    giftBox.classList.add("openGift");
    setTimeout(() => {
        giftStage.classList.add("hidden");
        rewardCard.classList.remove("hidden");
    }, 650);
};

// Continue - ✅ Save music state
nextBtn.onclick = () => {
    sessionStorage.setItem("selectedSong", current);
    sessionStorage.setItem("songCurrentTime", player.currentTime);
    sessionStorage.setItem("songIsPlaying", isPlaying ? "true" : "false");

    document.body.classList.add("pageExit");
    setTimeout(() => {
        window.location.href = "scene8.html";
    }, 700);
};

// ==========================
// SPARKLES
// ==========================

const sparkleContainer = document.getElementById("sparkleContainer");

for (let i = 0; i < 45; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = Math.random() * 100 + "vw";
    spark.style.top = Math.random() * 100 + "vh";
    spark.style.animationDelay = Math.random() * 4 + "s";
    sparkleContainer.appendChild(spark);
}

// ==========================
// FLOATING RAKHI
// ==========================

const rakhiContainer = document.getElementById("rakhiContainer");

function createRakhi() {
    const rakhi = document.createElement("div");
    rakhi.className = "rakhi";
    const size = 24 + Math.random() * 16;
    rakhi.style.width = size + "px";
    rakhi.style.height = size + "px";
    rakhi.style.left = Math.random() * 100 + "vw";
    rakhi.style.bottom = "-40px";
    const duration = 18 + Math.random() * 8;
    rakhi.style.animationDuration = duration + "s";
    rakhiContainer.appendChild(rakhi);
    setTimeout(() => {
        rakhi.remove();
    }, duration * 1000);
}

// Initial Floating Rakhis
for (let i = 0; i < 10; i++) {
    setTimeout(createRakhi, i * 800);
}

// Continuous
setInterval(createRakhi, 1500);