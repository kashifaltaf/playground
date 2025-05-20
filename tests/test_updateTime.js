const { JSDOM } = require('jsdom');
const { updateTime } = require('../updateTime');

const dom = new JSDOM(`<!DOCTYPE html>
<p id="london"></p>
<p id="new-york"></p>
<p id="tokyo"></p>
<p id="sydney"></p>`);

global.document = dom.window.document;

const mockDate = new Date('2020-01-01T12:00:00Z');

updateTime(mockDate);

const londonExpected = mockDate.toLocaleString('en-US', { timeZone: 'Europe/London' });
const newYorkExpected = mockDate.toLocaleString('en-US', { timeZone: 'America/New_York' });
const tokyoExpected = mockDate.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' });
const sydneyExpected = mockDate.toLocaleString('en-US', { timeZone: 'Australia/Sydney' });

console.assert(document.getElementById('london').textContent === londonExpected, 'London time not set');
console.assert(document.getElementById('new-york').textContent === newYorkExpected, 'New York time not set');
console.assert(document.getElementById('tokyo').textContent === tokyoExpected, 'Tokyo time not set');
console.assert(document.getElementById('sydney').textContent === sydneyExpected, 'Sydney time not set');

console.log('All tests passed.');
