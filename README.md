# RETRO PRZYSTAŃ — portal retro i gry Commodore 64

Strona: https://groszek1980.github.io/retro-przystan/

## Zawartość

- `index.html` — strona główna, katalog gier i skróty do działów.
- `gry-groszka.html` — projekty „LOT NAD WISŁĄ” i konwersja „MISJA”.
- `komputery-retro.html` — profile Commodore 64, Atari 65XE i Amigi 1200.
- `lot-nad-wisla.html` — opis gry, grafika tytułowa i pobranie demo I1.4.
- `player.html`, `player.js`, `emulator-frame.html` — emulator C64 oparty na EmulatorJS/VICE, obsługujący dwa porty joysticka i tryb zgodności.
- `style.css`, `player-fix.css` — responsywna szata graficzna.
- `games/lot-nad-wisla.d64` — grywalne demo I1.4.
- `.nojekyll` — wyłączenie Jekylla w GitHub Pages.

## Publikacja

Repozytorium `Groszek1980/retro-przystan`, gałąź `main`, katalog `/(root)` w GitHub Pages.

Jeśli GitHub Pages zgłosi błąd "due to in progress deployment", najpierw sprawdź, czy wcześniejsze wdrożenie zostało zakończone; następnie uruchom nowe wdrożenie. Nie wymaga to zmiany aplikacji.

## Uruchomienie lokalne

Z katalogu projektu: `python -m http.server 8000`, następnie `http://localhost:8000`.
EmulatorJS pobiera rdzeń przez internet. Uruchamiaj tylko gry, do których masz prawa.

## Stabilność

Stabilne kopie działającego emulatora są przechowywane w osobnych gałęziach GitHuba. Przy modyfikowaniu treści działów nie zmieniaj plików emulatora ani D64 bez osobnych testów.
