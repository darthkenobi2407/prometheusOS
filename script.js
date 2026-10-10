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
    html: '<p>i believe that computers are our guide and path to the future , just as how prometheus brought fire to humanity , allowing it to advance forward , so will computers .</p><p>this is the first build and ive worked on mainly the desktop environemtn and design and creating the overall ui</p>'
  },
  formula1: {
    title: "Formula1",
    html: `<div class="f1-page" id="f1-dashboard">
      <p class="f1-intro">I also really really like racing and this app is something ive wanted to build for quite some time , enjoy!! :)</p>
      <header class="f1-head"><div><h1>FORMULA <span>1</span></h1><p class="f1-sub">Race results, championship points, and standings.</p></div><a href="https://www.formula1.com/en/results/2026/races" target="_blank" rel="noopener noreferrer">Official F1 ↗</a></header>
      <div class="f1-data-note"><span id="f1-data-status">Connecting to the F1 data source…</span><button id="f1-refresh" type="button">Refresh data</button></div>
      <section class="f1-section"><div class="f1-section-title"><h2>Latest completed Grand Prix</h2><span id="f1-race-round">LOADING</span></div><div id="f1-race-summary" class="f1-race-card"><div><p class="f1-kicker">RACE RESULTS</p><h2>Loading latest race…</h2><p class="f1-muted">Fetching the latest published classification.</p></div></div><div id="f1-results" class="f1-results"><div class="f1-empty">Loading race classification…</div></div><a id="f1-race-link" class="f1-more" href="https://www.formula1.com/en/results/2026/races" target="_blank" rel="noopener noreferrer">Open official race results ↗</a></section>
      <section class="f1-section"><div class="f1-section-title"><h2>Drivers’ championship</h2><span id="f1-season-label">CURRENT SEASON</span></div><div id="f1-driver-standings" class="f1-table"><div class="f1-empty">Loading driver standings…</div></div><a href="https://www.formula1.com/en/results/2026/drivers" class="f1-more" target="_blank" rel="noopener noreferrer">Official driver standings ↗</a></section>
      <section class="f1-section"><div class="f1-section-title"><h2>Constructors’ championship</h2><span id="f1-constructor-season">CURRENT SEASON</span></div><div id="f1-constructor-standings" class="f1-table"><div class="f1-empty">Loading constructor standings…</div></div><a href="https://www.formula1.com/en/results/2026/team" class="f1-more" target="_blank" rel="noopener noreferrer">Official constructor standings ↗</a></section>
      <footer class="f1-foot">Championship data from Jolpica-F1, the open-source Ergast-compatible API. Timing and live telemetry are not included. Official F1 links are provided for reference.</footer>
    </div>`
  },
  website: {
    title: "My Projects",
    html: "<div class=\"projects-home\"><div class=\"projects-intro\"><div class=\"projects-eyebrow\">ABOUT / PROJECTS</div><h1>hello world<span class=\"projects-cursor\"></span></h1><p>hey!! im akshat and this personal website has some things im working on and learning about</p><p class=\"projects-small\">just some things im working on and learning about</p></div><section class=\"projects-group\"><h2>projects that ive done</h2><button data-project=\"trading\">trading terminal <span>\u2197</span></button><button data-project=\"antivirus\">simple antivirus <span>\u2197</span></button><button data-project=\"console\">breadboard console <span>\u2197</span></button><button data-project=\"smoke\">smoke detector <span>\u2197</span></button><button data-project=\"parking\">smart parking system <span>\u2197</span></section><section class=\"projects-group\"><h2>interests and stuff i want to build</h2><button data-project=\"stocks\">stock prediction ai <span>\u2197</span></button><button data-project=\"localai\">local ai device <span>\u2197</span></button><button data-project=\"server\">self hosted stuff <span>\u2197</span></button><button data-project=\"architecture\">computer architecture <span>\u2197</span></button><button data-project=\"efficiency\">hardware efficiency <span>\u2197</span></button><button data-project=\"aisystems\">ai and systems <span>\u2197</span></button></section><a class=\"projects-external\" href=\"https://darthkenobi2407.github.io/personal-site/\" target=\"_blank\" rel=\"noopener noreferrer\">Visit my website \u2197</a></div>"
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
    { label: "Open My Projects", action: () => openApp("website") },
    { label: "Open Formula1", action: () => openApp("formula1") },
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
    { label: "Open My Projects", action: () => openApp("website") }
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
  button.addEventListener("click", () => {
    if (button.closest(".desktop-icons")) {
      document.querySelectorAll(".desktop-icons button").forEach(icon => icon.classList.remove("selected"));
      button.classList.add("selected");
    }
    openApp(button.dataset.app);
  });
});

