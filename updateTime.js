function setZoneTime(date, timeZone, prefix) {
  const digital = date.toLocaleString('en-US', { timeZone });
  document.getElementById(prefix).textContent = digital;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).formatToParts(date);

  const getPart = type => parseInt(parts.find(p => p.type === type).value, 10);
  const seconds = getPart('second');
  const minutes = getPart('minute');
  const hours = getPart('hour');

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  const secondEl = document.getElementById(`${prefix}-second`);
  if (secondEl) {
    secondEl.style.transform = `translate(-50%, 0) rotate(${secondDeg}deg)`;
  }

  const minuteEl = document.getElementById(`${prefix}-minute`);
  if (minuteEl) {
    minuteEl.style.transform = `translate(-50%, 0) rotate(${minuteDeg}deg)`;
  }

  const hourEl = document.getElementById(`${prefix}-hour`);
  if (hourEl) {
    hourEl.style.transform = `translate(-50%, 0) rotate(${hourDeg}deg)`;
  }
}

const DEFAULT_ZONES = [
  { timeZone: 'Europe/London', prefix: 'london' },
  { timeZone: 'America/New_York', prefix: 'new-york' },
  { timeZone: 'Asia/Tokyo', prefix: 'tokyo' },
  { timeZone: 'Australia/Sydney', prefix: 'sydney' }
];

function updateTime(date = new Date()) {
  if (
    typeof document === 'undefined' ||
    typeof document.querySelectorAll !== 'function'
  ) {
    DEFAULT_ZONES.forEach(z => setZoneTime(date, z.timeZone, z.prefix));
    return;
  }

  const clocks = document.querySelectorAll('.clock[data-prefix]');
  clocks.forEach(clock => {
    const prefix = clock.dataset.prefix;
    let zone = clock.dataset.timezone;
    if (!zone || zone === 'local') {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    setZoneTime(date, zone, prefix);
  });

  // fallback for tests where .clock elements don't exist
  DEFAULT_ZONES.forEach(z => {
    if (!document.querySelector(`.clock[data-prefix="${z.prefix}"]`) && document.getElementById(z.prefix)) {
      setZoneTime(date, z.timeZone, z.prefix);
    }
  });
}

if (typeof module !== 'undefined') {
  module.exports = { updateTime };
}

if (typeof window !== 'undefined') {
  setInterval(() => updateTime(), 1000);

  const darkToggle = document.getElementById('dark-mode-toggle');
  const analogToggle = document.getElementById('analog-toggle');

  if (darkToggle) {
    darkToggle.addEventListener('change', () => {
      document.body.classList.toggle('light-mode', !darkToggle.checked);
    });
    // initialize
    document.body.classList.toggle('light-mode', !darkToggle.checked);
  }

  if (analogToggle) {
    const applyAnalog = () => {
      document.body.classList.toggle('digital-only', !analogToggle.checked);
      document.body.classList.toggle('analog-only', analogToggle.checked);
      sessionStorage.setItem('analogClock', analogToggle.checked);
    };
    const savedAnalog = sessionStorage.getItem('analogClock');
    if (savedAnalog !== null) {
      analogToggle.checked = savedAnalog === 'true';
    }
    analogToggle.addEventListener('change', applyAnalog);
    // initialize
    applyAnalog();
  }

  function buildTimeZoneMap() {
    const map = {};
    if (typeof Intl.supportedValuesOf !== 'function') return map;
    Intl.supportedValuesOf('timeZone').forEach(tz => {
      const parts = tz.split('/');
      const country = parts[0];
      const city = parts.slice(1).join('/') || tz;
      if (!map[country]) map[country] = {};
      map[country][city] = tz;
    });
    return map;
  }

  const TIME_ZONES = buildTimeZoneMap();

  const countrySelect = document.getElementById('country-select');
  const citySelect = document.getElementById('city-select');
  const addClock = document.getElementById('add-clock');

  const addedClocks = JSON.parse(sessionStorage.getItem('addedClocks') || '[]');

  function sanitize(tz) {
    return tz.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  function createClock(prefix, label, tz) {
    if (document.getElementById(prefix)) return;
    const container = document.getElementById('clock-widget');
    const div = document.createElement('div');
    div.className = 'clock';
    div.dataset.prefix = prefix;
    div.dataset.timezone = tz;
    div.innerHTML = `
      <h2>${label}</h2>
      <div class="analog" id="${prefix}-analog">
        <div class="hand hour" id="${prefix}-hour"></div>
        <div class="hand minute" id="${prefix}-minute"></div>
        <div class="hand second" id="${prefix}-second"></div>
      </div>
      <p id="${prefix}"></p>`;
    container.appendChild(div);
    updateTime();
  }

  function populateCountries() {
    if (!countrySelect) return;
    countrySelect.innerHTML = '<option value="">Region</option>';
    Object.keys(TIME_ZONES).sort().forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      countrySelect.appendChild(opt);
    });
  }

  function populateCities(country) {
    if (!citySelect) return;
    citySelect.innerHTML = '<option value="">Time Zone</option>';
    citySelect.disabled = !country;
    if (!country) return;
    Object.keys(TIME_ZONES[country]).sort().forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  }

  if (countrySelect && citySelect) {
    populateCountries();
    countrySelect.addEventListener('change', () => populateCities(countrySelect.value));
  }

  if (addClock) {
    addClock.addEventListener('click', () => {
      const country = countrySelect.value;
      const city = citySelect.value;
      if (!country || !city) return;
      const tz = TIME_ZONES[country][city];
      const prefix = sanitize(tz);
      createClock(prefix, city, tz);
      addedClocks.push({ prefix, label: city, timeZone: tz });
      sessionStorage.setItem('addedClocks', JSON.stringify(addedClocks));
    });
  }

  const savedDark = sessionStorage.getItem('darkMode');
  if (darkToggle && savedDark !== null) {
    darkToggle.checked = savedDark === 'true';
    document.body.classList.toggle('light-mode', !darkToggle.checked);
  }

  if (darkToggle) {
    darkToggle.addEventListener('change', () => {
      document.body.classList.toggle('light-mode', !darkToggle.checked);
      sessionStorage.setItem('darkMode', darkToggle.checked);
    });
  }

  addedClocks.forEach(c => createClock(c.prefix, c.label, c.timeZone));
}
