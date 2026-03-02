console.log("✅ Page loaded: script.js is running");

const themeBtn = document.getElementById("themeBtn");
const countBtn = document.getElementById("countBtn");
const countLabel = document.getElementById("countLabel");

let isDarkMode = false;
let clickCount = 0;

function setTheme() {
  document.body.classList.toggle("dark");
  isDarkMode = document.body.classList.contains("dark");
  console.log("🌙 Theme toggled. isDarkMode =", isDarkMode);
}

function increaseCount() {
  clickCount = clickCount + 1;
  console.log("🖱️ Count button clicked. clickCount =", clickCount);
  if (countLabel) countLabel.textContent = clickCount;
}

// Theme button event
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    console.log("🎛️ Theme button clicked");
    setTheme();
  });
} else {
  console.log("❌ ERROR: themeBtn not found. Check id='themeBtn' in index.html");
}

// Counter button event
if (countBtn) {
  countBtn.addEventListener("click", () => {
    console.log("➕ Count button clicked");
    increaseCount();
  });
} else {
  console.log("❌ ERROR: countBtn not found. Check id='countBtn' in index.html");
}
