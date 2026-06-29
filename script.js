const loginScreen = document.querySelector('#loginScreen');
const desktop = document.querySelector('#desktop');
const loginForm = document.querySelector('#loginForm');
const loginError = document.querySelector('#loginError');
const windows = document.querySelector('#windows');
const taskButtons = document.querySelector('#taskButtons');
let z = 10;

const registerHtml = `
  <h2>Register-Service</h2>
  <p class="notice"><b>Demo-Modul:</b> Dies ist kein offizielles Behördenportal. Es simuliert einen Antrag, speichert Daten nur lokal im Browser und verlinkt am Ende auf das offizielle Online-Portal.</p>
  <div class="steps"><span class="step active">1 Antrag</span><span class="step">2 Person</span><span class="step">3 Zweck</span><span class="step">4 Zusammenfassung</span></div>
  <div class="portal-grid">
    <form id="registerForm" class="panel">
      <h3>Antragsdaten</h3>
      <label>Art des Dokuments
        <select id="docType">
          <option>Privates Führungszeugnis</option>
          <option>Erweitertes Führungszeugnis</option>
          <option>Behördliches Führungszeugnis</option>
          <option>Europäisches Führungszeugnis</option>
          <option>Gewerbezentralregister-Auskunft</option>
        </select>
      </label>
      <div class="card-grid">
        <label>Vorname <input id="firstName" placeholder="Max"></label>
        <label>Nachname <input id="lastName" placeholder="Mustermann"></label>
      </div>
      <div class="card-grid">
        <label>Geburtsdatum <input id="birthDate" type="date"></label>
        <label>Staatsangehörigkeit <input id="nationality" placeholder="Deutsch"></label>
      </div>
      <label>Anschrift <input id="address" placeholder="Straße, PLZ Ort"></label>
      <label>Verwendungszweck / Empfänger
        <textarea id="purpose" placeholder="z.B. Bewerbung, Ehrenamt, Behörde, Aktenzeichen..."></textarea>
      </label>
      <label><input id="eidReady" type="checkbox" style="width:auto;margin-right:8px"> Online-Ausweisfunktion/eID vorhanden</label>
      <label><input id="volunteer" type="checkbox" style="width:auto;margin-right:8px"> Ehrenamtlicher Zweck / mögliche Gebührenbefreiung prüfen</label>
      <div class="row"><button type="button" class="app-btn" onclick="generateRegisterSummary()">Zusammenfassung erzeugen</button><button type="button" class="muted-btn" onclick="saveRegisterDraft()">Entwurf speichern</button><button type="button" class="muted-btn" onclick="loadRegisterDraft()">Entwurf laden</button></div>
      <p id="registerStatus"></p>
    </form>
    <aside class="panel">
      <h3>Checkliste</h3>
      <ul>
        <li>Personalausweis, eID-Karte oder elektronischer Aufenthaltstitel</li>
        <li>Freigeschaltete Online-Ausweisfunktion mit PIN</li>
        <li>Bei erweitertem Führungszeugnis: schriftliche Aufforderung der Stelle</li>
        <li>Bei behördlichem Führungszeugnis: genaue Behördenanschrift/Aktenzeichen</li>
        <li>Zahlungsmittel bereithalten, sofern keine Befreiung greift</li>
      </ul>
      <h3>Status-Simulation</h3>
      <div class="file">🟡 Entwurf angelegt</div>
      <div class="file">⚪ Identität prüfen</div>
      <div class="file">⚪ Antrag übermitteln</div>
      <div class="file">⚪ Bearbeitung / Versand</div>
      <button class="app-btn" onclick="openOfficialRegisterPortal()">Offizielles Portal öffnen</button>
    </aside>
  </div>
  <h3>Zusammenfassung</h3>
  <pre id="registerSummary" class="summary">Noch keine Zusammenfassung erzeugt.</pre>`;

