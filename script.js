const loginScreen = document.querySelector('#loginScreen');
const desktop = document.querySelector('#desktop');
const loginForm = document.querySelector('#loginForm');
const loginError = document.querySelector('#loginError');
const windows = document.querySelector('#windows');
const taskButtons = document.querySelector('#taskButtons');
let z = 10;

const apps = {
  dashboard: {
    title: 'Dashboard',
    icon: '📊',
    html: `<h2>Übersicht</h2><div class="card-grid"><div class="stat"><b>24</b>Besuche</div><div class="stat"><b>7</b>Aufgaben</div><div class="stat"><b>3</b>Nachrichten</div><div class="stat"><b>98%</b>Status</div></div>`
  },
  notes: {
    title: 'Notizen',
    icon: '📝',
    html: `<h2>Notizen</h2><textarea id="noteBox" placeholder="Schreibe etwas..."></textarea><div class="row"><button class="app-btn" onclick="saveNote()">Speichern</button><button class="app-btn" onclick="loadNote()">Laden</button></div><p id="noteStatus"></p>`
  },
  tasks: {
    title: 'Aufgaben',
    icon: '✅',
    html: `<h2>Aufgaben</h2><div class="row"><input id="taskInput" placeholder="Neue Aufgabe"><button class="app-btn" onclick="addTask()">Hinzufügen</button></div><ul id="taskList"></ul>`
  },
  files: {
    title: 'Dateien',
    icon: '📁',
    html: `<h2>Dateimanager</h2><div class="file">📄 Angebot.pdf</div><div class="file">🖼️ Logo.png</div><div class="file">📊 Umsatz.xlsx</div><p>Demo-Dateien. Hier könnte später ein echter Upload eingebaut werden.</p>`
  },
  settings: {
    title: 'Einstellungen',
    icon: '⚙️',
    html: `<h2>Einstellungen</h2><p>Desktop-Hintergrund ändern:</p><div class="row"><button class="app-btn" onclick="setTheme('blue')">Blau</button><button class="app-btn" onclick="setTheme('dark')">Dunkel</button><button class="app-btn" onclick="setTheme('violet')">Violett</button></div>`
  }
};

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const user = document.querySelector('#username').value.trim();
  const pass = document.querySelector('#password').value.trim();
  if (user === 'admin' && pass === '1234') {
    loginScreen.classList.add('hidden');
    desktop.classList.remove('hidden');
  } else {
    loginError.textContent = 'Falscher Benutzername oder falsches Passwort.';
  }
});

document.querySelector('#logoutBtn').addEventListener('click', () => {
  desktop.classList.add('hidden');
  loginScreen.classList.remove('hidden');
});

document.querySelectorAll('.desktop-icon').forEach(icon => {
  icon.addEventListener('dblclick', () => openApp(icon.dataset.app));
  icon.addEventListener('click', () => openApp(icon.dataset.app));
});

function openApp(appKey) {
  const app = apps[appKey];
  const existing = document.querySelector(`[data-window="${appKey}"]`);
  if (existing) { existing.style.zIndex = ++z; return; }

  const win = document.createElement('article');
  win.className = 'window';
  win.dataset.window = appKey;
  win.style.zIndex = ++z;
  win.style.left = `${280 + Math.random() * 180}px`;
  win.style.top = `${80 + Math.random() * 120}px`;
  win.innerHTML = `
    <header class="window-header">
      <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
      <span class="window-title">${app.icon} ${app.title}</span>
      <button class="close" onclick="closeApp('${appKey}')">×</button>
    </header>
    <section class="window-content">${app.html}</section>`;
  windows.appendChild(win);
  makeDraggable(win);
  addTaskButton(appKey, app);
  if (appKey === 'tasks') renderTasks();
}

function closeApp(appKey) {
  document.querySelector(`[data-window="${appKey}"]`)?.remove();
  document.querySelector(`[data-task="${appKey}"]`)?.remove();
}

function addTaskButton(appKey, app) {
  const btn = document.createElement('button');
  btn.textContent = `${app.icon} ${app.title}`;
  btn.dataset.task = appKey;
  btn.onclick = () => openApp(appKey);
  taskButtons.appendChild(btn);
}

function makeDraggable(win) {
  const header = win.querySelector('.window-header');
  let offsetX = 0, offsetY = 0, dragging = false;
  header.addEventListener('mousedown', e => {
    dragging = true; win.style.zIndex = ++z;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    win.style.left = `${e.clientX - offsetX}px`;
    win.style.top = `${e.clientY - offsetY}px`;
  });
  window.addEventListener('mouseup', () => dragging = false);
}

function saveNote() {
  localStorage.setItem('portalNote', document.querySelector('#noteBox').value);
  document.querySelector('#noteStatus').textContent = 'Notiz gespeichert.';
}
function loadNote() {
  document.querySelector('#noteBox').value = localStorage.getItem('portalNote') || '';
  document.querySelector('#noteStatus').textContent = 'Notiz geladen.';
}

function getTasks() { return JSON.parse(localStorage.getItem('portalTasks') || '[]'); }
function setTasks(tasks) { localStorage.setItem('portalTasks', JSON.stringify(tasks)); }
function addTask() {
  const input = document.querySelector('#taskInput');
  if (!input.value.trim()) return;
  setTasks([...getTasks(), input.value.trim()]);
  input.value = '';
  renderTasks();
}
function removeTask(index) {
  const tasks = getTasks(); tasks.splice(index, 1); setTasks(tasks); renderTasks();
}
function renderTasks() {
  const list = document.querySelector('#taskList');
  if (!list) return;
  list.innerHTML = getTasks().map((task, i) => `<li>${task} <button onclick="removeTask(${i})">löschen</button></li>`).join('');
}

function setTheme(theme) {
  const bg = {
    blue: 'radial-gradient(circle at 70% 20%, rgba(56,189,248,.35), transparent 25%), linear-gradient(135deg, #172554, #020617 70%)',
    dark: 'linear-gradient(135deg, #020617, #111827)',
    violet: 'radial-gradient(circle at 70% 20%, rgba(168,85,247,.38), transparent 25%), linear-gradient(135deg, #312e81, #020617 70%)'
  };
  desktop.style.background = bg[theme];
}

setInterval(() => {
  document.querySelector('#clock').textContent = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}, 1000);
