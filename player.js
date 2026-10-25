/* Przeglądarkowy odtwarzacz Commodore 64 oparty na EmulatorJS.
 * Pliki .prg/.d64 są wczytywane do pamięci przeglądarki przez blob URL.
 * Po uruchomieniu wymagane jest przeładowanie strony, aby zmienić grę. */
const CDN = 'https://cdn.emulatorjs.org/stable/data/';
const input = document.getElementById('romFile');
const status = document.getElementById('notice');
const featured = document.getElementById('featuredButton');
let started = false;
let blobUrl = null;

async function startGame(source, title) {
  if (started) return;
  started = true;
  input.disabled = true;
  featured.disabled = true;
  document.getElementById('placeholder').hidden = true;
  document.getElementById('game').hidden = false;
  status.textContent = `Uruchamianie: ${title}. Pierwsze wczytanie emulatora może potrwać chwilę.`;
  window.EJS_player = '#game';
  window.EJS_core = 'c64';
  window.EJS_gameUrl = source;
  window.EJS_gameName = title;
  window.EJS_pathtodata = CDN;
  const loader = document.createElement('script');
  loader.src = CDN + 'loader.js';
  loader.onerror = () => {
    status.textContent = 'Nie udało się załadować emulatora. Sprawdź dostęp do internetu, wyłącz blokowanie skryptów lub spróbuj ponownie.';
  };
  document.body.appendChild(loader);
}

input.addEventListener('change', () => {
  const file = input.files?.[0];
  if (!file || started) return;
  const extension = file.name.toLowerCase().split('.').pop();
  if (!['prg','d64','t64','crt','tap','zip'].includes(extension)) {
    status.textContent = 'Ten format pliku nie jest obsługiwany.';
    return;
  }
  blobUrl = URL.createObjectURL(file);
  startGame(blobUrl, file.name);
});
document.getElementById('resetButton').addEventListener('click', () => location.reload());

/* Włącza przycisk dopiero wtedy, gdy właściciel umieści plik gry pod wskazaną ścieżką. */
fetch('games/lot-nad-wisla.d64', { method: 'HEAD' }).then(response => {
  if (response.ok) {
    featured.hidden = false;
    document.getElementById('game-note').textContent = 'Nasza gra jest już dostępna. Kliknij poniżej, aby uruchomić ją w emulatorze.';
  }
}).catch(() => {});
featured.addEventListener('click', () => startGame('games/lot-nad-wisla.d64', 'LOT NAD WISLA'));
if (new URLSearchParams(location.search).get('game') === 'lot-nad-wisla') {
  document.getElementById('game-note').scrollIntoView({block:'center'});
}
window.addEventListener('pagehide', () => { if (blobUrl) URL.revokeObjectURL(blobUrl); });
