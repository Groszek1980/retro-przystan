/* Kontroler strony. EmulatorJS startuje w osobnym iframe o stalej wysokosci. */
'use strict';
const input = document.getElementById('romFile');
const status = document.getElementById('notice');
const featured = document.getElementById('featuredButton');
const frame = document.getElementById('emuFrame');
const legacy = document.getElementById('compatMode');
const joyport = document.getElementById('joyport');
const fastLoad = document.getElementById('fastLoad');
const keyStatus = document.getElementById('keyStatus');
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
    legacy: legacy.checked,
    joyport: joyport.value,
    fastLoad: fastLoad.checked
  };
  input.disabled = true;
  featured.disabled = true;
  legacy.disabled = true;
  joyport.disabled = true;
  fastLoad.disabled = true;
  document.getElementById('placeholder').hidden = true;
  frame.hidden = false;
  status.textContent = 'Przygotowywanie emulatora: ' + name + '…';
  frame.src = 'emulator-frame.html?v=3';
}

window.addEventListener('message', function(event) {
  if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
  const data = event.data || {};
  if (data.type === 'retro-c64-ready' && pendingGame) {
    frame.contentWindow.postMessage(pendingGame, location.origin);
    pendingGame = null;
  } else if (data.type === 'retro-c64-loading') {
    status.textContent = 'Wczytywanie gry: ' + data.name + '. Po uruchomieniu kliknij ekran emulatora, aby sterować.';
  } else if (data.type === 'retro-c64-running') {
    status.textContent = 'Emulator uruchomiony. Ładowanie programu z D64 może jeszcze trwać. Kliknij jego ekran i naciśnij strzałkę.';
  } else if (data.type === 'retro-c64-key') {
    const names = {
      ArrowUp:'strzałka w górę', ArrowDown:'strzałka w dół',
      ArrowLeft:'strzałka w lewo', ArrowRight:'strzałka w prawo',
      KeyX:'X (Fire)', KeyZ:'Z', Space:'Spacja',
      Enter:'Enter', ControlRight:'Prawy Ctrl (zmiana portu)'
    };
    keyStatus.textContent = '✓ Klawisz dotarł do emulatora: ' + (names[data.key] || data.key) + '. Jeśli gra nie reaguje, sprawdź port joysticka (1 / 2) lub mapowanie w Controller Settings.';
    keyStatus.classList.add('keyboard-ok');
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