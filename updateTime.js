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

function updateTime(date = new Date()) {
  setZoneTime(date, 'Europe/London', 'london');
  setZoneTime(date, 'America/New_York', 'new-york');
  setZoneTime(date, 'Asia/Tokyo', 'tokyo');
  setZoneTime(date, 'Australia/Sydney', 'sydney');
}

if (typeof module !== 'undefined') {
  module.exports = { updateTime };
}

if (typeof window !== 'undefined') {
  setInterval(() => updateTime(), 1000);
}
