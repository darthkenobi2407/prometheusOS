const clk = document.getElementById("clock");

const bruh = document.getElementById("windows");

const mnuPop = document.getElementById("menu-popovers");

const curApp = document.getElementById("current-app-name");




function tick() {

  clk.textContent = new Date().toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

}

tick();

setInterval(tick, 1000);




const brand = document.querySelector(".brand-mark") || document.querySelector(".brand-menu");

if (brand) brand.textContent = "home";




const icoTxt = {

  "notes-icon": "n",

  "terminal-icon": "T",

  "f1-icon": "f1",

  "about-icon": "a",

  "website-icon": "m"

};

Object.entries(icoTxt).forEach(([k, v]) => {

  document.querySelectorAll("." + k).forEach(el => { el.textContent = v; });

});




document.querySelectorAll(".menu-trigger").forEach(btn => {

  const keep = btn.classList.contains("brand-menu") || btn.dataset.menu === "help";

  if (!keep) btn.remove();

});




const homie = {

  notes: {

    title: "Notes",

    html: '<h2>Notes</h2><p>Your notes are saved in this browser.</p><textarea id="notes" placeholder="Write something..."></textarea>'

  },

  terminal: {

    title: "Terminal",

    html: '<h2>Terminal</h2><p>Try: help, date, or clear.</p><div class="terminal-output" id="output"></div><input class="terminal-input" id="command" placeholder="Type a command and press Enter">'

  },

  about: {

    title: "About This Computer",

    html: '<p>i believe that computers are our guide and path to the future , just as how prometheus brought fire to humanity , allowing it to advance forward , so will computers .</p><p>this is the first build and ive worked on mainly the desktop environemtn and design and creating the overall ui</p>'

  },

  formula1: {

    title: "Formula 1",

    html: `<div class="f1-page">
      <h2>Formula 1</h2>
      <p id="f1-status"></p>
      <h3>latest race</h3>
      <p id="f1-race"></p>
      <table><thead><tr><th>pos</th><th>driver</th><th>team</th><th>time / status</th></tr></thead><tbody id="f1-res"></tbody></table>
      <h3>drivers</h3>
      <table><thead><tr><th>pos</th><th>driver</th><th>team</th><th>pts</th></tr></thead><tbody id="f1-drv"></tbody></table>
      <h3>constructors</h3>
      <table><thead><tr><th>pos</th><th>team</th><th>country</th><th>pts</th></tr></thead><tbody id="f1-con"></tbody></table>
    </div>`

  },

  website: {

    title: "Personal Site",

    html: `<iframe
      src="https://personal-site-delta-amber.vercel.app/"
      title="Personal Site"
      style="width:100%;height:100%;border:0"
    ></iframe>`

  }

};




const mnu = {

  system: [

    { label: "About This Computer", action: () => opApp("about") }

  ],

  help: [

    { label: "About PrometheusOS", action: () => opApp("about") }

  ]

};




let actMnu = null;

let zTop = 4;




document.querySelectorAll("[data-app]").forEach(btn => {

  btn.addEventListener("click", () => {

    if (btn.closest(".desktop-icons")) {

      document.querySelectorAll(".desktop-icons button").forEach(ic => ic.classList.remove("selected"));

      btn.classList.add("selected");

    }

    opApp(btn.dataset.app);

  });

});




const dawg = document.querySelector(".desktop-icons");

let icMnu;




dawg?.querySelectorAll("[data-app]").forEach(btn => {

  btn.addEventListener("contextmenu", e => {

    e.preventDefault();

    e.stopPropagation();

    showIc(btn, e.clientX, e.clientY);

  });

  btn.addEventListener("keydown", e => {

    if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {

      e.preventDefault();

      const r = btn.getBoundingClientRect();

      showIc(btn, r.left + r.width, r.top + 10);

    }

  });

});




document.addEventListener("click", e => {

  if (icMnu && !icMnu.contains(e.target)) {

    icMnu.remove();

    icMnu = null;

  }

});




document.addEventListener("keydown", e => {

  if (e.key === "Escape" && icMnu) { icMnu.remove(); icMnu = null; }

});




function showIc(btn, x, y) {

  icMnu?.remove();

  document.querySelectorAll(".desktop-icons button").forEach(ic => ic.classList.toggle("selected", ic === btn));

  const nm = btn.dataset.app;

  const lbls = { notes: "Notes", terminal: "Terminal", about: "About This Computer", website: "My Projects", formula1: "Formula1" };

  icMnu = document.createElement("div");

  icMnu.className = "desktop-context";

  icMnu.setAttribute("role", "menu");

  const add = (label, action) => {

    const it = document.createElement("button");

    it.textContent = label;

    it.setAttribute("role", "menuitem");

    it.addEventListener("click", () => { icMnu?.remove(); icMnu = null; action(); });

    icMnu.appendChild(it);

  };

  add("Open " + lbls[nm], () => opApp(nm));

  const ln = document.createElement("div");

  ln.className = "context-line";

  icMnu.appendChild(ln);

  add("Get Info", () => msg(lbls[nm], "Application: " + lbls[nm] + "\nDouble-click is not required — select the icon to open this app. This app is part of PrometheusOS."));

  add("Refresh Desktop", () => {

    document.querySelectorAll(".desktop-icons button").forEach(ic => ic.classList.remove("selected"));

    btn.classList.add("selected");

  });

  document.body.appendChild(icMnu);

  icMnu.style.left = Math.min(x, window.innerWidth - 190) + "px";

  icMnu.style.top = Math.min(y, window.innerHeight - 120) + "px";

}