const desktopIcons = document.querySelector(".desktop-icons");
let iconMenu;

desktopIcons?.querySelectorAll("[data-app]").forEach(button => {
  button.addEventListener("contextmenu", event => {
    event.preventDefault();
    event.stopPropagation();
    showIconMenu(button, event.clientX, event.clientY);
  });
  button.addEventListener("keydown", event => {
    if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
      event.preventDefault();
      const rect = button.getBoundingClientRect();
      showIconMenu(button, rect.left + rect.width, rect.top + 10);
    }
  });
});

document.addEventListener("click", event => {
  if (iconMenu && !iconMenu.contains(event.target)) {
    iconMenu.remove();
    iconMenu = null;
  }
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && iconMenu) {
    iconMenu.remove();
    iconMenu = null;
  }
});

function showIconMenu(button, x, y) {
  iconMenu?.remove();
  document.querySelectorAll(".desktop-icons button").forEach(icon => icon.classList.toggle("selected", icon === button));
  const name = button.dataset.app;
  const labels = { notes: "Notes", terminal: "Terminal", about: "About This Computer", website: "My Projects", formula1: "Formula1" };
  iconMenu = document.createElement("div");
  iconMenu.className = "desktop-context";
  iconMenu.setAttribute("role", "menu");
  const addItem = (label, action) => {
    const item = document.createElement("button");
    item.textContent = label;
    item.setAttribute("role", "menuitem");
    item.addEventListener("click", () => { iconMenu?.remove(); iconMenu = null; action(); });
    iconMenu.appendChild(item);
  };
  addItem("Open " + labels[name], () => openApp(name));
  const line = document.createElement("div");
  line.className = "context-line";
  iconMenu.appendChild(line);
  addItem("Get Info", () => showMessage(labels[name], "Application: " + labels[name] + "\nDouble-click is not required — select the icon to open this app. This app is part of PrometheusOS."));
  addItem("Refresh Desktop", () => {
    document.querySelectorAll(".desktop-icons button").forEach(icon => icon.classList.remove("selected"));
    button.classList.add("selected");
  });
  document.body.appendChild(iconMenu);
  iconMenu.style.left = Math.min(x, window.innerWidth - 190) + "px";
  iconMenu.style.top = Math.min(y, window.innerHeight - 120) + "px";
}

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
  if (name === "website" || name === "formula1") {
    win.classList.add(name === "website" ? "website-window" : "formula1-window");
    win.style.width = name === "formula1" ? "min(1080px, calc(100vw - 32px))" : "min(1000px, calc(100vw - 32px))";
    win.style.height = "min(760px, calc(100vh - 120px))";
    win.style.left = "50%";
    win.style.top = "calc(50% - 12px)";
    win.style.transform = "translate(-50%, -50%)";
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

  if (name === "formula1") initFormula1(win);

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
      const raw = input.value.trim();
      const command = raw.toLowerCase();
      let result = "";
      const openAliases = {
        "notes": "notes",
        "terminal": "terminal",
        "about": "about",
        "about this computer": "about",
        "my projects": "website",
        "projects": "website",
        "website": "website",
        "formula1": "formula1",
        "formula 1": "formula1",
        "f1": "formula1"
      };
      const appName = command.startsWith("open ") ? command.slice(5).trim() : command;
      if (command === "help") {
        result = "Commands: help, date, clear, open <app>\nApps: Notes, Terminal, About, My Projects, Formula1\nYou can also type an app name directly (e.g. formula1 or notes).";
      } else if (command === "date") {
        result = new Date().toString();
      } else if (command === "clear") {
        output.textContent = "";
      } else if (openAliases[appName]) {
        const target = openAliases[appName];
        output.textContent += `> ${raw}\nOpening ${apps[target].title}...\n`;
        input.value = "";
        openApp(target);
        return;
      } else if (command) {
        result = `Unknown command: ${raw}. Type help to see available commands.`;
      }
      if (result) output.textContent += `> ${raw}\n${result}\n`;
      input.value = "";
    });
  }

}


