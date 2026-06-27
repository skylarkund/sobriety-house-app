const STORAGE_KEY = 'welcomeHome.settings.v2';
const LAST_VIEW_KEY = 'welcomeHome.lastViewedDay.v2';
let preview = null;

const $ = (id) => document.getElementById(id);

const defaultSettings = {
  setupComplete: false,
  mode: 'auto',
  sobrietyStart: todayISO(),
  manualDays: 1,
  previewDate: todayISO(),
  seasonMode: 'date',
  manualSeason: 'spring',
  oliviaBirthday: DEFAULT_SPECIAL_DATES.oliviaBirthday,
  everlyBirthday: DEFAULT_SPECIAL_DATES.everlyBirthday,
  dadBirthday: DEFAULT_SPECIAL_DATES.dadBirthday
};

function todayISO() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function loadSettings() {
  try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return { ...defaultSettings }; }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function daysBetweenInclusive(startISO, endISO) {
  const start = new Date(`${startISO}T00:00:00`);
  const end = new Date(`${endISO}T00:00:00`);
  const days = Math.floor((end - start) / 86400000) + 1;
  return Math.max(1, days || 1);
}

function getSeasonFromDate(dateISO, settings) {
  if (settings.seasonMode === 'manual') return settings.manualSeason;
  const month = Number(dateISO.slice(5, 7));
  const day = Number(dateISO.slice(8, 10));
  if (month === 12) return 'christmas';
  if (month === 1 || month === 2) return 'winter';
  if (month === 3 || month === 4 || month === 5) return 'spring';
  if (month === 6 || month === 7 || month === 8) return 'summer';
  if (month === 9 || month === 10 || month === 11) return 'fall';
  return 'spring';
}

function getState() {
  const settings = loadSettings();
  const realDay = settings.mode === 'manual'
    ? Number(settings.manualDays || 1)
    : daysBetweenInclusive(settings.sobrietyStart, todayISO());
  const day = preview?.day || realDay;
  const calendarDate = preview?.date || settings.previewDate || todayISO();
  const season = getSeasonFromDate(calendarDate, settings);
  return { settings, realDay, day: Math.max(1, Number(day || 1)), calendarDate, season };
}

function getBirthdayBanner(dateISO, settings) {
  const md = dateISO.slice(5);
  if (md === settings.oliviaBirthday) return '🎂 Happy Birthday, Olivia!';
  if (md === settings.everlyBirthday) return '🎂 Happy Birthday, Everly!';
  if (md === settings.dadBirthday) return '🎂 Happy Birthday!';
  return '';
}

function render() {
  const state = getState();
  const { settings, day, calendarDate, season } = state;
  const todayUnlock = getUnlockForDay(day);

  document.body.dataset.season = season;
  $('dayTitle').textContent = `Day ${day}`;
  $('bigDay').textContent = day.toLocaleString();
  $('subtitle').textContent = preview ? 'Preview mode. This does not change saved progress.' : 'Keep building. One day at a time.';
  $('deliveryIcon').textContent = todayUnlock.icon;
  $('deliveryName').textContent = todayUnlock.name;
  $('deliveryText').textContent = todayUnlock.text;
  $('deliveryTag').textContent = todayUnlock.type === 'milestone' ? 'MILESTONE' : 'NEW';
  $('seasonName').textContent = season[0].toUpperCase() + season.slice(1);
  $('previewRibbon').classList.toggle('hidden', !preview);

  renderEvents(calendarDate, settings, season);
  renderHome(day, season, calendarDate, settings);
  renderRecent(day);
  renderJournal(day);
  renderMilestone(day);
  maybeShowDailyUnlock(day, todayUnlock);
}

function renderEvents(dateISO, settings, season) {
  const birthday = getBirthdayBanner(dateISO, settings);
  let banner = birthday;
  if (!banner && season === 'christmas') banner = '🎄 Christmas at Home';
  $('eventBanner').textContent = banner;
  $('eventBanner').classList.toggle('hidden', !banner);
}

function renderHome(day, season, calendarDate, settings) {
  document.querySelectorAll('.unlock-item, .season-item, .birthday-item').forEach(el => el.remove());
  const items = getUnlockedItems(day);
  const visible = items.slice(-180);
  const roomCounts = {};

  visible.forEach((item) => {
    const room = item.room || 'Entry';
    roomCounts[room] = (roomCounts[room] || 0) + 1;
    const coords = ROOM_COORDS[room] || ROOM_COORDS.Entry;
    const point = coords[(roomCounts[room] - 1) % coords.length];
    const el = document.createElement('div');
    el.className = `unlock-item ${item.type === 'milestone' ? 'milestone-item' : ''}`;
    el.style.left = `${point[0]}%`;
    el.style.top = `${point[1]}%`;
    el.textContent = item.icon;
    el.title = `Day ${item.day}: ${item.name}`;
    el.dataset.room = room;
    $('homeStage').appendChild(el);
  });

  addConstantDaughterSigns();
  addSeasonDecor(season);
  addBirthdayDecor(calendarDate, settings);
}

