# Murmelband

## Zweck
Murmel-Sortierspiel ohne Werbung als installierbare Web-App (PWA), Hochformat, Vollbild.
Öffentlich unter https://murmeln.rinner.at, kein Login, keine Daten am Server.

## Aufbau / Dateien
| Datei | Inhalt |
|---|---|
| `index.html` | gesamte App: HTML, CSS und Spiellogik (Canvas, Vanilla JS, kein Framework) |
| `sw.js` | Service Worker: Seite zuerst aus dem Netz, Icons/Schrift/Manifest zuerst aus dem Cache (Cache-Name `murmelband-vN`) |
| `manifest.webmanifest` | PWA-Manifest (Name, Farben, Icons) |
| `baloo2-latin.woff2`, `OFL.txt` | Schrift „Baloo 2“ (variabel, Stärken 400–800) lokal, Lizenz SIL OFL 1.1 |
| `icon-*.png`, `apple-touch-icon.png` | App-Icons |

Keine externen Quellen (kein Google Fonts, kein CDN).

## Datenmodell
Kein Server-Speicher. Im Browser (`localStorage`):
- `murmelband-level` – zuletzt gespieltes Level
- `murmelband-max` – höchstes erreichtes Level (steigt nur durch Schaffen eines Levels; bei Altbeständen einmalig aus `murmelband-level` übernommen)

## Spielregeln (Kurzfassung)
- Spielfeld aus Farbblöcken (6 Spalten, 4–7 Reihen). Ein Block ist nur antippbar, wenn er von unten über freie Felder erreichbar ist.
- Ein angetippter Block gibt 9 Murmeln seiner Farbe auf das Band (Platz: 30, ab Level 21 schrittweise weniger, min. 20).
- Unten stehen 4 Spalten mit Bechern; ein Becher nimmt 3 Murmeln seiner Farbe auf.
- Läuft das Band über, ist das Level verloren.
- Levels werden aus der Levelnummer reproduzierbar erzeugt (Zufallsgenerator mit Seed) und sind durch Simulation immer lösbar.
- Schwierigkeit steigt mit dem Level: mehr Reihen und Farben (bis 10), ab Level 3 verdeckte Blöcke („?“), ab Level 21 weniger Bandplatz und stärker gemischte Becher-Reihenfolge.

## Bedienung
- **Levelauswahl:** Tipp auf „Level X ▾“. Level 1–142 sind für alle frei wählbar (Konstante `FREI`), darüber nur bis zum erreichten Level. Raster nach Farbwelten gegliedert, „Weiter bei X“ springt zum höchsten erreichten Level.
- **Neu starten:** Rückfrage, sobald im Level schon ein Block angetippt wurde.
- Während Dialogen ist das Spiel pausiert.

## Grafik
- **Farbwelten:** alle Flächenfarben hängen am CSS-Farbton `--h`; je 10 Level eine Welt (`WELTEN`: Lila, Ozean, Sonnenuntergang, Wald, Beere, Nacht, Sand, Lagune, dann von vorne). Canvas-Farben werden über ein Hilfselement (`#probe`) in rgb aufgelöst.
- Hell/Dunkel nach Systemeinstellung (CSS ist für `data-theme` vorbereitet, ein Umschalter fehlt noch).
- Effekte: wandernder Hintergrund, Splitter beim Antippen, Flip bei „?“-Blöcken, Becher-Pop mit Funken, „Combo ×N“ (Becher innerhalb 1,3 s), Konfetti und federnde Karte bei „Level geschafft“, mitlaufende Bandrillen und Zahnräder, Füllwarnung (ab 65 % orange, ab 90 % rot pulsierend), Glasmurmeln mit Wirbel.
- Partikel auf eigener Ebene `#pt` über allen Dialogen, max. 260 gleichzeitig.
- Bei „Bewegung reduzieren“ (`prefers-reduced-motion`) sind Partikel und Animationen aus.

## Deployment
- Quelle: GitHub-Repository `drinner77-art/Murmelband` (öffentlich), Branch `main`. Git-Autor im Repo: `drinner77-art` mit anonymer noreply-Adresse.
- Server: Ordner `~/murmeln` ist ein Klon des Repositories; Caddy liefert ihn direkt aus (kein eigener Container).
  Caddy sperrt `/.git`, `*.zip` und `*.md` (404) und liefert `sw.js` mit `no-cache` aus.
- Neue Version: lokal committen und pushen, dann am Server `cd ~/murmeln && git pull` – kein Neustart nötig.
- Bei jeder Änderung die Cache-Version in `sw.js` hochzählen (installierte Apps holen Schrift/Icons sonst aus dem alten Cache).
- Lokaler Test: Eintrag `murmeln-dev` in `C:\Users\admin\.claude\launch.json` (statischer Server, Port 8137).
  Service Worker lassen sich im Testbrowser nicht registrieren – auf der Live-Seite prüfen. Der Testbrowser hat „Bewegung reduzieren“ aktiv; Effekte nur mit einer temporären Kopie (`RM=false`) testbar.
- Kein Backup nötig (keine Daten am Server, Quelle auf GitHub).

## Offene Punkte
- `murmelband-app.zip` liegt noch im Repository (wird nicht ausgeliefert) – kann gelöscht werden.
- Mögliche Erweiterungen: Pause-Knopf, kurze Anleitung in Level 1, Vibration, Hell/Dunkel-Umschalter, Töne.
- Effekte auf älteren Handys auf Flüssigkeit prüfen.

## Änderungsprotokoll
- 24.11.2026: Veröffentlicht auf murmeln.rinner.at; erstes rinner.at-Projekt mit Git-Deployment (Pilot).
- 24.11.2026: Levelauswahl (1–142 frei), Rückfrage bei „Neu starten“, Schrift lokal, Service Worker lädt Seite zuerst aus dem Netz (v10).
- 24.11.2026: Grafik überarbeitet – Farbwelten, Hintergrund, Partikeleffekte, Combo, Konfetti, Zahnräder, Füllwarnung, Glasmurmeln (v11).