async function initFormula1(win) {
  const $f = id => win.querySelector(`#${id}`);
  const status = $f("f1-data-status");
  const refresh = $f("f1-refresh");
  const esc = value => String(value ?? "—").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[ch]));
  const api = "https://api.jolpi.ca/ergast/f1";
  const get = async path => {
    const response = await fetch(`${api}/${path}.json?limit=100`, {headers:{Accept:"application/json"}});
    if (!response.ok) throw new Error(`Data source returned ${response.status}`);
    return response.json();
  };
  const tableRows = (rows, kind) => {
    if (!rows.length) return '<div class="f1-empty">No standings have been published for this season yet.</div>';
    return `<div class="f1-table-head"><span>POS</span><span>${kind === "drivers" ? "DRIVER" : "CONSTRUCTOR"}</span><span>TEAM / NATIONALITY</span><span>PTS</span></div>` + rows.map((r,i) => {
      const isDriver = kind === "drivers";
      const person = isDriver ? r.Driver : r.Constructor;
      const name = isDriver ? `${person.givenName} ${person.familyName}` : person.name;
      const team = isDriver ? (r.Constructors || []).map(c=>c.name).join(", ") : (person.nationality || "Constructor");
      return `<div class="f1-table-row"><b>${esc(r.position || i+1)}</b><strong>${esc(name)}${isDriver && person.code ? ` <small>${esc(person.code)}</small>` : ""}</strong><span>${esc(team)}</span><strong>${esc(r.points)} <small>PTS</small></strong></div>`;
    }).join("");
  };
  async function load() {
    status.textContent = "Updating from Jolpica-F1…";
    refresh.disabled = true;
    try {
      const [raceData, driverData, constructorData] = await Promise.all([
        get("current/last/results"), get("current/driverStandings"), get("current/constructorStandings")
      ]);
      const raceTable = raceData?.MRData?.RaceTable;
      const race = raceTable?.Races?.[0];
      const results = race?.Results || [];
      const drivers = driverData?.MRData?.StandingsTable?.StandingsLists?.[0];
      const constructors = constructorData?.MRData?.StandingsTable?.StandingsLists?.[0];
      if (race) {
        $f("f1-race-round").textContent = `ROUND ${race.round} · ${race.date || "DATE TBD"}`;
        $f("f1-race-summary").innerHTML = `<div><p class="f1-kicker">${esc(race.raceName)} · ${esc(race.Circuit?.circuitName || "Circuit details unavailable")}</p><h2>${esc(results[0] ? `${results[0].Driver.givenName} ${results[0].Driver.familyName}` : "No classified winner yet")}</h2><p class="f1-muted">${esc(results[0]?.Constructor?.name || "")}${results[0] ? " · Race winner" : ""}</p></div><strong class="f1-time">${esc(results[0]?.Time?.time || results[0]?.status || "Result pending")}</strong>`;
        $f("f1-results").innerHTML = results.length ? `<div class="f1-result-row f1-result-head"><span>POS</span><span>DRIVER</span><span>TEAM</span><span>TIME / STATUS</span></div>` + results.map(r => `<div class="f1-result-row"><b>${esc(r.position || "—")}</b><strong>${esc(r.Driver.givenName)} ${esc(r.Driver.familyName)} <small>${esc(r.Driver.code || "")}</small></strong><span>${esc(r.Constructor.name)}</span><span>${esc(r.Time?.time || r.status || (r.points ? `${r.points} pts` : "—"))}</span></div>`).join("") : '<div class="f1-empty">No race classification is available yet.</div>';
        $f("f1-race-link").href = `https://www.formula1.com/en/results/${esc(race.season)}/races`;
      } else {
        $f("f1-race-summary").innerHTML = '<div><h2>No completed race found</h2><p class="f1-muted">The data source has not returned a completed race.</p></div>';
        $f("f1-results").innerHTML = '<div class="f1-empty">Race results are not available yet.</div>';
      }
      if (drivers) {
        $f("f1-season-label").textContent = `${drivers.season} SEASON`;
        $f("f1-driver-standings").innerHTML = tableRows(drivers.DriverStandings || [], "drivers");
      }
      if (constructors) {
        $f("f1-constructor-season").textContent = `${constructors.season} SEASON`;
        $f("f1-constructor-standings").innerHTML = tableRows(constructors.ConstructorStandings || [], "constructors");
      }
      status.textContent = `Data updated ${new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})} · Jolpica-F1`;
    } catch (err) {
      status.textContent = "Could not reach the F1 data source. Check your connection and retry.";
      const note = '<div class="f1-empty">Live data could not be loaded. Use Refresh data to try again, or open the official F1 results links below.</div>';
      ["f1-results","f1-driver-standings","f1-constructor-standings"].forEach(id => { if ($f(id)) $f(id).innerHTML = note; });
      console.warn("Formula1 data unavailable:", err.message);
    } finally { refresh.disabled = false; }
  }
  refresh.addEventListener("click", load);
  load();
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
    if (event.target.closest("button") || win.dataset.expanded === "true") return;
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
  if (globalThis.crypto?.subtle) {
    const key = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits({
      name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256"
    }, key, 256);
    return bytesToHex(new Uint8Array(bits));
  }

  // Some browsers disable Web Crypto on locally opened file:// pages.
  // This fallback keeps the local demo usable; it is not for real account security.
  let out = `${bytesToHex(salt)}:${password}`;
  for (let round = 0; round < 12000; round++) {
    let a = 2166136261;
    for (let i = 0; i < out.length; i++) {
      a ^= out.charCodeAt(i);
      a = Math.imul(a, 16777619);
    }
    out = (a >>> 0).toString(16).padStart(8, "0") + out.slice(0, 24) + out.slice(-24);
  }
  return out;
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
      const salt = new Uint8Array(16);
      if (globalThis.crypto?.getRandomValues) crypto.getRandomValues(salt);
      else for (let i = 0; i < salt.length; i++) salt[i] = Math.floor(Math.random() * 256);
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
    authError.textContent = error.message || "Could not create the account. Check that browser storage is enabled, then try again.";
  } finally {
    authSubmit.disabled = false;
  }
});

