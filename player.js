/* Kontroler strony. EmulatorJS startuje w osobnym iframe o stalej wysokosci. */
'use strict';
const input = document.getElementById('romFile');
const status = document.getElementById('notice');
const featured = document.getElementById('featuredButton');
const launchFeatured = document.getElementById('launchFeatured');
const frame = document.getElementById('emuFrame');
const legacy = document.getElementById('compatMode');
const joystickPort = document.getElementById('joystickPort');

// Działający rdzeń VICE rozpoznaje dopisek _j1 w nazwie pliku.
// Tworzymy tylko nowy obiekt File z tymi samymi bajtami: nie zmieniamy danych gry.
function gameNameForPort(filename, port) {
  const dot = filename.lastIndexOf('.');
  if (dot < 1) return filename;
  const base = filename.slice(0, dot).replace(/_j[12]$/i, '');
  const ext = filename.slice(dot);
  return base + (port === '1' ? '_j1' : '') + ext;
}
function fileForPort(file, port) {
  const renamed = gameNameForPort(file.name, port);
  if (renamed === file.name) return file;
  return new File([file], renamed, {type: file.type, lastModified: file.lastModified});
}

const diagnostic = document.getElementById('keyDiagnostic');
const modeKeyboardButton = document.getElementById('modeKeyboard');
const modeJoystickButton = document.getElementById('modeJoystick');
const inputModeStatus = document.getElementById('inputModeStatus');
function requestInputMode(mode) {
  if (!started || frame.hidden) {
    inputModeStatus.textContent = 'Najpierw uruchom grę, aby przełączyć tryb klawiatury.';
    return;
  }
  inputModeStatus.textContent = 'Przełączanie trybu…';
  frame.contentWindow.postMessage({ type: 'retro-c64-input-mode', mode: mode }, location.origin);
}
modeKeyboardButton.addEventListener('click', function() { requestInputMode('keyboard'); });
modeJoystickButton.addEventListener('click', function() { requestInputMode('joystick'); });

// Strzałki są klawiszami sterowania tylko gdy fokus należy do ramki gry.
// Zapobiega to przewijaniu całej strony bez blokowania jej nawigacji.
window.addEventListener('keydown', function(event) {
  if (!started || frame.hidden || document.activeElement !== frame) return;
  if (event.ctrlKey || event.altKey || event.metaKey) return;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
    event.preventDefault();
  }
}, { capture: true });

document.getElementById('focusKeyboard').addEventListener('click', function() {
  if (frame.hidden) {
    diagnostic.textContent = 'Najpierw wybierz grę i uruchom emulator.';
    return;
  }
  // Przekazujemy fokus do osobnego okna, bez zmiany ustawień VICE.
  frame.focus();
  frame.contentWindow.focus();
  diagnostic.textContent = 'Fokus przekazany. Naciśnij teraz strzałkę lub X. Jeżeli brak reakcji, kliknij bezpośrednio ekran gry.';
});
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
  joystickPort.disabled = true;
  document.getElementById('placeholder').hidden = true;
  frame.hidden = false;
  status.textContent = 'Przygotowywanie emulatora: ' + name + '…';
  frame.src = 'emulator-frame.html?v=4';
}

window.addEventListener('message', function(event) {
  if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
  const data = event.data || {};
  if (data.type === 'retro-c64-ready' && pendingGame) {
    frame.contentWindow.postMessage(pendingGame, location.origin);
    pendingGame = null;
  } else if (data.type === 'retro-c64-loading') {
    status.textContent = 'Wczytywanie gry: ' + data.name + '. Po uruchomieniu kliknij ekran emulatora, aby sterować.';
  } else if (data.type === 'retro-c64-input-mode-status') {
    if (data.ok) {
      const keyboard = data.mode === 'keyboard';
      modeKeyboardButton.classList.toggle('is-active', keyboard);
      modeJoystickButton.classList.toggle('is-active', !keyboard);
      modeKeyboardButton.setAttribute('aria-pressed', String(keyboard));
      modeJoystickButton.setAttribute('aria-pressed', String(!keyboard));
      inputModeStatus.textContent = keyboard
        ? 'Klawiatura C64 aktywna. Kliknij ekran emulatora i naciśnij N lub C. Przed lotem włącz JOYSTICK.'
        : 'Joystick aktywny. Kliknij ekran gry i steruj strzałkami oraz X.';
    } else {
      inputModeStatus.textContent = 'Tryb nie został przełączony. ' +
        (data.message || 'Spróbuj ponownie po uruchomieniu gry albo w ustawieniach Input Options w EmulatorJS.');
    }
  } else if (data.type === 'retro-c64-key-detected') {
    const labels = {
      ArrowUp: 'strzałka w górę', ArrowDown: 'strzałka w dół',
      ArrowLeft: 'strzałka w lewo', ArrowRight: 'strzałka w prawo',
      KeyX: 'X', Space: 'spacja', Enter: 'Enter', ControlRight: 'prawy Ctrl'
    };
    diagnostic.textContent = 'Klawisz wykryty w ramce: ' + (labels[data.code] || data.key || data.code) + '. To potwierdza tylko odbiór przez okno; nie oznacza jeszcze, że VICE przypisał go do joysticka.';
    diagnostic.classList.add('keyboard-ok');
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
  try {
    const prepared = fileForPort(file, joystickPort.value);
    startGame(prepared, null, prepared.name);
  } catch (error) {
    status.textContent = 'Nie udało się przygotować pliku dla wybranego portu. Spróbuj zmienić nazwę ręcznie.';
  }
});

document.getElementById('resetButton').addEventListener('click', function() {
  location.reload();
});

fetch('games/lot-nad-wisla.d64', { method: 'HEAD' }).then(function(response) {
  if (!response.ok) return;
  featured.hidden = false;
  document.getElementById('game-note').textContent = 'Dostępna jest wersja demonstracyjna I1.4. Zobacz opis gry lub uruchom ją tutaj.';
  if (!started) featured.hidden = false;
}).catch(function() {});

launchFeatured.addEventListener('click', function() {
  if (!started) featured.click();
});

featured.addEventListener('click', async function() {
  const url = 'games/lot-nad-wisla.d64';
  if (joystickPort.value !== '1') {
    startGame(null, url, 'LOT NAD WISLA');
    return;
  }
  featured.disabled = true;
  status.textContent = 'Przygotowywanie pliku gry dla portu 1…';
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Błąd pobierania');
    const blob = await response.blob();
    const f = new File([blob], gameNameForPort('lot-nad-wisla.d64', '1'), { type:blob.type });
    startGame(f, null, f.name);
  } catch(error) {
    featured.disabled = false;
    status.textContent = 'Nie udało się wczytać gry z serwera. Spróbuj ponownie lub wybierz plik z dysku.';
  }
});

// Wejście przez GRAJ ONLINE przygotowuje grę, ale nie uruchamia jej od razu.
// Dzięki temu użytkownik zdąży wybrać tryb zgodności przed załadowaniem VICE.
if (new URLSearchParams(location.search).get('game') === 'lot-nad-wisla') {
  joystickPort.value = '2';
  featured.hidden = false;
  launchFeatured.hidden = false;
  document.getElementById('launchHint').textContent =
    'WYBIERZ TRYB ZGODNOŚCI PO PRAWEJ, A POTEM URUCHOM GRĘ';
  status.textContent =
    'LOT NAD WISŁĄ jest gotowy. Możesz zaznaczyć Tryb zgodności, a następnie kliknąć URUCHOM LOT NAD WISŁĄ.';
}