const apps = {
  register: { title: 'Register-Service', icon: '🛡️', large: true, html: registerHtml },
  dashboard: { title: 'Dashboard', icon: '📊', html: `<h2>Übersicht</h2><div class="card-grid"><div class="stat"><b>24</b>Besuche</div><div class="stat"><b>7</b>Aufgaben</div><div class="stat"><b>3</b>Nachrichten</div><div class="stat"><b>98%</b>Status</div></div>` },
  notes: { title: 'Notizen', icon: '📝', html: `<h2>Notizen</h2><textarea id="noteBox" placeholder="Schreibe etwas..."></textarea><div class="row"><button class="app-btn" onclick="saveNote()">Speichern</button><button class="app-btn" onclick="loadNote()">Laden</button></div><p id="noteStatus"></p>` },
  tasks: { title: 'Aufgaben', icon: '✅', html: `<h2>Aufgaben</h2><div class="row"><input id="taskInput" placeholder="Neue Aufgabe"><button class="app-btn" onclick="addTask()">Hinzufügen</button></div><ul id="taskList"></ul>` },
  files: { title: 'Dateien', icon: '📁', html: `<h2>Dateimanager</h2><div class="file">📄 Antrag-Entwurf.txt</div><div class="file">🖼️ Logo.png</div><div class="file">📊 Auswertung.xlsx</div><p>Demo-Dateien. Hier könnte später ein echter Upload eingebaut werden.</p>` },
  settings: { title: 'Einstellungen', icon: '⚙️', html: `<h2>Einstellungen</h2><p>Desktop-Hintergrund ändern:</p><div class="row"><button class="app-btn" onclick="setTheme('blue')">Blau</button><button class="app-btn" onclick="setTheme('dark')">Dunkel</button><button class="app-btn" onclick="setTheme('violet')">Violett</button></div>` }
};

loginForm.addEventListener('submit', (event) => { event.preventDefault(); const user = document.querySelector('#username').value.trim(); const pass = document.querySelector('#password').value.trim(); if (user === 'admin' && pass === '1234') { loginScreen.classList.add('hidden'); desktop.classList.remove('hidden'); } else { loginError.textContent = 'Falscher Benutzername oder falsches Passwort.'; } });
document.querySelector('#logoutBtn').addEventListener('click', () => { desktop.classList.add('hidden'); loginScreen.classList.remove('hidden'); });
document.querySelectorAll('.desktop-icon').forEach(icon => { icon.addEventListener('dblclick', () => openApp(icon.dataset.app)); icon.addEventListener('click', () => openApp(icon.dataset.app)); });

