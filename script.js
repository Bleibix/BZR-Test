const loginScreen = document.querySelector('#loginScreen');
const desktop = document.querySelector('#desktop');
const loginForm = document.querySelector('#loginForm');
const loginError = document.querySelector('#loginError');
const windows = document.querySelector('#windows');
const taskButtons = document.querySelector('#taskButtons');
const currentUserLabel = document.querySelector('#currentUser');
let currentUser = '';
let z = 10;

const demoUsers = [
  { username: 'KMBD', password: 'ausbilder1', name: 'KMBD Ausbilder', role: 'Ausbilder' },
  { username: 'admin', password: '1234', name: 'Portal Admin', role: 'Administrator' },
  { username: 'beamter', password: 'demo123', name: 'KMBD Beamter', role: 'Beamter' }
];

const formTemplates = {
  kb01: { title: 'KB-01 Einsatzbericht', intro: 'Dokumentation eines abgeschlossenen Einsatzes.', fields: ['Einsatzdatum', 'Einsatznummer', 'Einsatzzeit Beginn', 'Einsatzzeit Ende', 'Einsatzort / Adresse', 'Zuständige Dienststelle', 'Einsatzleiter', 'Beteiligte Kräfte', 'Kurzbeschreibung Lage', 'Durchgeführte Maßnahmen', 'Ergebnis', 'Schäden / Besonderheiten', 'Unterschrift Einsatzleitung'] },
  kb02: { title: 'KB-02 Kitverwendungsprotokoll', intro: 'Protokoll über Ausgabe, Rückgabe und Zustand eines Einsatzmittels.', fields: ['Datum', 'Referenz Einsatznummer', 'Verwendende Person', 'Zertifizierungsnummer', 'Seriennummer', 'Zustand vor Verwendung', 'Zustand nach Verwendung', 'Besonderheiten', 'Nachbestellung erforderlich', 'Gegenzeichnung'] },
  kb03: { title: 'KB-03 Verletzungsprotokoll', intro: 'Meldung und Dokumentation von Verletzungen oder Zwischenfällen.', fields: ['Datum des Vorfalls', 'Uhrzeit', 'Einsatznummer', 'Einsatzort', 'Meldende Person', 'Betroffene Person', 'Personengruppe', 'Schweregrad', 'Beschreibung', 'Sofortmaßnahmen', 'Weitere Maßnahmen', 'Unterschriften'] },
  kb04: { title: 'KB-04 Ausbildungsnachweis', intro: 'Nachweis der absolvierten Ausbildungsphasen.', fields: ['Name', 'Dienstgrad', 'Dienstnummer', 'Dienststelle', 'Ausbildungsbeginn', 'Zugewiesener Ausbilder', 'Theorie abgeschlossen', 'Praxisübungen abgeschlossen', 'Prüfungseinsatz', 'Gesamtbewertung / Notizen', 'Freigabe'] },
  kb05: { title: 'KB-05 Prüfungsprotokoll', intro: 'Protokoll der Abschlussprüfung.', fields: ['Prüfungsdatum', 'Prüfungsort', 'Prüfungskommission', 'Name Prüfling', 'Dienstgrad', 'Dienstnummer', 'Theoriepunkte', 'Praxisteil Bewertung', 'Gesamtergebnis', 'Anmerkungen', 'Zertifikatsnummer', 'Unterschriften'] }
};

const dashboardHtml = `
  <h2>KMBD Landesportal – Desktop Übersicht</h2>
  <p class="notice"><b>Demo-Hinweis:</b> Dieses Portal ist eine sichere Verwaltungsdemo. Operative Kampfmittelanleitungen werden nicht 1:1 übernommen.</p>
  <div class="three-grid">
    <div class="stat"><b>5</b>Formulare KB-01 bis KB-05</div>
    <div class="stat"><b>3</b>Demo-Zugänge</div>
    <div class="stat"><b>12</b>Lexikon-Platzhalter</div>
  </div>
  <h3>Schnellzugriff</h3>
  <div class="card-grid">
    <button class="item" onclick="openApp('forms')">📋 Formulare öffnen</button>
    <button class="item" onclick="openApp('chat')">💬 Internen Chat öffnen</button>
    <button class="item" onclick="openApp('records')">🗂️ Personalakten öffnen</button>
    <button class="item" onclick="openApp('users')">👥 Benutzerverwaltung öffnen</button>
  </div>`;

