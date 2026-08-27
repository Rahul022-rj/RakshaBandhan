// ======================================================
// SCENE 2 - COMPLETE WITH CONTINUOUS MUSIC
// ======================================================

// ---------- SONGS ----------
const songs = {
  1: {
    src: "../assets/music/ashiyan.mp3",
    title: "Ashiyan",
    desc: "for my favourite sibling"
  },
  2: {
    src: "../assets/music/phoolo.mp3",
    title: "Phoolo Ka Taaro Ka",
    desc: "the one we both know"
  }
};

// Song order for auto-play
const songOrder = ["1", "2"];
let currentIndex = 0;
let current = songOrder[currentIndex];
let isPlaying = false;

// ---------- ELEMENTS ----------
const player = document.getElementById("player");
const playlist = document.getElementById("playlist");
const musicBtn = document.getElementById("musicBtn");
const pauseBtn = document.getElementById("pauseBtn");
const playlistBtn = document.getElementById("playlistBtn");
const songItems = document.querySelectorAll(".song");

// ======================================================
// UPDATE ACTIVE SONG IN PLAYLIST
// ======================================================

function updateActiveSong(songId) {
  songItems.forEach(s => {
    s.classList.remove("active");
    if (s.dataset.song === songId) {
      s.classList.add("active");
    }
  });
}

// ======================================================
// PLAY / PAUSE FUNCTION
// ======================================================

function playSong(songId) {
  current = songId;
  player.src = songs[songId].src;

  player.play()
    .then(() => {
      isPlaying = true;
      pauseBtn.innerHTML = "⏸";
      updateActiveSong(songId);
      sessionStorage.setItem("selectedSong", songId);
    })
    .catch(err => {
      console.log("Playback error:", err);
      isPlaying = false;
      pauseBtn.innerHTML = "▶";
    });
}

function togglePlay() {
  if (isPlaying) {
    player.pause();
    isPlaying = false;
    pauseBtn.innerHTML = "▶";
    // ✅ Save state when paused
    sessionStorage.setItem("songIsPlaying", "false");
    sessionStorage.setItem("songCurrentTime", player.currentTime);
  } else {
    if (player.src) {
      player.play()
        .then(() => {
          isPlaying = true;
          pauseBtn.innerHTML = "⏸";
          sessionStorage.setItem("songIsPlaying", "true");
        })
        .catch(err => {
          console.log("Playback error:", err);
        });
    } else {
      playSong(current);
    }
  }
}

// ======================================================
// AUTO-PLAY NEXT SONG
// ======================================================

player.addEventListener("ended", function () {
  currentIndex = (currentIndex + 1) % songOrder.length;
  const nextSongId = songOrder[currentIndex];
  current = nextSongId;

  player.src = songs[nextSongId].src;
  player.play()
    .then(() => {
      isPlaying = true;
      pauseBtn.innerHTML = "⏸";
      updateActiveSong(nextSongId);
      sessionStorage.setItem("selectedSong", nextSongId);
      sessionStorage.setItem("songCurrentTime", 0);
      sessionStorage.setItem("songIsPlaying", "true");
    })
    .catch(err => {
      console.log("Auto-play error:", err);
    });
});

// ======================================================
// PLAY/PAUSE BUTTON
// ======================================================

pauseBtn.onclick = togglePlay;

// ======================================================
// PLAYLIST POPUP
// ======================================================

musicBtn.onclick = (e) => {
  e.stopPropagation();
  playlist.classList.toggle("hidden");
};

// ======================================================
// SELECT SONG FROM PLAYLIST
// ======================================================

songItems.forEach(song => {
  song.onclick = () => {
    const songId = song.dataset.song;
    const index = songOrder.indexOf(songId);
    if (index !== -1) {
      currentIndex = index;
    }
    playSong(songId);
    playlist.classList.add("hidden");
  };
});

// Close popup when clicking outside
document.addEventListener("click", (e) => {
  if (!playlist.contains(e.target) && e.target !== musicBtn) {
    playlist.classList.add("hidden");
  }
});

// ======================================================
// GO TO SCENE 3 - ✅ SAVE MUSIC STATE
// ======================================================

playlistBtn.onclick = () => {
  // ✅ Save current song, time, and playing state
  sessionStorage.setItem("selectedSong", current);
  sessionStorage.setItem("songCurrentTime", player.currentTime);
  sessionStorage.setItem("songIsPlaying", isPlaying ? "true" : "false");

  player.pause();
  document.body.style.pointerEvents = "none";
  document.body.classList.add("page-exit");

  setTimeout(() => {
    window.location.href = "scene3.html";
  }, 900);
};

// ======================================================
// LOAD SONG ON PAGE LOAD - ✅ RESTORE STATE
// ======================================================

window.addEventListener("load", () => {
  const savedSong = sessionStorage.getItem("selectedSong");
  const savedTime = parseFloat(sessionStorage.getItem("songCurrentTime")) || 0;
  const wasPlaying = sessionStorage.getItem("songIsPlaying") === "true";

  if (savedSong && songs[savedSong]) {
    const index = songOrder.indexOf(savedSong);
    if (index !== -1) {
      currentIndex = index;
      current = savedSong;
    }
  }

  player.src = songs[current].src;
  updateActiveSong(current);

  // ✅ Restore playback position
  if (savedTime > 0) {
    player.currentTime = savedTime;
  }

  // ✅ Resume if it was playing
  if (wasPlaying) {
    player.play()
      .then(() => {
        isPlaying = true;
        pauseBtn.innerHTML = "⏸";
      })
      .catch(err => {
        console.log("Playback error:", err);
        isPlaying = false;
        pauseBtn.innerHTML = "▶";
      });
  } else {
    pauseBtn.innerHTML = "▶";
    isPlaying = false;
  }
});

// ======================================================
// SPARKLES
// ======================================================

const sparkleContainer = document.getElementById("sparkleContainer");

function createSparkle() {
  const s = document.createElement("div");
  s.className = "spark";
  s.style.left = Math.random() * 100 + "vw";
  s.style.top = Math.random() * 100 + "vh";
  s.style.animationDelay = Math.random() * 4 + "s";
  s.style.animationDuration = (3 + Math.random() * 3) + "s";
  sparkleContainer.appendChild(s);
}

for (let i = 0; i < 45; i++) {
  createSparkle();
}

// ======================================================
// FLOATING RAKHI
// ======================================================

const rakhiContainer = document.getElementById("rakhiContainer");

function createRakhi() {
  const rakhi = document.createElement("div");
  rakhi.className = "rakhi";
  rakhi.style.left = Math.random() * 100 + "vw";
  rakhi.style.bottom = "-60px";
  const size = 24 + Math.random() * 16;
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