document.querySelectorAll(".menu-trigger").forEach(btn => {

  btn.addEventListener("click", e => {

    e.stopPropagation();

    const nm = btn.dataset.menu;

    if (actMnu === nm) { clMnu(); return; }

    opMnu(nm, btn);

  });

});




document.addEventListener("click", e => {

  if (!e.target.closest(".menu-dropdown")) clMnu();

});

document.addEventListener("keydown", e => {

  if (e.key === "Escape") clMnu();

});




function opMnu(nm, trig) {

  clMnu();

  actMnu = nm;

  trig.setAttribute("aria-expanded", "true");

  const dd = document.createElement("div");

  dd.className = "menu-dropdown";

  if (trig.classList.contains("brand-menu")) dd.classList.add("system-dropdown");

  const tr = trig.getBoundingClientRect();

  dd.style.left = `${Math.max(0, tr.left)}px`;

  dd.setAttribute("role", "menu");

  mnu[nm].forEach(it => {

    if (it.separator) {

      const ln = document.createElement("div");

      ln.className = "menu-separator";

      dd.appendChild(ln);

      return;

    }

    const op = document.createElement("button");

    op.textContent = it.label;

    op.setAttribute("role", "menuitem");

    if (it.disabled) { op.disabled = true; op.className = "disabled"; }

    op.addEventListener("click", () => {

      clMnu();

      if (!it.disabled && it.action) it.action();

    });

    dd.appendChild(op);

  });

  mnuPop.appendChild(dd);

}




function clMnu() {

  document.querySelectorAll(".menu-trigger[aria-expanded='true']").forEach(btn => btn.setAttribute("aria-expanded", "false"));

  mnuPop.replaceChildren();

  actMnu = null;

}




function opApp(nm) {

  const old = document.querySelector(`[data-window="${nm}"]`);

  if (old) {

    old.hidden = false;

    focW(old);

    return;

  }

  const a = homie[nm];

  if (!a) return;

  const w = document.createElement("section");

  w.className = "window";

  w.dataset.window = nm;

  w.innerHTML = `
    <div class="window-bar">
      <span class="window-title">${a.title}</span>
      <button class="close" aria-label="Close">X</button>
    </div>
    <div class="window-body">${a.html}</div>
  `;

  bruh.appendChild(w);

  if (nm === "website" || nm === "formula1") {

    w.classList.add(nm === "website" ? "website-window" : "formula1-window");

    w.style.width = "min(1000px, calc(100vw - 32px))";

    w.style.height = "min(760px, calc(100vh - 120px))";

    w.style.left = "40px";

    w.style.top = "70px";

    w.style.transform = "none";

  }

  focW(w);

  w.addEventListener("pointerdown", () => focW(w));

  w.querySelector(".close").addEventListener("click", () => { w.remove(); upAct(); });

  drag(w);

  if (nm === "formula1") doF1(w);

  if (nm === "notes") {

    const ar = w.querySelector("#notes");

    ar.value = localStorage.getItem("prometheusNotes") || "";

    ar.addEventListener("input", () => localStorage.setItem("prometheusNotes", ar.value));

  }

  if (nm === "terminal") {

    const inp = w.querySelector("#command");

    const out = w.querySelector("#output");

    inp.addEventListener("keydown", e => {

      if (e.key !== "Enter") return;

      const raw = inp.value.trim();

      const cmd = raw.toLowerCase();

      let res = "";

      const alias = {

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

      const nm2 = cmd.startsWith("open ") ? cmd.slice(5).trim() : cmd;

      if (cmd === "help") {

        res = "Commands: help, date, clear, open <app>\nApps: Notes, Terminal, About, My Projects, Formula1\nYou can also type an app name directly (e.g. formula1 or notes).";

      } else if (cmd === "date") {

        res = new Date().toString();

      } else if (cmd === "clear") {

        out.textContent = "";

      } else if (alias[nm2]) {

        const tgt = alias[nm2];

        out.textContent += `> ${raw}\nOpening ${homie[tgt].title}...\n`;

        inp.value = "";

        opApp(tgt);

        return;

      } else if (cmd) {

        res = `Unknown command: ${raw}. Type help to see available commands.`;

      }

      if (res) out.textContent += `> ${raw}\n${res}\n`;

      inp.value = "";

    });

  }

}




async function doF1(w) {

  const pick = id => w.querySelector("#" + id);

  const api = "https://api.jolpi.ca/ergast/f1";

  const grab = async p => {

    const r = await fetch(api + "/" + p + ".json?limit=100");

    if (!r.ok) throw new Error("nope");

    return r.json();

  };

  const esc = v => String(v ?? "-").replace(/[&<>"']/g, c => ({

    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"

  }[c]));

  const mk = (ls, k) => {

    if (!ls || !ls.length) return '<tr><td colspan="4">no data dawg</td></tr>';

    return ls.map((it, i) => {

      if (k === "race") return `<tr><td>${esc(it.position || i + 1)}</td><td>${esc(it.Driver.givenName + " " + it.Driver.familyName)}</td><td>${esc(it.Constructor.name)}</td><td>${esc(it.Time?.time || it.status || it.points + " pts")}</td></tr>`;

      if (k === "drv") {

        const d = it.Driver;

        const t = (it.Constructors || []).map(c => c.name).join(", ");

        return `<tr><td>${esc(it.position || i + 1)}</td><td>${esc(d.givenName + " " + d.familyName)}</td><td>${esc(t)}</td><td>${esc(it.points)}</td></tr>`;

      }

      return `<tr><td>${esc(it.position || i + 1)}</td><td>${esc(it.Constructor.name)}</td><td>${esc(it.Constructor.nationality)}</td><td>${esc(it.points)}</td></tr>`;

    }).join("");

  };

  const go = async () => {

    try {

      const [r1, r2, r3] = await Promise.all([

        grab("current/last/results"),

        grab("current/driverStandings"),

        grab("current/constructorStandings")

      ]);

      const race = r1?.MRData?.RaceTable?.Races?.[0];

      const drv = r2?.MRData?.StandingsTable?.StandingsLists?.[0];

      const con = r3?.MRData?.StandingsTable?.StandingsLists?.[0];

      pick("f1-race").textContent = race ? race.raceName + " — " + race.date : "no race";

      pick("f1-res").innerHTML = mk(race?.Results, "race");

      pick("f1-drv").innerHTML = mk(drv?.DriverStandings, "drv");

      pick("f1-con").innerHTML = mk(con?.ConstructorStandings, "con");

    } catch (e) {

      pick("f1-status").textContent = "couldnt load bruh";

    }

  };

  go();

}




