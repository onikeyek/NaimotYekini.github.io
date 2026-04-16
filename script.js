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

// ===== External Data Demo =====

// Why do we use async/await?
// fetch() is asynchronous – it does not return data immediately.
// async/await lets us write asynchronous code that reads like
// normal step-by-step code, making it easier to understand and
// maintain compared to chaining .then() callbacks.

// Why do we check response.ok?
// fetch() only throws an error for network failures, NOT for HTTP
// error statuses like 404 or 500. Checking response.ok (which is
// true when the status is 200–299) lets us catch these server-side
// errors and handle them properly instead of trying to parse a
// broken or empty response.

// Why do we use try/catch?
// Anything can go wrong during a network request: no internet,
// server down, or unexpected data. try/catch lets us intercept any
// thrown error and show a helpful message to the user instead of
// silently failing or crashing the script.

const loadDataBtn = document.getElementById("loadDataBtn");
const dataOutput = document.getElementById("dataOutput");

async function loadUserData() {
  // Disable the button while loading to prevent duplicate requests
  loadDataBtn.disabled = true;

  // Show a temporary loading message while waiting for the response
  dataOutput.innerHTML = '<p class="data-status">Loading…</p>';
  console.log("🌐 Fetching data from API…");

  try {
    // Send HTTP GET request to the API endpoint
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");

    // Check response.ok – fetch does not throw for 4xx/5xx errors
    if (!response.ok) {
      throw new Error(`HTTP error: status ${response.status}`);
    }

    // Parse the JSON body of the response
    const user = await response.json();
    console.log("✅ Data received:", user);

    // Build the card HTML dynamically from the fetched data
    dataOutput.innerHTML = `
      <div class="data-card">
        <h3>User Profile</h3>
        <p><span class="label">Name:</span>${user.name}</p>
        <p><span class="label">Email:</span>${user.email}</p>
        <p><span class="label">Company:</span>${user.company.name}</p>
      </div>
    `;
  } catch (error) {
    // Display an error message if anything went wrong
    console.error("❌ Error loading data:", error);
    dataOutput.innerHTML = '<p class="data-error">Error loading data</p>';
  } finally {
    // Re-enable the button whether the request succeeded or failed
    loadDataBtn.disabled = false;
  }
}

if (loadDataBtn) {
  loadDataBtn.addEventListener("click", () => {
    console.log("📡 Load Data button clicked");
    loadUserData();
  });
} else {
  console.log("❌ ERROR: loadDataBtn not found. Check id='loadDataBtn' in index.html");
}

// ===== Experience Tabs =====
document.querySelectorAll('.exp-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.exp-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    if (themeIcon) {
      themeIcon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // Restore saved preference
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    if (themeIcon) themeIcon.className = 'fas fa-moon';
  }
}
