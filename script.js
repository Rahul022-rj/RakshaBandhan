const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const area = document.getElementById("buttonArea");

// Track attempts
let noClickCount = 0;
const maxNoClicks = 8;

function moveNoButton() {
    const maxX = area.clientWidth - noBtn.offsetWidth - 10;
    const maxY = area.clientHeight - noBtn.offsetHeight - 10;

    // If button is hidden, don't move
    if (noBtn.style.display === "none") return;

    // Get random position within the button area
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    // Apply new position with smooth animation
    noBtn.style.position = "absolute";
    noBtn.style.left = Math.max(0, randomX) + "px";
    noBtn.style.top = Math.max(0, randomY) + "px";
    noBtn.style.transition = "left 0.15s ease-out, top 0.15s ease-out";
}

// ✅ ONLY move when clicking, NOT on hover
noBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // If button is disabled or hidden, do nothing
    if (noBtn.disabled || noBtn.style.display === "none") return;

    noClickCount++;

    // If clicked too many times, make it disappear
    if (noClickCount >= maxNoClicks) {
        // Shrink and disappear animation
        noBtn.style.transition = "transform 0.5s ease, opacity 0.5s ease";
        noBtn.style.transform = "scale(0) rotate(360deg)";
        noBtn.style.opacity = "0";

        setTimeout(() => {
            noBtn.style.display = "none";
            showNoButtonMessage();
        }, 500);

        return;
    }

    // Move the button to a random position
    moveNoButton();

    // Change button text to taunt user
    const taunts = [
        "Nice try! 😏",
        "Not today! 😜",
        "Keep trying! 🤪",
        "You can't catch me! 😂",
        "Almost! 🤭",
        "Haha! 🙃",
        "Give up! 😝",
        `Last chance! 🔥`
    ];

    noBtn.textContent = taunts[Math.min(noClickCount - 1, taunts.length - 1)];

    // Reset text after 800ms
    setTimeout(() => {
        if (noBtn.style.display !== "none") {
            noBtn.textContent = "No 🥺";
        }
    }, 800);

    // Small shake effect on the button when clicked
    noBtn.style.transform = "scale(0.9)";
    setTimeout(() => {
        if (noBtn.style.display !== "none") {
            noBtn.style.transform = "scale(1)";
        }
    }, 100);
});

// Show message when No button disappears
function showNoButtonMessage() {
    const message = document.createElement("div");
    message.style.position = "fixed";
    message.style.top = "50%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.fontSize = "24px";
    message.style.fontWeight = "bold";
    message.style.color = "#47281d";
    message.style.backgroundColor = "#fff";
    message.style.padding = "25px 35px";
    message.style.borderRadius = "20px";
    message.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)";
    message.style.zIndex = "100";
    message.style.animation = "fadeInUp 0.5s ease forwards";
    message.style.textAlign = "center";
    message.style.border = "3px solid #EA6C27";
    message.innerHTML = `
        🎉 You finally gave up! <br>
        <span style="font-size: 16px; color: #7A6759; display: block; margin-top: 10px;">
            Just click Yes already! ❤️
        </span>
    `;
    document.body.appendChild(message);

    // Make Yes button pulse to attract attention
    yesBtn.style.animation = "glowPulse 0.8s ease-in-out infinite";
    yesBtn.style.transform = "scale(1.1)";
    yesBtn.style.transition = "transform 0.3s ease";
}

// YES → Scene 2
yesBtn.onclick = () => {
    document.body.classList.add("page-exit");
    setTimeout(() => {
        window.location.href = "scenes/scene2.html";
    }, 1200);
};

// Position No button randomly on load
window.addEventListener("load", function () {
    setTimeout(moveNoButton, 200);
});

// If user resizes window, reposition No button
window.addEventListener("resize", function () {
    if (noBtn.style.display !== "none") {
        setTimeout(moveNoButton, 100);
    }
});

// ✅ REMOVE hover listener - we only want click to move it
// No mouseenter listener!