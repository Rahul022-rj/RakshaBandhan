// ==========================================
// SCENE 8 - COMPLETE WITH CONTINUOUS MUSIC
// ==========================================

// ==============================
// MUSIC CONTINUITY
// ==============================

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
player.addEventListener("ended", function() {
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

// ==============================
// BACKGROUND STARS
// ==============================

const stars = document.getElementById("stars");

for(let i = 0; i < 90; i++){
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    s.style.animationDelay = Math.random() * 4 + "s";
    stars.appendChild(s);
}

// ==============================
// GOLD SPARKLES
// ==============================

const sparkles = document.getElementById("sparkles");

for(let i = 0; i < 35; i++){
    const sp = document.createElement("div");
    sp.className = "spark";
    sp.style.left = Math.random() * 100 + "vw";
    sp.style.top = Math.random() * 100 + "vh";
    sp.style.animationDelay = Math.random() * 5 + "s";
    sparkles.appendChild(sp);
}

// ==============================
// FLOATING FLOWERS
// ==============================

const flowerLayer = document.getElementById("flowers");
const flowerEmoji = ["🌼","🌸","🌺","🌻","🌷"];

function createFloatingFlower(){
    const f = document.createElement("div");
    f.className = "floatFlower";
    f.innerHTML = flowerEmoji[Math.floor(Math.random() * flowerEmoji.length)];
    f.style.left = Math.random() * 100 + "vw";
    f.style.bottom = "-30px";
    const size = 18 + Math.random() * 14;
    f.style.fontSize = size + "px";
    f.style.animationDuration = (10 + Math.random() * 8) + "s";
    flowerLayer.appendChild(f);
    setTimeout(() => {
        f.remove();
    }, 18000);
}

for(let i = 0; i < 8; i++){
    setTimeout(createFloatingFlower, i * 800);
}
setInterval(createFloatingFlower, 1800);

// ==============================
// STAGE CONTROLLER
// ==============================

const stage1 = document.getElementById("stage1");
const stage2 = document.getElementById("stage2");
const stage3 = document.getElementById("stage3");
const stage4 = document.getElementById("stage4");
const stage5 = document.getElementById("stage5");
const stage6 = document.getElementById("stage6");

function changeStage(from, to){
    from.classList.remove("active");
    from.classList.add("hidden");
    setTimeout(() => {
        to.classList.remove("hidden");
        to.classList.add("active");
    }, 350);
}

// ==============================
// START BUTTON
// ==============================

document.getElementById("startGame").onclick = () => {
    changeStage(stage1, stage2);
};

// ==============================
// RAKHI GAME
// ==============================

const grid = document.getElementById("rakhiGrid");
const score = document.getElementById("score");
let scoreValue = 0;

const normalRakhis = [
    "../assets/images/rakhi1.png",
    "../assets/images/rakhi2.png",
    "../assets/images/rakhi3.png",
    "../assets/images/rakhi4.png",
    "../assets/images/rakhi5.png",
    "../assets/images/rakhi6.png"
];

const specialRakhi = "../assets/images/rakhiSpecial.png";
const specialIndex = Math.floor(Math.random() * 24);

// Create 24 Rakhi Buttons
for(let i = 0; i < 24; i++){
    const btn = document.createElement("button");
    btn.className = "rakhiBtn";
    const img = document.createElement("img");
    
    if(i === specialIndex){
        img.src = specialRakhi;
        btn.dataset.correct = "true";
    } else {
        img.src = normalRakhis[Math.floor(Math.random() * normalRakhis.length)];
        btn.dataset.correct = "false";
    }
    
    btn.appendChild(img);
    btn.onclick = () => choose(btn);
    grid.appendChild(btn);
}

// Select Rakhi
function choose(card){
    if(card.dataset.correct === "true"){
        scoreValue++;
        score.textContent = scoreValue;
        card.classList.add("correct");
        setTimeout(() => {
            changeStage(stage2, stage3);
            celebration();
        }, 600);
    } else {
        card.animate([
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(-5px)" },
            { transform: "translateX(5px)" },
            { transform: "translateX(0)" }
        ], {
            duration: 350
        });
    }
}

// ==============================
// FLOWER CELEBRATION
// ==============================

const ring = document.getElementById("celebrationRing");
const flowers = ["🌼","🌸","🌺","🌻","🌷"];

function celebration(){
    ring.innerHTML = "";
    const total = 28;
    const radius = 120;
    
    for(let i = 0; i < total; i++){
        const fl = document.createElement("div");
        fl.className = "flower";
        fl.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];
        const angle = (360 / total) * i;
        const x = Math.cos(angle * Math.PI / 180) * radius + 150;
        const y = Math.sin(angle * Math.PI / 180) * radius + 150;
        fl.style.left = x + "px";
        fl.style.top = y + "px";
        fl.style.animationDelay = (i * 0.03) + "s";
        ring.appendChild(fl);
    }
    
    setTimeout(() => {
        changeStage(stage3, stage4);
        setTimeout(() => {
            changeStage(stage4, stage5);
        }, 2200);
    }, 1800);
}

// ==============================
// GIFT OPEN
// ==============================

const giftBox = document.getElementById("giftBox");

giftBox.onclick = () => {
    giftBox.classList.add("open");
    setTimeout(() => {
        changeStage(stage5, stage6);
    }, 650);
};

// ==============================
// CONTINUE - ✅ SAVE MUSIC STATE
// ==============================

document.getElementById("continueBtn").onclick = () => {
    sessionStorage.setItem("selectedSong", current);
    sessionStorage.setItem("songCurrentTime", player.currentTime);
    sessionStorage.setItem("songIsPlaying", isPlaying ? "true" : "false");
    
    document.body.classList.add("pageExit");
    player.pause();
    setTimeout(() => {
        window.location.href = "scene9.html";
    }, 800);
};