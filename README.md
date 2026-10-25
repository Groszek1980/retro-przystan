# RETRO PRZYSTAŃ · Commodore 64

Pierwsza wersja strony poświęconej komputerom retro i naszym grom na Commodore 64.

## Zawartość

- `index.html` — strona główna, katalog gier i informacje o projekcie.
- `player.html` i `player.js` — emulator Commodore 64 oparty na [EmulatorJS](https://emulatorjs.org/docs/systems/commodore-64/).
- `style.css` — responsywna oprawa w klimacie komputerów 8-bitowych.
- `games/` — miejsce na własne pliki gier `.d64` i `.prg`.
- `.nojekyll` — wyłącza przetwarzanie Jekyll przy publikacji z gałęzi na GitHub Pages.

## Publikowanie przez GitHub Pages

Repozytorium: `Groszek1980/retro-przystan` (publiczne). Wgraj wszystkie pliki do katalogu głównego gałęzi `main` (sam `index.html` musi być w głównym katalogu repozytorium). Następnie otwórz **Settings → Pages → Build and deployment** i ustaw **Deploy from a branch**, gałąź **main**, katalog **/(root)**; kliknij **Save**.

Docelowy adres strony: https://groszek1980.github.io/retro-przystan/

## Jak uruchomić lokalnie

W tym folderze uruchom `python -m http.server 8000` (Python 3), następnie wejdź na http://localhost:8000. Nie otwieraj pliku bezpośrednio przez `file://`.

## Jak dodać grę „LOT NAD WISLA”

Po przetestowaniu i wybraniu wersji do publikacji skopiuj własny plik dyskietki do `games/lot-nad-wisla.d64`. Przycisk startu gry na podstronie emulatora pojawi się automatycznie, gdy plik będzie dostępny w opublikowanej witrynie.

## Ważne

- Gry `LOT NAD WISLA` **nie dołączono** do tej wersji prototypu.
- EmulatorJS jest pobierany z zewnętrznego CDN. Rozruch emulatora należy jeszcze zweryfikować w przeglądarce z rzeczywistym plikiem PRG/D64.
- Przesłany przez użytkownika plik jest wczytywany lokalnie jako adres `blob:`. Nie wysyłamy go na serwer witryny.
- Publikuj tylko własne gry lub pliki, do których masz prawo.
- Osobny projekt `lot-nad-wisla` z kodem źródłowym gry pozostaje prywatny.