function addMarker(className, text, x, y, title='') {
  const el = document.createElement('div');
  el.className = className;
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;
  el.textContent = text;
  if (title) el.title = title;
  $('homeStage').appendChild(el);
}

function addConstantDaughterSigns() {
  addMarker('season-item daughter-sign', '🎒', 47, 58, 'Backpacks for Olivia and Everly');
  addMarker('season-item daughter-sign', '🎨', 18, 57, 'Daughter artwork on the fridge');
  addMarker('season-item daughter-sign', '👟', 44, 73, 'Little shoes by the door');
  addMarker('season-item daughter-sign', '📄', 30, 63, 'Homework on the table');
}

function addSeasonDecor(season) {
  if (season === 'christmas') {
    addMarker('season-item christmas-tree', '🎄', 83, 70, 'Christmas tree');
    addMarker('season-item', '🎁', 76, 76, 'Presents');
    addMarker('season-item', '🧦', 68, 30, 'Stockings');
    addMarker('season-item', '✨', 50, 35, 'Warm holiday lights');
  }
  if (season === 'winter') {
    addMarker('season-item', '❄️', 16, 82, 'Snow outside');
    addMarker('season-item', '☕', 27, 66, 'Hot cocoa weather');
  }
  if (season === 'spring') {
    addMarker('season-item', '🌷', 82, 88, 'Spring flowers');
    addMarker('season-item', '🌼', 17, 87, 'Spring flowers');
  }
  if (season === 'summer') {
    addMarker('season-item', '☀️', 89, 13, 'Summer sun');
    addMarker('season-item', '🕶️', 22, 85, 'Summer outside days');
  }
  if (season === 'fall') {
    addMarker('season-item', '🍂', 18, 88, 'Fall leaves');
    addMarker('season-item', '🍁', 79, 86, 'Fall leaves');
  }
}

function addBirthdayDecor(dateISO, settings) {
  const banner = getBirthdayBanner(dateISO, settings);
  if (!banner) return;
  addMarker('birthday-item birthday-banner', '🎈 HAPPY BIRTHDAY 🎈', 50, 9, banner);
  addMarker('birthday-item', '🎂', 28, 67, 'Birthday cake on the kitchen table');
  addMarker('birthday-item', '🎁', 72, 38, 'Birthday presents');
  addMarker('birthday-item', '🎉', 84, 28, 'Birthday decorations');
}

function renderRecent(day) {
  $('recentList').innerHTML = '';
  for (let d = day; d >= Math.max(1, day - 4); d--) {
    const item = getUnlockForDay(d);
    $('recentList').insertAdjacentHTML('beforeend', `<div class="mini-row"><span>${item.icon}</span><div><strong>Day ${d}</strong><small>${item.name}</small></div></div>`);
  }
}

function renderJournal(day) {
  $('journalPreview').innerHTML = '';
  $('journalFull').innerHTML = '';
  for (let d = day; d >= Math.max(1, day - 5); d--) {
    const item = getUnlockForDay(d);
    $('journalPreview').insertAdjacentHTML('beforeend', `<div class="journal-row"><span>${item.icon}</span><div><strong>Day ${d}</strong><small>${item.name}</small></div></div>`);
  }
  for (let d = day; d >= 1; d--) {
    const item = getUnlockForDay(d);
    $('journalFull').insertAdjacentHTML('beforeend', `<div class="journal-row ${item.type}"><span>${item.icon}</span><div><strong>Day ${d} ${item.type === 'milestone' ? '• Monthly Milestone' : ''}</strong><small>${item.name}</small><p>${item.text}</p></div></div>`);
  }
}

function renderMilestone(day) {
  const next = getNextMilestone(day);
  const remaining = Math.max(0, next.day - day);
  $('nextMilestone').innerHTML = `<div class="mini-row"><span>${next.icon}</span><div><strong>${next.name}</strong><small>${remaining} days to go</small></div></div><progress max="${next.day}" value="${Math.min(day, next.day)}"></progress>`;
}

