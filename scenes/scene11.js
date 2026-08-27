// ==========================================
// SCENE 11 - MEMORY WALL
// ==========================================

// ---------- Elements ----------
const stars = document.getElementById("stars");
const petals = document.getElementById("petals");
const lights = document.getElementById("lights");
const promiseBtn = document.getElementById("promiseBtn");

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
// PHOTO CLICK EXPANSION
// ==========================================

const overlay = document.createElement('div');
overlay.className = 'photo-overlay';
document.body.appendChild(overlay);

const photos = document.querySelectorAll('.photo');
let expandedPhoto = null;

function expandPhoto(photo) {
  if (expandedPhoto) {
    closePhoto(expandedPhoto);
  }

  photo._parent = photo.parentElement;
  photo._nextSibling = photo.nextSibling;

  document.body.appendChild(photo);

  photo.classList.add('expanded');
  expandedPhoto = photo;
  overlay.classList.add('active');
  document.body.classList.add('no-scroll');

  if (!photo.querySelector('.photo-close')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'photo-close';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = function (e) {
      e.stopPropagation();
      closePhoto(photo);
    };
    photo.appendChild(closeBtn);
  }
}

function closePhoto(photo) {
  if (!photo) return;

  photo.classList.remove('expanded');

  if (photo._parent) {
    photo._parent.insertBefore(photo, photo._nextSibling);
  }

  expandedPhoto = null;
  overlay.classList.remove('active');
  document.body.classList.remove('no-scroll');
}

photos.forEach(photo => {
  photo.addEventListener('click', function (e) {
    if (e.target.classList.contains('photo-close')) return;
    if (this.classList.contains('expanded')) {
      closePhoto(this);
    } else {
      expandPhoto(this);
    }
  });
});

overlay.addEventListener('click', function () {
  if (expandedPhoto) {
    closePhoto(expandedPhoto);
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && expandedPhoto) {
    closePhoto(expandedPhoto);
  }
});

// ==========================================
// STARS
// ==========================================
for (let i = 0; i < 140; i++) {
  const s = document.createElement("span");
  s.className = "star";
  s.style.left = Math.random() * 100 + "vw";
  s.style.top = Math.random() * 100 + "vh";
  const size = Math.random() * 3 + 1;
  s.style.width = size + "px";
  s.style.height = size + "px";
  s.style.animationDelay = Math.random() * 4 + "s";
  stars.appendChild(s);
}

// ==========================================
// FAIRY LIGHTS
// ==========================================
function createLight() {
  const light = document.createElement("div");
  light.className = "fairy";
  light.style.left = Math.random() * 100 + "vw";
  light.style.top = Math.random() * 100 + "vh";
  const size = 4 + Math.random() * 6;
  light.style.width = size + "px";
  light.style.height = size + "px";
  light.style.animationDuration = (2 + Math.random() * 3) + "s";
  lights.appendChild(light);
}

for (let i = 0; i < 80; i++) createLight();

// ==========================================
// FALLING PETALS
// ==========================================
const flowerIcons = ["🌸", "🌺", "🌼"];

function createPetal() {
  const p = document.createElement("div");
  p.className = "petal";
  p.innerHTML = flowerIcons[Math.floor(Math.random() * flowerIcons.length)];
  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = (18 + Math.random() * 18) + "px";
  p.style.animationDuration = (8 + Math.random() * 6) + "s";
  petals.appendChild(p);
  setTimeout(() => { p.remove(); }, 14000);
}

for (let i = 0; i < 20; i++) {
  setTimeout(createPetal, i * 500);
}
setInterval(createPetal, 900);

// ==========================================
// PROMISE BUTTON
// ==========================================
promiseBtn.onclick = () => {
  promiseBtn.innerHTML = "💜 Forever Connected";
  createCelebration();
};

function createCelebration() {
  const emojis = ["💖", "✨", "🌸", "💛"];
  for (let i = 0; i < 45; i++) {
    const e = document.createElement("div");
    e.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    e.style.position = "fixed";
    e.style.left = "50%";
    e.style.top = "75%";
    e.style.fontSize = (18 + Math.random() * 20) + "px";
    e.style.pointerEvents = "none";
    e.style.zIndex = "999";
    document.body.appendChild(e);
    const x = (Math.random() - 0.5) * 600;
    const y = -Math.random() * 350;
    e.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${x}px,${y}px) scale(.3)`, opacity: 0 }
    ], { duration: 2000, easing: "ease-out" });
    setTimeout(() => e.remove(), 2000);
  }
}

// ==========================================
// DOWNLOAD BUTTON
// ==========================================
const download = document.createElement("button");
download.innerHTML = "🎁";
download.className = "floatingDownload";
document.body.appendChild(download);

download.onclick = () => {
  const imagePath = "../assets/images/my-rakhis.jpg";
  const link = document.createElement("a");
  link.href = imagePath;
  link.download = "Happy_Raksha_Bandhan_Memory.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==========================================
// HOME BUTTON
// ==========================================
document.getElementById("homeBtn").onclick = () => {
  sessionStorage.setItem("selectedSong", currentSong);
  sessionStorage.setItem("songCurrentTime", bgMusic.currentTime);
  sessionStorage.setItem("songIsPlaying", isPlaying ? "true" : "false");
  document.body.style.transition = ".8s";
  document.body.style.opacity = "0";
  setTimeout(() => {
    window.location.href = "../index.html";
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