const infoHtml = `
  <h2>Infoseite – Wichtige Informationen</h2>
  <p class="notice">Sichere, allgemeine Verwaltungszusammenfassung für Schulung, Dokumentation und Kommunikation. Keine operative Anleitung.</p>
  <div class="form-section"><h3>Aufgabenbereich</h3><ul><li>Dokumentation von Einsätzen und Schulungen</li><li>Koordination mit zuständigen Stellen</li><li>Nachvollziehbare Ablage von Formularen, Notizen und Personalakten</li><li>Qualitätssicherung über Prüf- und Ausbildungsnachweise</li></ul></div>
  <div class="form-section"><h3>Grundregeln für Dokumentation</h3><ul><li>Alle relevanten Zeiten, Orte und Beteiligten sauber erfassen</li><li>Nur geprüfte Informationen eintragen</li><li>Abweichungen und Besonderheiten klar dokumentieren</li><li>Freigaben und Gegenzeichnungen vollständig einholen</li></ul></div>
  <div class="form-section"><h3>Kommunikation</h3><ul><li>Kurze, klare Meldungen</li><li>Keine Alleingänge in sicherheitsrelevanten Situationen</li><li>Entscheidungen nachvollziehbar dokumentieren</li><li>Bei Unsicherheit zuständige Leitung einbinden</li></ul></div>
  <div class="form-section"><h3>Rollen</h3><div class="file"><b>Leitung:</b> Freigaben, Qualitätssicherung, Entscheidungen</div><div class="file"><b>Ausbilder:</b> Schulung, Prüfung, Nachweise</div><div class="file"><b>Beamte:</b> Dokumentation, Rückmeldungen, Formularpflege</div></div>`;

const formsHtml = `
  <h2>Formulare</h2>
  <p>Wähle ein Formular aus. Daten werden lokal im Browser gespeichert und können als Zusammenfassung exportiert werden.</p>
  <div class="tabs">
    <button class="tab active" onclick="renderKbForm('kb01', this)">KB-01 Einsatzbericht</button>
    <button class="tab" onclick="renderKbForm('kb02', this)">KB-02 Kitverwendung</button>
    <button class="tab" onclick="renderKbForm('kb03', this)">KB-03 Verletzung</button>
    <button class="tab" onclick="renderKbForm('kb04', this)">KB-04 Ausbildung</button>
    <button class="tab" onclick="renderKbForm('kb05', this)">KB-05 Prüfung</button>
  </div>
  <div id="kbFormHost"></div>`;

const lexiconHtml = `
  <h2>Kampfmittel-Lexikon</h2>
  <p class="notice">Dieses Lexikon ist bewusst als sichere Verwaltungs- und Erkennungshilfe ohne Entschärfungs- oder Manipulationsanweisungen umgesetzt.</p>
  <div class="card-grid">
    ${['Unbekannter Fund', 'Historische Munition', 'Verdächtiges Paket', 'Technisches Bauteil', 'Markierung / Kennzeichnung', 'Sicherheitsbereich', 'Dokumentationsfoto', 'Fundortmeldung', 'Weiterleitung', 'Behördenkontakt', 'Schulungsfall', 'Archivierter Fall'].map((name, i) => `<button class="item" onclick="showLexicon(${i})">📚 ${name}</button>`).join('')}
  </div>
  <div id="lexiconDetail" class="form-section"><h3>Eintrag wählen</h3><p>Klicke auf eine Karte für eine sichere Detailansicht.</p></div>`;

const chatHtml = `
  <h2>Interner Chat</h2>
  <p class="notice"><b>Demo:</b> Der Chat speichert Nachrichten lokal im Browser. Für echten Mehrbenutzer-Chat brauchst du später ein Backend mit Datenbank/WebSocket.</p>
  <div id="chatBox" class="chat-box"></div>
  <div class="row"><input id="chatInput" placeholder="Nachricht schreiben..." onkeydown="if(event.key==='Enter') sendChat()"><button class="app-btn" onclick="sendChat()">Senden</button><button class="muted-btn" onclick="clearChat()">Chat leeren</button></div>`;

const usersHtml = `
  <h2>Benutzerverwaltung</h2>
  <p>Zugänge für Demo-Benutzer anlegen und verwalten.</p>
  <div class="card-grid"><label>Benutzername<input id="newUser"></label><label>Passwort<input id="newPass" type="password"></label></div>
  <div class="card-grid"><label>Name / Dienstgrad<input id="newName"></label><label>Rolle<select id="newRole"><option>Beamter</option><option>Ausbilder</option><option>Administrator</option></select></label></div>
  <button class="app-btn" onclick="addPortalUser()">Zugang anlegen</button>
  <h3>Bestehende Zugänge</h3><div id="userList"></div>`;