function maybeShowDailyUnlock(day, item) {
  if (preview) return;
  const last = Number(localStorage.getItem(LAST_VIEW_KEY) || 0);
  if (day > last) {
    $('toastKicker').textContent = `Day ${day}`;
    $('toastIcon').textContent = item.icon;
    $('toastName').textContent = item.name;
    $('unlockToast').classList.remove('hidden');
  }
}

function fillForms() {
  const s = loadSettings();
  $('trackingMode').value = s.mode;
  $('sobrietyStart').value = s.sobrietyStart;
  $('manualDays').value = s.manualDays;
  $('settingsMode').value = s.mode;
  $('settingsStart').value = s.sobrietyStart;
  $('settingsDays').value = s.manualDays;
  $('settingsPreviewDate').value = s.previewDate || todayISO();
  $('seasonMode').value = s.seasonMode;
  $('manualSeason').value = s.manualSeason;
  $('oliviaBirthday').value = s.oliviaBirthday;
  $('everlyBirthday').value = s.everlyBirthday;
  $('dadBirthday').value = s.dadBirthday;
  $('timeDate').value = s.previewDate || todayISO();
}

function saveSetup() {
  const s = loadSettings();
  s.setupComplete = true;
  s.mode = $('trackingMode').value;
  s.sobrietyStart = $('sobrietyStart').value || todayISO();
  s.manualDays = Number($('manualDays').value || 1);
  saveSettings(s);
}

function saveSettingsFromModal() {
  const s = loadSettings();
  s.setupComplete = true;
  s.mode = $('settingsMode').value;
  s.sobrietyStart = $('settingsStart').value || todayISO();
  s.manualDays = Number($('settingsDays').value || 1);
  s.previewDate = $('settingsPreviewDate').value || todayISO();
  s.seasonMode = $('seasonMode').value;
  s.manualSeason = $('manualSeason').value;
  s.oliviaBirthday = $('oliviaBirthday').value || DEFAULT_SPECIAL_DATES.oliviaBirthday;
  s.everlyBirthday = $('everlyBirthday').value || DEFAULT_SPECIAL_DATES.everlyBirthday;
  s.dadBirthday = $('dadBirthday').value || DEFAULT_SPECIAL_DATES.dadBirthday;
  preview = null;
  saveSettings(s);
}

function renderTimeCards() {
  const days = [1, 30, 60, 90, 180, 365, 730, 1095, 1825];
  $('timeCards').innerHTML = days.map(d => {
    const item = getUnlockForDay(d);
    return `<button class="time-card" data-day="${d}" value="default"><strong>Day ${d}</strong><span>${item.icon}</span><small>${item.name}</small></button>`;
  }).join('');
}

window.addEventListener('DOMContentLoaded', () => {
  fillForms();
  renderTimeCards();
  if (!loadSettings().setupComplete) $('setupDialog').showModal();
  render();

  $('saveSetupBtn').addEventListener('click', () => { saveSetup(); fillForms(); setTimeout(render, 0); });
  $('settingsBtn').addEventListener('click', () => { fillForms(); $('settingsDialog').showModal(); });
  $('seasonBtn').addEventListener('click', () => { fillForms(); $('settingsDialog').showModal(); });
  $('saveSettingsBtn').addEventListener('click', () => { saveSettingsFromModal(); fillForms(); setTimeout(render, 0); });
  $('timeBtn').addEventListener('click', () => $('timeDialog').showModal());
  $('timeTopBtn').addEventListener('click', () => $('timeDialog').showModal());
  $('journalTopBtn').addEventListener('click', () => $('journalDialog').showModal());
  $('fullJournalBtn').addEventListener('click', () => $('journalDialog').showModal());
  $('viewTodayBtn').addEventListener('click', () => $('homeStage').scrollIntoView({ behavior: 'smooth', block: 'center' }));
  $('walkBtn').addEventListener('click', () => $('homeStage').classList.toggle('highlight-mode'));
  $('previewBtn').addEventListener('click', () => { preview = { day: Number($('timeDay').value || 1), date: $('timeDate').value || todayISO() }; setTimeout(render, 0); });
  $('resetPreviewBtn').addEventListener('click', () => { preview = null; setTimeout(render, 0); });
  $('timeCards').addEventListener('click', (event) => {
    const card = event.target.closest('.time-card');
    if (!card) return;
    preview = { day: Number(card.dataset.day), date: $('timeDate').value || todayISO() };
    $('timeDialog').close();
    render();
  });
  $('toastClose').addEventListener('click', () => {
    const { day } = getState();
    localStorage.setItem(LAST_VIEW_KEY, String(day));
    $('unlockToast').classList.add('hidden');
  });

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => {});
});