function focW(w) {

  w.style.zIndex = String(++zTop);

  curApp.textContent = w.dataset.window === "message"

    ? (w.querySelector(".window-title")?.textContent || "")

    : (homie[w.dataset.window]?.title || "");

}




function upAct() {

  const fr = gtFr();

  curApp.textContent = fr

    ? (fr.dataset.window === "message"

      ? (fr.querySelector(".window-title")?.textContent || "")

      : (homie[fr.dataset.window]?.title || ""))

    : "";

}




function clFr() { const w = gtFr(); if (w) w.remove(); upAct(); }

function mnFr() { const w = gtFr(); if (w) w.hidden = true; upAct(); }

function gtFr() {

  return [...bruh.querySelectorAll(".window:not([hidden])")].sort((a, b) => Number(b.style.zIndex || 4) - Number(a.style.zIndex || 4))[0];

}

function clAl() { bruh.replaceChildren(); upAct(); }

function brAl() { [...bruh.querySelectorAll(".window:not([hidden])")].forEach(focW); }




function msg(t, m) {

  const old = document.querySelector('[data-window="message"]');

  if (old) old.remove();

  const w = document.createElement("section");

  w.className = "window message-window";

  w.dataset.window = "message";

  w.style.height = "190px";

  w.innerHTML = `
    <div class="window-bar">
      <span class="window-title">${t}</span>
      <button class="close" aria-label="Close">X</button>
    </div>
    <div class="window-body"><p>${m}</p></div>
  `;

  bruh.appendChild(w);

  focW(w);

  w.querySelector(".close").addEventListener("click", () => { w.remove(); upAct(); });

  drag(w);

}




function drag(w) {

  const bar = w.querySelector(".window-bar");

  let movin = false;

  let dx = 0, dy = 0;

  bar.addEventListener("pointerdown", e => {

    if (e.target.closest("button")) return;

    movin = true;

    focW(w);

    const r = w.getBoundingClientRect();

    dx = e.clientX - r.left;

    dy = e.clientY - r.top;

    bar.setPointerCapture(e.pointerId);

    e.preventDefault();

  });

  bar.addEventListener("pointermove", e => {

    if (!movin) return;

    const p = bruh.getBoundingClientRect();

    w.style.left = (e.clientX - p.left - dx) + "px";

    w.style.top = (e.clientY - p.top - dy) + "px";

  });

  bar.addEventListener("pointerup", () => { movin = false; });

  bar.addEventListener("pointercancel", () => { movin = false; });

}