const recordsHtml = `
  <h2>Personalakten</h2>
  <p>Ausbildungs- und Verhaltenseinträge lokal verwalten.</p>
  <div class="card-grid"><label>Name / Dienstgrad<input id="recName"></label><label>Dienstnummer<input id="recNo"></label></div>
  <div class="card-grid"><label>Status<select id="recStatus"><option>Anwärter</option><option>Zertifiziert</option><option>Suspendiert</option></select></label><label>Zugehöriger Login<input id="recLogin"></label></div>
  <label>Eintrag / Notiz<textarea id="recNote"></textarea></label>
  <button class="app-btn" onclick="addRecord()">Personalakte speichern</button>
  <h3>Gespeicherte Akten</h3><div id="recordList"></div>`;

const apps = {
  dashboard: { title: 'Dashboard', icon: '📊', large: true, html: dashboardHtml },
  info: { title: 'Infoseite Beamte', icon: 'ℹ️', large: true, html: infoHtml },
  forms: { title: 'Formulare KB', icon: '📋', large: true, html: formsHtml },
  lexicon: { title: 'Lexikon', icon: '📚', large: true, html: lexiconHtml },
  chat: { title: 'Interner Chat', icon: '💬', large: true, html: chatHtml },
  users: { title: 'Benutzerverwaltung', icon: '👥', large: true, html: usersHtml },
  records: { title: 'Personalakten', icon: '🗂️', large: true, html: recordsHtml },
  notes: { title: 'Notizen', icon: '📝', html: `<h2>Notizen</h2><textarea id="noteBox" placeholder="Schreibe etwas..."></textarea><div class="row"><button class="app-btn" onclick="saveNote()">Speichern</button><button class="app-btn" onclick="loadNote()">Laden</button></div><p id="noteStatus"></p>` },
  tasks: { title: 'Aufgaben', icon: '✅', html: `<h2>Aufgaben</h2><div class="row"><input id="taskInput" placeholder="Neue Aufgabe"><button class="app-btn" onclick="addTask()">Hinzufügen</button></div><ul id="taskList"></ul>` },
  files: { title: 'Dateien', icon: '📁', html: `<h2>Dateimanager</h2><div class="file">📄 KB-01 Einsatzbericht.txt</div><div class="file">📄 KB-02 Kitverwendung.txt</div><div class="file">📄 KB-03 Verletzungsprotokoll.txt</div><div class="file">📄 KB-04 Ausbildungsnachweis.txt</div><div class="file">📄 KB-05 Prüfungsprotokoll.txt</div><p>Demo-Dateien. Echte Uploads benötigen ein Backend.</p>` },
  settings: { title: 'Einstellungen', icon: '⚙️', html: `<h2>Einstellungen</h2><p>Desktop-Hintergrund ändern:</p><div class="row"><button class="app-btn" onclick="setTheme('blue')">Blau</button><button class="app-btn" onclick="setTheme('dark')">Dunkel</button><button class="app-btn" onclick="setTheme('green')">Grün</button></div>` }
};

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const user = document.querySelector('#username').value.trim();
  const pass = document.querySelector('#password').value.trim();
  const storedUsers = getPortalUsers();
  const found = storedUsers.find(u => u.username === user && u.password === pass);
  if (found) {
    currentUser = found.username;
    currentUserLabel.textContent = `${found.name} · ${found.role}`;
    loginScreen.classList.add('hidden');
    desktop.classList.remove('hidden');
    loginError.textContent = '';
  } else loginError.textContent = 'Falscher Benutzername oder falsches Passwort.';
});

document.querySelector('#logoutBtn').addEventListener('click', () => { desktop.classList.add('hidden'); loginScreen.classList.remove('hidden'); });
document.querySelectorAll('.desktop-icon').forEach(icon => { icon.addEventListener('click', () => openApp(icon.dataset.app)); });