setAuthMode();


const projectDetails = {"about": {"title": "hello world", "html": "\n<div class=\"hero\">\n<h1 aria-label=\"hello world\" class=\"hero-title\"><span aria-hidden=\"true\" class=\"typed\">hello world</span><span aria-hidden=\"true\" class=\"cursor\"></span></h1>\n<p class=\"hero-sub\">hey!! im akshat and this personal website has some things im working on and learning about</p>\n</div>\n<div class=\"group\">\n<h2>projects that ive done</h2>\n<ul>\n<li><a data-project-page=\"trading\" href=\"#\">trading terminal</a></li>\n<li><a data-project-page=\"antivirus\" href=\"#\">simple antivirus</a></li>\n<li><a data-project-page=\"console\" href=\"#\">breadboard console</a></li>\n<li><a data-project-page=\"smoke\" href=\"#\">smoke detector</a></li>\n<li><a data-project-page=\"parking\" href=\"#\">smart parking system</a></li>\n</ul>\n</div>\n<div class=\"group\">\n<h2>interests and stuff i want to build</h2>\n<ul>\n<li><a data-project-page=\"stocks\" href=\"#\">stock prediction ai</a></li>\n<li><a data-project-page=\"localai\" href=\"#\">local ai device</a></li>\n<li><a data-project-page=\"architecture\" href=\"#\">computer architecture</a></li>\n<li><a data-project-page=\"efficiency\" href=\"#\">hardware efficiency</a></li>\n<li><a data-project-page=\"aisystems\" href=\"#\">ai and systems</a></li>\n</ul>\n</div>\n"}, "stocks": {"title": "stock prediction ai", "html": "\n\n<h1>stock prediction ai</h1>\n<p>\n        a market research project im building to study market data and find patterns in it.\n      </p>\n<p>\n        im experimenting with things like market regimes and anomaly detection , so essentially it uses indicators as well as market news from around the world at very high frequency to find patterns in the market and predict movement , its a work in progress and im still learning and i wanna make it open source so others can learn too and contribute to it. im also trying to make it run on limited hardware like a raspberry pi or an old laptop so that it can be used by anyone without needing a powerful computer or a cloud server\n      </p>\n"}, "localai": {"title": "local ai device", "html": "\n\n<h1>local ai device</h1>\n<p>\n        its basically an idea for a small device that can run ai locally on limited hardware like a raspberry pi or an old laptop or perhaps an esp32 or something like that. the idea is to make it small, cheap and power efficient while still being useful.\n      </p>\n<p style=\"margin-top: 16px\">\n        im mainly interested in making it small, cheap and power efficient but also useful so i was thinking about using it to run a small local ai model for things like basic stock analysis but somehting thats pretty sophisticated and can run on limited hardware this links with the other project i mentioned about stock prediction <a data-project-page=\"stocks\" href=\"#\">here</a>\n</p>\n"}, "server": {"title": "self hosted stuff", "html": "\n\n<h1>self hosted stuff</h1>\n<p>\n        i run a small linux server for hosting things and testing projects.\n      </p>\n<div>\n<p>\n          mostly linux, docker and storing movies and shows and my minecraft servers!!\n        </p>\n</div>\n"}, "architecture": {"title": "computer architecture", "html": "\n\n<h1>computer architecture</h1>\n<p>\n        learning more about how computers work underneath the software\n      </p>\n<p>\n        like how cpus, gpus and memory work and how they affect performance and efficiency mostly i learn this stuff by myself thru yt videos and reading books\n      </p>\n"}, "efficiency": {"title": "hardware efficiency", "html": "\n\n<h1>hardware efficiency</h1>\n<p>\n        looking at how hardware can do more without using a ton of power.\n      </p>\n<p>\n        especially performance per watt and how hardware choices affect real workloads and how we can make hardware more effecient like i said before im tryna run a local ai model on an esp32 or a raspberry pi so im trying to learn how to modify the esp32 to make them more effecient (raspberry pi too!) and essentially make them run faster and better\n      </p>\n"}, "aisystems": {"title": "ai and systems", "html": "\n\n<h1>ai and systems</h1>\n<p>\n        learning about what happens when ai runs on actual hardware instead of just using an api\n      </p>\n<p>\n        really interested in local models, limited hardware and the software behind them and ai in general how it works and how we can make it better\n      </p>\n"}, "parking": {"title": "smart parking system", "html": "\n\n<h1>smart parking system</h1>\n<p>\n        a smart parking system using an arduino (later an esp32), two ir sensors and a servo motor. it tracks how many parking slots are full or empty and displays the count on the arduino serial monitor. the plan is to later show it on a webpage hosted by the esp32.\n      </p>\n"}, "smoke": {"title": "smoke detector", "html": "\n\n<h1>smoke detector</h1>\n<p>\n        a smoke detector using an mq-2 sensor. first, i used an arduino to show the presence of smoke in a room on the serial monitor. later, i connected it to the internet with an esp32, and eventually added a gsm module to send a text message to my phone.\n      </p>\n"}, "console": {"title": "breadboard console", "html": "\n\n<h1>breadboard console</h1>\n<p>\n        a breadboard console built with an arduino, a 16x2 alphanumeric lcd (later replaced with a 2-inch oled display), a breadboard and a couple of buttons. i built two games for it, similar to flappy bird and crossy road. i plan to build more simple games that can run on an arduino, like a simple racing game or snake. right now, im working on a home menu where you can select games and settings, and adding sound with a simple piezo buzzer. for the hardware, ive finished designing a custom case and a pcb for it. this project is one of my personal favourites and one that ill probably remember for a long time since i love gaming too. all the resources for my project, like the pcb design, the .stl file and the code, can be accessed <a class=\"github-link\" href=\"https://github.com/darthkenobi2407/arduino-game\">here</a>.\n      </p>\n"}, "antivirus": {"title": "simple antivirus", "html": "\n\n<h1>simple antivirus</h1>\n<p>\n        a very simple antivirus that uses hash matching with the virustotal api. it's pretty simple, but cool nevertheless. you can check it out <a class=\"github-link\" href=\"https://github.com/darthkenobi2407/verify-av-\">here</a>. it takes a file, calculates its hash and checks whether that hash is in the virustotal database. if it is, the file may be malicious; if it isnt, it hasnt been identified as malicious by that check. its a simple starting point for learning how antivirus software works, and it helped me understand the virustotal api and hash matching for detecting malicious files.\n      </p>\n"}, "trading": {"title": "trading terminal", "html": "\n\n<h1>trading terminal</h1>\n<p>i developed a trading terminal which has a lot of features, including:</p>\n<ul>\n<li>\n<strong>marketwatch:</strong> the default screen where the terminal starts. it monitors crypto coins like btc, sol, ada, doge and eth, tracking current price, algorithm score, signal, entry price, stoploss, takeprofit, unrealized p&amp;l and a mini graph. it also tracks us stocks such as nvda, tsla, appl, msft, amzn, meta, amd, pltr and nflx. this screen also displays open positions, portfolio summary, signal scanner, order flow, account info, scrolling ticker prices and alerts.\n\n          <figure class=\"project-shot\"><img src=\"https://darthkenobi2407.github.io/personal-site/images/trading-marketwatch.png\" alt=\"Trading terminal marketwatch screen\" loading=\"lazy\" onerror=\"this.closest(\'figure\').classList.add(\'image-missing\');this.remove()\"><figcaption>marketwatch</figcaption><span class=\"project-image-fallback\">marketwatch screenshot is unavailable</span></figure>\n</li>\n<li>\n<strong>positions:</strong> shows the symbol, side (long/short), entry price, current price, p&amp;l, stoploss, takeprofit, target and size of trades.\n\n          <figure class=\"project-shot\"><img src=\"https://darthkenobi2407.github.io/personal-site/images/trading-positions.png\" alt=\"Trading terminal positions screen\" loading=\"lazy\" onerror=\"this.closest(\'figure\').classList.add(\'image-missing\');this.remove()\"><figcaption>positions</figcaption><span class=\"project-image-fallback\">positions screenshot is unavailable</span></figure>\n</li>\n<li>\n<strong>orders:</strong> shows a list of executed trades and pending orders. this feature is not fully implemented yet.\n        </li>\n<li>\n<strong>scanner:</strong> finds assets with the strongest trading signals, separates crypto and equities, and displays active signals.\n        </li>\n<li>\n<strong>world map (personal favourite):</strong> opens a dedicated interactive world map built with jsvectormap. you can select countries to load market information, including the major stock index and its price, gold price, silver price, crude oil price and, most importantly, recent local news.\n\n          <figure class=\"project-shot\"><img src=\"https://darthkenobi2407.github.io/personal-site/images/trading-world-map.png\" alt=\"Trading terminal interactive world map\" loading=\"lazy\" onerror=\"this.closest(\'figure\').classList.add(\'image-missing\');this.remove()\"><figcaption>interactive world map</figcaption><span class=\"project-image-fallback\">interactive world map screenshot is unavailable</span></figure>\n</li>\n<li>\n<strong>feeds:</strong> shows the status of all internal data and services.\n        </li>\n<li>\n<strong>risk:</strong> displays the risk profile, including risk per trade, capital deployment, reserve capital, stoploss, takeprofit, trailing stop and position exposure. this section is still being built.\n        </li>\n<li>\n<strong>news:</strong> a specialized section for news articles from around the world.\n        </li>\n</ul>\n<p>\n        this project uses python and the following libraries: yfinance, websockets, requests, pandas and rich, and also many standard libraries including asyncio, time, msvcrt and so on.\n      </p>\n<p>\n        you can access the documentation <a class=\"github-link\" href=\"https://github.com/darthkenobi2407/trading-terminal-beta-\">here</a>.\n      </p>\n"}};

document.addEventListener("click", event => {
  const win = event.target.closest('[data-window="website"]');
  if (!win) return;
  const back = event.target.closest('[data-project-back]');
  if (back) { renderProjectsHome(win); return; }
  const pick = event.target.closest('[data-project], [data-project-page]');
  if (!pick) return;
  const key = pick.dataset.project || pick.dataset.projectPage;
  if (projectDetails[key]) { renderProjectPage(win, key); event.preventDefault(); }
});
function renderProjectsHome(win) {
  const body = win.querySelector('.window-body');
  body.innerHTML = apps.website.html;
}
function renderProjectPage(win, key) {
  const item = projectDetails[key];
  if (!item) return;
  const body = win.querySelector('.window-body');
  body.innerHTML = `<div class="projects-detail"><button class="project-back" type="button" data-project-back>← back to projects</button><div class="projects-eyebrow">MY PROJECTS</div><h1>${escapeProjectText(item.title)}</h1><div class="projects-copy">${item.html}</div><button class="project-back bottom-back" type="button" data-project-back>← back to projects</button></div>`;
}
function escapeProjectText(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