function openApp(appKey) { const app = apps[appKey]; const existing = document.querySelector(`[data-window="${appKey}"]`); if (existing) { existing.style.zIndex = ++z; return; } const win = document.createElement('article'); win.className = `window ${app.large ? 'large' : ''}`; win.dataset.window = appKey; win.style.zIndex = ++z; win.style.left = `${260 + Math.random() * 120}px`; win.style.top = `${70 + Math.random() * 80}px`; win.innerHTML = `<header class="window-header"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="window-title">${app.icon} ${app.title}</span><button class="close" onclick="closeApp('${appKey}')">×</button></header><section class="window-content">${app.html}</section>`; windows.appendChild(win); makeDraggable(win); addTaskButton(appKey, app); if (appKey === 'tasks') renderTasks(); if (appKey === 'register') loadRegisterDraft(); }
function closeApp(appKey) { document.querySelector(`[data-window="${appKey}"]`)?.remove(); document.querySelector(`[data-task="${appKey}"]`)?.remove(); }
function addTaskButton(appKey, app) { if (document.querySelector(`[data-task="${appKey}"]`)) return; const btn = document.createElement('button'); btn.textContent = `${app.icon} ${app.title}`; btn.dataset.task = appKey; btn.onclick = () => openApp(appKey); taskButtons.appendChild(btn); }
function makeDraggable(win) { const header = win.querySelector('.window-header'); let offsetX = 0, offsetY = 0, dragging = false; header.addEventListener('mousedown', e => { dragging = true; win.style.zIndex = ++z; offsetX = e.clientX - win.offsetLeft; offsetY = e.clientY - win.offsetTop; }); window.addEventListener('mousemove', e => { if (!dragging) return; win.style.left = `${e.clientX - offsetX}px`; win.style.top = `${e.clientY - offsetY}px`; }); window.addEventListener('mouseup', () => dragging = false); }
function saveNote() { localStorage.setItem('portalNote', document.querySelector('#noteBox').value); document.querySelector('#noteStatus').textContent = 'Notiz gespeichert.'; }
function loadNote() { document.querySelector('#noteBox').value = localStorage.getItem('portalNote') || ''; document.querySelector('#noteStatus').textContent = 'Notiz geladen.'; }
function getTasks() { return JSON.parse(localStorage.getItem('portalTasks') || '[]'); } function setTasks(tasks) { localStorage.setItem('portalTasks', JSON.stringify(tasks)); } function addTask() { const input = document.querySelector('#taskInput'); if (!input.value.trim()) return; setTasks([...getTasks(), input.value.trim()]); input.value = ''; renderTasks(); } function removeTask(index) { const tasks = getTasks(); tasks.splice(index, 1); setTasks(tasks); renderTasks(); } function renderTasks() { const list = document.querySelector('#taskList'); if (!list) return; list.innerHTML = getTasks().map((task, i) => `<li>${task} <button onclick="removeTask(${i})">löschen</button></li>`).join(''); }
function setTheme(theme) { const bg = { blue: 'radial-gradient(circle at 70% 20%, rgba(56,189,248,.35), transparent 25%), linear-gradient(135deg, #172554, #020617 70%)', dark: 'linear-gradient(135deg, #020617, #111827)', violet: 'radial-gradient(circle at 70% 20%, rgba(168,85,247,.38), transparent 25%), linear-gradient(135deg, #312e81, #020617 70%)' }; desktop.style.background = bg[theme]; }
function getRegisterData() { return ['docType','firstName','lastName','birthDate','nationality','address','purpose','eidReady','volunteer'].reduce((obj, id) => { const el = document.querySelector('#' + id); obj[id] = el?.type === 'checkbox' ? el.checked : el?.value || ''; return obj; }, {}); }
function setRegisterData(data) { Object.entries(data || {}).forEach(([id, value]) => { const el = document.querySelector('#' + id); if (!el) return; if (el.type === 'checkbox') el.checked = !!value; else el.value = value; }); }
function generateRegisterSummary() { const d = getRegisterData(); const fee = d.volunteer ? 'Gebührenbefreiung prüfen, sonst regelmäßig 13,00 €' : 'regelmäßig 13,00 €'; const missing = ['firstName','lastName','birthDate','address'].filter(k => !d[k]).map(k => ({firstName:'Vorname',lastName:'Nachname',birthDate:'Geburtsdatum',address:'Anschrift'}[k])); document.querySelector('#registerSummary').textContent = `Dokument: ${d.docType}\nName: ${d.firstName || '-'} ${d.lastName || '-'}\nGeburtsdatum: ${d.birthDate || '-'}\nStaatsangehörigkeit: ${d.nationality || '-'}\nAnschrift: ${d.address || '-'}\nZweck/Empfänger: ${d.purpose || '-'}\nOnline-Ausweisfunktion: ${d.eidReady ? 'vorhanden' : 'nicht bestätigt'}\nKostenhinweis: ${fee}\n\nPrüfung: ${missing.length ? 'Es fehlen noch: ' + missing.join(', ') : 'Grunddaten vollständig.'}\nNächster Schritt: Daten prüfen und den offiziellen Online-Antrag öffnen.`; document.querySelector('#registerStatus').textContent = 'Zusammenfassung erzeugt.'; }
function saveRegisterDraft() { localStorage.setItem('registerDraft', JSON.stringify(getRegisterData())); document.querySelector('#registerStatus').textContent = 'Entwurf lokal gespeichert.'; }
function loadRegisterDraft() { const raw = localStorage.getItem('registerDraft'); if (!raw) return; setRegisterData(JSON.parse(raw)); const s = document.querySelector('#registerStatus'); if (s) s.textContent = 'Entwurf geladen.'; }
function openOfficialRegisterPortal() { window.open('https://www.fuehrungszeugnis.bund.de/', '_blank', 'noopener'); }
setInterval(() => { document.querySelector('#clock').textContent = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); }, 1000);