function openApp(appKey) { const app = apps[appKey]; const existing = document.querySelector(`[data-window="${appKey}"]`); if (existing) { existing.style.zIndex = ++z; return; } const win = document.createElement('article'); win.className = `window ${app.large ? 'large' : ''}`; win.dataset.window = appKey; win.style.zIndex = ++z; win.style.left = `${250 + Math.random() * 120}px`; win.style.top = `${70 + Math.random() * 80}px`; win.innerHTML = `<header class="window-header"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="window-title">${app.icon} ${app.title}</span><button class="close" onclick="closeApp('${appKey}')">×</button></header><section class="window-content">${app.html}</section>`; windows.appendChild(win); makeDraggable(win); addTaskButton(appKey, app); if (appKey === 'tasks') renderTasks(); if (appKey === 'forms') renderKbForm('kb01'); if (appKey === 'chat') renderChat(); if (appKey === 'users') renderUsers(); if (appKey === 'records') renderRecords(); }
function closeApp(appKey) { document.querySelector(`[data-window="${appKey}"]`)?.remove(); document.querySelector(`[data-task="${appKey}"]`)?.remove(); }
function addTaskButton(appKey, app) { if (document.querySelector(`[data-task="${appKey}"]`)) return; const btn = document.createElement('button'); btn.textContent = `${app.icon} ${app.title}`; btn.dataset.task = appKey; btn.onclick = () => openApp(appKey); taskButtons.appendChild(btn); }
function makeDraggable(win) { const header = win.querySelector('.window-header'); let offsetX = 0, offsetY = 0, dragging = false; header.addEventListener('mousedown', e => { dragging = true; win.style.zIndex = ++z; offsetX = e.clientX - win.offsetLeft; offsetY = e.clientY - win.offsetTop; }); window.addEventListener('mousemove', e => { if (!dragging) return; win.style.left = `${e.clientX - offsetX}px`; win.style.top = `${e.clientY - offsetY}px`; }); window.addEventListener('mouseup', () => dragging = false); }

function renderKbForm(key, btn) { document.querySelectorAll('[data-window="forms"] .tab').forEach(t => t.classList.remove('active')); if (btn) btn.classList.add('active'); const tpl = formTemplates[key]; const host = document.querySelector('#kbFormHost'); if (!host) return; const saved = JSON.parse(localStorage.getItem('form_' + key) || '{}'); host.innerHTML = `<div class="form-section"><h3>${tpl.title}</h3><p>${tpl.intro}</p>${tpl.fields.map((f, i) => `<label>${f}<input id="${key}_${i}" value="${saved[i] || ''}" placeholder="${f}"></label>`).join('')}<div class="row"><button class="app-btn" onclick="saveKbForm('${key}')">Speichern</button><button class="muted-btn" onclick="printKbForm('${key}')">Drucken</button><button class="muted-btn" onclick="clearKbForm('${key}')">Leeren</button></div><pre id="${key}_summary" class="summary">Noch nicht gespeichert.</pre></div>`; }
function saveKbForm(key) { const tpl = formTemplates[key]; const data = {}; tpl.fields.forEach((_, i) => data[i] = document.querySelector(`#${key}_${i}`)?.value || ''); localStorage.setItem('form_' + key, JSON.stringify(data)); document.querySelector(`#${key}_summary`).textContent = tpl.title + '\n' + tpl.fields.map((f, i) => `${f}: ${data[i] || '-'}`).join('\n'); }
function clearKbForm(key) { localStorage.removeItem('form_' + key); renderKbForm(key); }
function printKbForm(key) { saveKbForm(key); window.print(); }

function showLexicon(i) { const names = ['Unbekannter Fund', 'Historische Munition', 'Verdächtiges Paket', 'Technisches Bauteil', 'Markierung / Kennzeichnung', 'Sicherheitsbereich', 'Dokumentationsfoto', 'Fundortmeldung', 'Weiterleitung', 'Behördenkontakt', 'Schulungsfall', 'Archivierter Fall']; document.querySelector('#lexiconDetail').innerHTML = `<h3>${names[i]}</h3><p><b>Zweck:</b> Sichere Einordnung für Dokumentation und Weiterleitung.</p><ul><li>Fundort und Zeitpunkt dokumentieren</li><li>Fotos nur aus sicherer Entfernung und nach interner Vorgabe</li><li>Keine Manipulation, keine eigenmächtige Untersuchung</li><li>Zuständige Leitung oder Stelle informieren</li></ul>`; }

function getChat() { return JSON.parse(localStorage.getItem('portalChat') || '[]'); }
function setChat(messages) { localStorage.setItem('portalChat', JSON.stringify(messages)); }
function renderChat() { const box = document.querySelector('#chatBox'); if (!box) return; box.innerHTML = getChat().map(m => `<div class="chat-msg ${m.user === currentUser ? 'me' : ''}"><div class="chat-meta">${m.user} · ${m.time}</div>${escapeHtml(m.text)}</div>`).join('') || '<p>Noch keine Nachrichten.</p>'; box.scrollTop = box.scrollHeight; }
function sendChat() { const input = document.querySelector('#chatInput'); if (!input?.value.trim()) return; const messages = getChat(); messages.push({ user: currentUser || 'Gast', text: input.value.trim(), time: new Date().toLocaleString('de-DE') }); setChat(messages); input.value = ''; renderChat(); }
function clearChat() { if (confirm('Chat wirklich leeren?')) { setChat([]); renderChat(); } }

