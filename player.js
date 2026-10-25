/* Kontroler strony. EmulatorJS startuje w osobnym iframe o stalej wysokosci. */
'use strict';
const input = document.getElementById('romFile');
const status = document.getElementById('notice');
const featured = document.getElementById('featuredButton');
const frame = document.getElementById('emuFrame');
const legacy = document.getElementById('compatMode');
let started = false;
let pendingGame = null;

function startGame(file, url, name) {
  if (started) return;
  started = true;
  pendingGame = {
    type: 'retro-c64-start',
    file: file || null,
    url: url || null,
    name: name,
    legacy: legacy.checked
  };
  input.disabled = true;
  featured.disabled = true;
  legacy.disabled = true;
  document.getElementById('placeholder').hidden = true;
  frame.hidden = false;
  status.textContent = 'Przygotowywanie emulatora: ' + name + '…';
  frame.src = 'emulator-frame.html?v=2';
}

window.addEventListener('message', function(event) {
  if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
  const data = event.data || {};
  if (data.type === 'retro-c64-ready' && pendingGame) {
    frame.contentWindow.postMessage(pendingGame, location.origin);
    pendingGame = null;
  } else if (data.type === 'retro-c64-loading') {
    status.textContent = 'Wczytywanie gry: ' + data.name + '. Po uruchomieniu kliknij ekran emulatora, aby sterować.';
  } else if (data.type === 'retro-c64-error') {
    status.textContent = data.message;
  }
});

input.addEventListener('change', function() {
  const file = input.files && input.files[0];
  if (!file || started) return;
  const ext = file.name.toLowerCase().split('.').pop();
  if (['prg', 'd64', 't64', 'crt', 'tap', 'zip'].indexOf(ext) === -1) {
    status.textContent = 'Nieobsługiwany format. Wybierz PRG, D64, T64, CRT, TAP albo ZIP.';
    return;
  }
  // Plik File zachowuje rozszerzenie; blob URL go nie zachowuje.
  startGame(file, null, file.name);
});

document.getElementById('resetButton').addEventListener('click', function() {
  location.reload();
});

fetch('games/lot-nad-wisla.d64', { method: 'HEAD' }).then(function(response) {
  if (!response.ok) return;
  featured.hidden = false;
  document.getElementById('game-note').textContent = 'Gra jest dostępna. Kliknij, aby uruchomić ją online.';
}).catch(function() {});

featured.addEventListener('click', function() {
  startGame(null, 'games/lot-nad-wisla.d64', 'LOT NAD WISLA');
});

if (new URLSearchParams(location.search).get('game') === 'lot-nad-wisla') {
  document.getElementById('game-note').scrollIntoView({ block: 'center' });
}