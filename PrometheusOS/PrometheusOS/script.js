const clock = document.getElementById("clock");
const windows = document.getElementById("windows");
const menuPopovers = document.getElementById("menu-popovers");
const currentAppName = document.getElementById("current-app-name");
const authScreen = document.getElementById("auth-screen");
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authCopy = document.getElementById("auth-copy");
const authSubmit = document.getElementById("auth-submit");
const authError = document.getElementById("auth-error");
const authId = document.getElementById("auth-id");
const authPassword = document.getElementById("auth-password");
const accountKey = "prometheusLocalAccount";

function updateClock() {
  clock.textContent = new Date().toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
updateClock();
setInterval(updateClock, 1000);

const apps = {
  notes: {
    title: "Notes",
    html: '<h2>Notes</h2><p>Your notes are saved in this browser.</p><textarea id="notes" placeholder="Write something..."></textarea>'
  },
  terminal: {
    title: "Terminal",
    html: '<h2>Terminal</h2><p>Try: help, date, or clear.</p><div class="terminal-output" id="output">PrometheusOS terminal\n</div><input class="terminal-input" id="command" placeholder="Type a command and press Enter">'
  },
  about: {
    title: "About This Computer",
    html: '<h2>PrometheusOS</h2><p>Computers are a guide and a path to the future.</p><p>This is an early browser-based desktop experiment inspired by Prometheus bringing fire to humanity.</p><p>Version 0.1</p>'
  },
  website: {
    title: "My Site",
    html: '<div class="site-toolbar"><span>Personal Site</span><a href="https://darthkenobi2407.github.io/personal-site/" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a></div><iframe class="site-frame" src="https://darthkenobi2407.github.io/personal-site/" title="Personal site" loading="lazy"></iframe>'
  }
};

const menuItems = {
  system: [
    { label: "About This Computer", action: () => openApp("about") },
    { separator: true },
    { label: "System Settings…", action: () => showMessage("System Settings", "Settings will be added in a later version.") },
    { separator: true },
    { label: "Restart Desktop", action: () => location.reload() },
    { separator: true },
    { label: "Log Out…", action: logOut }
  ],
  file: [
    { label: "New Note", action: () => openApp("notes") },
    { label: "Open Terminal", action: () => openApp("terminal") },
    { label: "Open My Site", action: () => openApp("website") },
    { separator: true },
    { label: "Close Front Window", action: closeFrontWindow }
  ],
  edit: [
    { label: "Undo", disabled: true },
    { label: "Cut", action: () => document.execCommand("cut") },
    { label: "Copy", action: () => document.execCommand("copy") },
    { label: "Paste", action: () => document.execCommand("paste") },
    { separator: true },
    { label: "Select All", action: () => document.execCommand("selectAll") }
  ],
  view: [
    { label: "Show Desktop", action: closeAllWindows },
    { label: "Open Notes", action: () => openApp("notes") },
    { label: "Open Terminal", action: () => openApp("terminal") },
    { label: "Open My Site", action: () => openApp("website") }
  ],
  window: [
    { label: "Minimize Front Window", action: minimizeFrontWindow },
    { label: "Bring All to Front", action: bringAllToFront }
  ],
  help: [
    { label: "PrometheusOS Help", action: () => showMessage("PrometheusOS Help", "Choose an app from the desktop or dock. Use the menu bar for common actions.") },
    { label: "About PrometheusOS", action: () => openApp("about") }
  ]
};

let activeMenu = null;
let highestZ = 4;

document.querySelectorAll("[data-app]").forEach(button => {
  button.addEventListener("click", () => openApp(button.dataset.app));
});

document.querySelectorAll(".menu-trigger").forEach(button => {
  button.addEventListener("click", event => {
    event.stopPropagation();
    const name = button.dataset.menu;
    if (activeMenu === name) {
      closeMenu();
      return;
    }
    openMenu(name, button);
  });
});

document.addEventListener("click", event => {
  if (!event.target.closest(".menu-dropdown")) closeMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

function openMenu(name, trigger) {
  closeMenu();
  activeMenu = name;
  trigger.setAttribute("aria-expanded", "true");
  const dropdown = document.createElement("div");
  dropdown.className = "menu-dropdown";
  if (trigger.classList.contains("brand-menu")) dropdown.classList.add("system-dropdown");
  const triggerRect = trigger.getBoundingClientRect();
  dropdown.style.left = `${Math.max(0, triggerRect.left)}px`;
  dropdown.setAttribute("role", "menu");

  menuItems[name].forEach(item => {
    if (item.separator) {
      const line = document.createElement("div");
      line.className = "menu-separator";
      dropdown.appendChild(line);
      return;
    }
    const option = document.createElement("button");
    option.textContent = item.label;
    option.setAttribute("role", "menuitem");
    if (item.disabled) {
      option.disabled = true;
      option.className = "disabled";
    }
    option.addEventListener("click", () => {
      closeMenu();
      if (!item.disabled && item.action) item.action();
    });
    dropdown.appendChild(option);
  });
  menuPopovers.appendChild(dropdown);
}

function closeMenu() {
  document.querySelectorAll(".menu-trigger[aria-expanded='true']").forEach(button => button.setAttribute("aria-expanded", "false"));
  menuPopovers.replaceChildren();
  activeMenu = null;
}

function openApp(name) {
  const existing = document.querySelector(`[data-window="${name}"]`);
  if (existing) {
    existing.hidden = false;
    focusWindow(existing);
    return;
  }

  const app = apps[name];
  if (!app) return;

  const win = document.createElement("section");
  win.className = "window";
  win.dataset.window = name;
  win.innerHTML = `
    <div class="window-bar">
      <div class="traffic-lights">
        <button class="close" title="Close" aria-label="Close"></button>
        <button class="minimize" title="Minimize" aria-label="Minimize"></button>
        <button class="zoom" title="Zoom" aria-label="Zoom"></button>
      </div>
      <span class="window-title">${app.title}</span>
    </div>
    <div class="window-body">${app.html}</div>
  `;
  windows.appendChild(win);
  if (name === "website") {
    win.classList.add("website-window");
    win.style.width = "min(1000px, calc(100vw - 32px))";
    win.style.height = "min(720px, calc(100vh - 90px))";
    win.style.top = "42px";
  }
  focusWindow(win);

  win.addEventListener("pointerdown", () => focusWindow(win));
  win.querySelector(".close").addEventListener("click", () => { win.remove(); updateActiveApp(); });
  win.querySelector(".minimize").addEventListener("click", () => { win.hidden = true; updateActiveApp(); });
  win.querySelector(".zoom").addEventListener("click", () => {
    const expanded = win.dataset.expanded === "true";
    if (expanded) {
      win.style.left = "50%";
      win.style.top = window.innerWidth <= 650 ? "75px" : "110px";
      win.style.width = "min(470px, calc(100vw - 28px))";
      win.style.height = "320px";
      win.style.transform = "translateX(-50%)";
      win.dataset.expanded = "false";
    } else {
      win.style.left = "8px";
      win.style.top = "8px";
      win.style.width = "calc(100% - 16px)";
      win.style.height = "calc(100% - 16px)";
      win.style.transform = "none";
      win.dataset.expanded = "true";
    }
  });

  makeDraggable(win);

  if (name === "notes") {
    const area = win.querySelector("#notes");
    area.value = localStorage.getItem("prometheusNotes") || "";
    area.addEventListener("input", () => localStorage.setItem("prometheusNotes", area.value));
  }

  if (name === "terminal") {
    const input = win.querySelector("#command");
    const output = win.querySelector("#output");
    input.addEventListener("keydown", event => {
      if (event.key !== "Enter") return;
      const command = input.value.trim().toLowerCase();
      let result = "";
      if (command === "help") result = "Commands: help, date, clear";
      else if (command === "date") result = new Date().toString();
      else if (command === "clear") output.textContent = "";
      else if (command) result = `Unknown command: ${command}`;
      if (result) output.textContent += `> ${command}\n${result}\n`;
      input.value = "";
    });
  }
}

function focusWindow(win) {
  win.style.zIndex = String(++highestZ);
  currentAppName.textContent = win.dataset.window === "message"
    ? (win.querySelector(".window-title")?.textContent || "")
    : (apps[win.dataset.window]?.title || "");
}

function updateActiveApp() {
  const front = getFrontWindow();
  currentAppName.textContent = front
    ? (front.dataset.window === "message"
      ? (front.querySelector(".window-title")?.textContent || "")
      : (apps[front.dataset.window]?.title || ""))
    : "";
}

function closeFrontWindow() {
  const win = getFrontWindow();
  if (win) win.remove();
  updateActiveApp();
}
function minimizeFrontWindow() {
  const win = getFrontWindow();
  if (win) win.hidden = true;
  updateActiveApp();
}
function getFrontWindow() {
  return [...windows.querySelectorAll(".window:not([hidden])")]
    .sort((a, b) => Number(b.style.zIndex || 4) - Number(a.style.zIndex || 4))[0];
}
function closeAllWindows() { windows.replaceChildren(); updateActiveApp(); }
function bringAllToFront() {
  [...windows.querySelectorAll(".window:not([hidden])")].forEach(focusWindow);
}
function showMessage(title, message) {
  const existing = document.querySelector('[data-window="message"]');
  if (existing) existing.remove();
  const win = document.createElement("section");
  win.className = "window message-window";
  win.dataset.window = "message";
  win.style.height = "190px";
  win.innerHTML = `<div class="window-bar"><div class="traffic-lights"><button class="close" title="Close" aria-label="Close"></button><button class="minimize" title="Minimize" aria-label="Minimize"></button><button class="zoom" title="Zoom" aria-label="Zoom"></button></div><span class="window-title">${title}</span></div><div class="window-body"><p>${message}</p></div>`;
  windows.appendChild(win);
  focusWindow(win);
  win.querySelector(".close").addEventListener("click", () => { win.remove(); updateActiveApp(); });
  win.querySelector(".minimize").addEventListener("click", () => { win.hidden = true; updateActiveApp(); });
  win.querySelector(".zoom").addEventListener("click", () => win.style.height = win.style.height === "190px" ? "320px" : "190px");
  makeDraggable(win);
}

function makeDraggable(win) {
  const bar = win.querySelector(".window-bar");
  let dx = 0;
  let dy = 0;
  let moving = false;

  bar.addEventListener("pointerdown", event => {
    if (event.target.closest("button") || window.innerWidth <= 650 || win.dataset.expanded === "true") return;
    moving = true;
    focusWindow(win);
    const rect = win.getBoundingClientRect();
    dx = event.clientX - rect.left;
    dy = event.clientY - rect.top;
    win.style.transform = "none";
    bar.setPointerCapture(event.pointerId);
  });

  bar.addEventListener("pointermove", event => {
    if (!moving) return;
    const parent = windows.getBoundingClientRect();
    const maxX = Math.max(0, parent.width - win.offsetWidth);
    const maxY = Math.max(0, parent.height - 42);
    win.style.left = `${Math.max(0, Math.min(maxX, event.clientX - parent.left - dx))}px`;
    win.style.top = `${Math.max(0, Math.min(maxY, event.clientY - parent.top - dy))}px`;
  });
  bar.addEventListener("pointerup", () => moving = false);
  bar.addEventListener("pointercancel", () => moving = false);
}


function getSavedAccount() {
  try { return JSON.parse(localStorage.getItem(accountKey) || "null"); }
  catch { return null; }
}

function bytesToHex(bytes) {
  return [...bytes].map(n => n.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  return new Uint8Array(hex.match(/.{2}/g).map(part => parseInt(part, 16)));
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits({
    name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256"
  }, key, 256);
  return bytesToHex(new Uint8Array(bits));
}

function setAuthMode() {
  const account = getSavedAccount();
  const creating = !account;
  authTitle.textContent = creating ? "Welcome" : "Sign in";
  authCopy.textContent = creating ? "Create an account to set up your desktop." : "Enter your account details to continue.";
  authSubmit.textContent = creating ? "Create account" : "Log in";
  authPassword.autocomplete = creating ? "new-password" : "current-password";
  authId.value = account?.id || "";
  authError.textContent = "";
  authScreen.hidden = Boolean(account) && sessionStorage.getItem("prometheusAuthenticated") === "true";
  document.body.classList.toggle("authenticated", authScreen.hidden);
  if (!authScreen.hidden) setTimeout(() => (creating ? authId : authPassword).focus(), 30);
}

function logOut() {
  sessionStorage.removeItem("prometheusAuthenticated");
  windows.replaceChildren();
  updateActiveApp();
  setAuthMode();
}

document.querySelector(".auth-window-dot.close").addEventListener("click", () => {
  authForm.reset();
  authError.textContent = "";
  authPassword.value = "";
  authId.focus();
});

authForm.addEventListener("submit", async event => {
  event.preventDefault();
  authError.textContent = "";
  authSubmit.disabled = true;
  const id = authId.value.trim();
  const password = authPassword.value;
  try {
    const account = getSavedAccount();
    if (!account) {
      if (id.length < 3) throw new Error("Your account ID must be at least 3 characters.");
      if (password.length < 8) throw new Error("Your password must be at least 8 characters.");
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const passwordHash = await hashPassword(password, salt);
      localStorage.setItem(accountKey, JSON.stringify({ id, salt: bytesToHex(salt), passwordHash }));
      sessionStorage.setItem("prometheusAuthenticated", "true");
      authScreen.hidden = true;
      document.body.classList.add("authenticated");
    } else {
      const passwordHash = await hashPassword(password, hexToBytes(account.salt));
      if (id !== account.id || passwordHash !== account.passwordHash) {
        throw new Error("That account ID or password is incorrect.");
      }
      sessionStorage.setItem("prometheusAuthenticated", "true");
      authScreen.hidden = true;
      document.body.classList.add("authenticated");
    }
    authPassword.value = "";
  } catch (error) {
    authError.textContent = error.message || "Could not save this account in the browser.";
  } finally {
    authSubmit.disabled = false;
  }
});

setAuthMode();
