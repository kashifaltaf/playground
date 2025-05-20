function updateTime(date = new Date()) {
  var londonTime = date.toLocaleString('en-US', { timeZone: 'Europe/London' });
  document.getElementById('london').textContent = londonTime;

  var newyorkTime = date.toLocaleString('en-US', { timeZone: 'America/New_York' });
  document.getElementById('new-york').textContent = newyorkTime;

  var tokyoTime = date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' });
  document.getElementById('tokyo').textContent = tokyoTime;

  var sydneyTime = date.toLocaleString('en-US', { timeZone: 'Australia/Sydney' });
  document.getElementById('sydney').textContent = sydneyTime;
}

if (typeof module !== 'undefined') {
  module.exports = { updateTime };
}

if (typeof window !== 'undefined') {
  setInterval(() => updateTime(), 1000);
}