function getPortalUsers() { const saved = JSON.parse(localStorage.getItem('portalUsers') || 'null'); return saved || demoUsers; }
function setPortalUsers(users) { localStorage.setItem('portalUsers', JSON.stringify(users)); }
function renderUsers() { const list = document.querySelector('#userList'); if (!list) return; list.innerHTML = getPortalUsers().map((u, i) => `<div class="file"><b>${u.username}</b> · ${u.name} · ${u.role} <button class="muted-btn" onclick="removePortalUser(${i})">löschen</button></div>`).join(''); }
function addPortalUser() { const u = document.querySelector('#newUser').value.trim(), p = document.querySelector('#newPass').value.trim(), n = document.querySelector('#newName').value.trim(), r = document.querySelector('#newRole').value; if (!u || !p) return alert('Benutzername und Passwort fehlen.'); const users = getPortalUsers(); users.push({ username: u, password: p, name: n || u, role: r }); setPortalUsers(users); renderUsers(); }
function removePortalUser(i) { const users = getPortalUsers(); users.splice(i,1); setPortalUsers(users); renderUsers(); }

function getRecords() { return JSON.parse(localStorage.getItem('portalRecords') || '[]'); }
function setRecords(records) { localStorage.setItem('portalRecords', JSON.stringify(records)); }
function addRecord() { const rec = { name: val('recName'), no: val('recNo'), status: val('recStatus'), login: val('recLogin'), note: val('recNote'), date: new Date().toLocaleDateString('de-DE') }; if (!rec.name) return alert('Name fehlt.'); setRecords([...getRecords(), rec]); renderRecords(); }
function renderRecords() { const list = document.querySelector('#recordList'); if (!list) return; list.innerHTML = getRecords().map((r, i) => `<div class="file"><b>${escapeHtml(r.name)}</b> · ${escapeHtml(r.status)} · ${escapeHtml(r.no || '-')}<p>${escapeHtml(r.note || '')}</p><small>${r.date} · Login: ${escapeHtml(r.login || '-')}</small> <button class="muted-btn" onclick="deleteRecord(${i})">löschen</button></div>`).join('') || '<p>Keine Personalakten gespeichert.</p>'; }
function deleteRecord(i) { const records = getRecords(); records.splice(i,1); setRecords(records); renderRecords(); }

function saveNote() { localStorage.setItem('portalNote', document.querySelector('#noteBox').value); document.querySelector('#noteStatus').textContent = 'Notiz gespeichert.'; }
function loadNote() { document.querySelector('#noteBox').value = localStorage.getItem('portalNote') || ''; document.querySelector('#noteStatus').textContent = 'Notiz geladen.'; }
function getTasks() { return JSON.parse(localStorage.getItem('portalTasks') || '[]'); } function setTasks(tasks) { localStorage.setItem('portalTasks', JSON.stringify(tasks)); } function addTask() { const input = document.querySelector('#taskInput'); if (!input.value.trim()) return; setTasks([...getTasks(), input.value.trim()]); input.value = ''; renderTasks(); } function removeTask(index) { const tasks = getTasks(); tasks.splice(index, 1); setTasks(tasks); renderTasks(); } function renderTasks() { const list = document.querySelector('#taskList'); if (!list) return; list.innerHTML = getTasks().map((task, i) => `<li>${escapeHtml(task)} <button onclick="removeTask(${i})">löschen</button></li>`).join(''); }
function setTheme(theme) { const bg = { blue: 'radial-gradient(circle at 72% 18%, rgba(14,165,233,.32), transparent 25%), linear-gradient(135deg, #0f172a, #020617 72%)', dark: 'linear-gradient(135deg, #020617, #111827)', green: 'radial-gradient(circle at 70% 20%, rgba(34,197,94,.28), transparent 25%), linear-gradient(135deg, #064e3b, #020617 70%)' }; desktop.style.background = bg[theme]; }
function val(id) { return document.querySelector('#' + id)?.value || ''; }
function escapeHtml(str) { return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
setInterval(() => { document.querySelector('#clock').textContent = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); }, 1000);
