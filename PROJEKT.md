# Murmelband

## Zweck
Murmel-Sortierspiel ohne Werbung als installierbare Web-App (PWA), Hochformat, Vollbild.
Öffentlich unter https://murmeln.rinner.at, kein Login, keine Daten am Server.

## Aufbau / Dateien
| Datei | Inhalt |
|---|---|
| `index.html` | gesamte App: HTML, CSS und Spiellogik (Canvas, Vanilla JS, kein Framework) |
| `sw.js` | Service Worker, cacht die App für den Offline-Betrieb (Cache-Name `murmelband-vN`) |
| `manifest.webmanifest` | PWA-Manifest (Name, Farben, Icons) |
| `icon-*.png`, `apple-touch-icon.png` | App-Icons |

Einzige externe Quelle: Schrift „Baloo 2“ von Google Fonts.

## Datenmodell
Kein Server-Speicher. Nur der erreichte Level liegt im Browser (`localStorage`, Schlüssel `murmelband-level`).

## Spielregeln (Kurzfassung)
- Spielfeld aus Farbblöcken (6 Spalten, 4–7 Reihen). Ein Block ist nur antippbar, wenn er von unten über freie Felder erreichbar ist.
- Ein angetippter Block gibt 9 Murmeln seiner Farbe auf das Band (Platz: 30, ab Level 21 schrittweise weniger, min. 20).
- Unten stehen 4 Spalten mit Bechern; ein Becher nimmt 3 Murmeln seiner Farbe auf.
- Läuft das Band über, ist das Level verloren.
- Levels werden aus der Levelnummer reproduzierbar erzeugt (Zufallsgenerator mit Seed) und sind durch Simulation immer lösbar.
- Schwierigkeit steigt mit dem Level: mehr Reihen und Farben (bis 10), ab Level 3 verdeckte Blöcke („?“), ab Level 21 weniger Bandplatz und stärker gemischte Becher-Reihenfolge.

## Deployment
- Quelle: GitHub-Repository `drinner77-art/Murmelband` (öffentlich), Branch `main`.
- Server: Ordner `~/murmeln` ist ein Klon des Repositories; Caddy liefert ihn direkt aus (kein eigener Container).
  Caddy sperrt `/.git`, `*.zip` und `*.md` (404) und liefert `sw.js` mit `no-cache` aus.
- Neue Version: lokal committen und pushen, dann am Server `cd ~/murmeln && git pull` – kein Neustart nötig.
- Bei jeder Änderung die Cache-Version in `sw.js` hochzählen, sonst sehen installierte Apps den alten Stand.
- Kein Backup nötig (keine Daten am Server, Quelle auf GitHub).

## Offene Punkte
- `murmelband-app.zip` liegt noch im Repository (wird nicht ausgeliefert) – kann gelöscht werden.

## Änderungsprotokoll
- 24.11.2026: Veröffentlicht auf murmeln.rinner.at; erstes rinner.at-Projekt mit Git-Deployment (Pilot).
