// ==========================================
// SCENE 3 - COMPLETE WITH CONTINUOUS MUSIC
// ==========================================

const player = document.getElementById("player");
const pauseBtn = document.getElementById("pauseBtn");
const musicBtn = document.getElementById("musicBtn");
const playlist = document.getElementById("playlist");
const disc = document.getElementById("disc");

const title = document.getElementById("songTitle");
const desc = document.getElementById("songDesc");

// Song order for auto-play
const songOrder = ["1", "2"];
let currentIndex = 0;

// Get current song from sessionStorage or use first
let current = sessionStorage.getItem("selectedSong") || "1";
currentIndex = songOrder.indexOf(current);

let isPlaying = false;

// Songs
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

// ---------- UPDATE VISUAL STATE ----------
function updateVisualState(playing) {
    if (playing) {
        disc.classList.remove("paused");
        document.querySelector(".equalizer").classList.remove("paused");
        pauseBtn.innerHTML = "⏸";
    } else {
        disc.classList.add("paused");
        document.querySelector(".equalizer").classList.add("paused");
        pauseBtn.innerHTML = "▶";
    }
}

// ---------- LOAD AND PLAY SONG ----------
function loadSong(id, autoPlay = true) {
    current = id;
    currentIndex = songOrder.indexOf(id);
    sessionStorage.setItem("selectedSong", id);

    title.textContent = songs[id].title;
    desc.textContent = songs[id].desc;
    player.src = songs[id].src;

    document.querySelectorAll(".song").forEach(s => {
        s.classList.remove("active");
    });
    document.querySelector(`.song[data-song="${id}"]`).classList.add("active");

    if (autoPlay) {
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
            loadSong(current, true);
        }
    }
}

// ---------- AUTO-PLAY NEXT SONG ----------
function playNextSong() {
    currentIndex = (currentIndex + 1) % songOrder.length;
    const nextSong = songOrder[currentIndex];
    current = nextSong;

    document.querySelectorAll(".song").forEach(s => {
        s.classList.remove("active");
    });
    document.querySelector(`.song[data-song="${nextSong}"]`).classList.add("active");

    title.textContent = songs[nextSong].title;
    desc.textContent = songs[nextSong].desc;

    player.src = songs[nextSong].src;
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

// ---------- PLAY / PAUSE BUTTON ----------
pauseBtn.addEventListener("click", togglePlay);

// ---------- MUSIC POPUP ----------
musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    playlist.classList.toggle("hidden");
});

// ---------- SELECT SONG ----------
document.querySelectorAll(".song").forEach(song => {
    song.addEventListener("click", () => {
        const songId = song.dataset.song;
        currentIndex = songOrder.indexOf(songId);
        loadSong(songId, true);
        playlist.classList.add("hidden");
    });
});

// ---------- NEXT SONG ----------
document.getElementById("nextSong").onclick = () => {
    playNextSong();
};

// ---------- TURN OFF ----------
document.getElementById("turnOff").onclick = () => {
    player.pause();
    isPlaying = false;
    updateVisualState(false);
    playlist.classList.add("hidden");
    sessionStorage.setItem("songIsPlaying", "false");
    sessionStorage.setItem("songCurrentTime", player.currentTime);
};

// ---------- CLOSE PLAYLIST ----------
document.addEventListener("click", (e) => {
    if (!playlist.contains(e.target) && e.target !== musicBtn) {
        playlist.classList.add("hidden");
    }
});

// ---------- NEXT SCENE - ✅ SAVE MUSIC STATE ----------
document.getElementById("nextBtn").onclick = () => {
    sessionStorage.setItem("selectedSong", current);
    sessionStorage.setItem("songCurrentTime", player.currentTime);
    sessionStorage.setItem("songIsPlaying", isPlaying ? "true" : "false");

    document.body.classList.add("page-exit");
    setTimeout(() => {
        window.location.href = "scene4.html";
    }, 700);
};

// ---------- LOAD ON PAGE START - ✅ RESTORE STATE ----------
window.addEventListener("load", () => {
    const savedSong = sessionStorage.getItem("selectedSong");
    const savedTime = parseFloat(sessionStorage.getItem("songCurrentTime")) || 0;
    const wasPlaying = sessionStorage.getItem("songIsPlaying") === "true";

    if (savedSong && songs[savedSong]) {
        current = savedSong;
        currentIndex = songOrder.indexOf(savedSong);
    }

    title.textContent = songs[current].title;
    desc.textContent = songs[current].desc;
    player.src = songs[current].src;

    document.querySelectorAll(".song").forEach(s => {
        s.classList.remove("active");
    });
    document.querySelector(`.song[data-song="${current}"]`).classList.add("active");

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

// ---------- SPARKLES ----------
const sparkleContainer = document.getElementById("sparkleContainer");
for (let i = 0; i < 45; i++) {
    const s = document.createElement("div");
    s.className = "spark";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    s.style.animationDelay = Math.random() * 4 + "s";
    sparkleContainer.appendChild(s);
}

// ---------- FLOATING RAKHI ----------
const rakhiContainer = document.getElementById("rakhiContainer");

function createRakhi() {
    const rakhi = document.createElement("div");
    rakhi.className = "rakhi";
    rakhi.innerHTML = `
        <div class="thread"></div>
        <div class="disc"></div>
    `;
    rakhi.style.left = Math.random() * 100 + "vw";
    rakhi.style.bottom = "-40px";
    const size = 20 + Math.random() * 12;
    rakhi.style.width = size + "px";
    rakhi.style.height = size + "px";
    const duration = 18 + Math.random() * 8;
    rakhi.style.animationDuration = duration + "s";
    rakhiContainer.appendChild(rakhi);
    setTimeout(() => {
        rakhi.remove();
    }, duration * 1000);
}

for (let i = 0; i < 10; i++) {
    setTimeout(createRakhi, i * 700);
}
setInterval(createRakhi, 1500);