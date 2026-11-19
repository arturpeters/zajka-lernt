# Zajka lernt

Lern-App für die Klausurvorbereitung (Kauffrau für Versicherungen und Finanzanlagen, 1. Ausbildungsjahr). Startet mit Lernfeld 1 „Arbeits- und Ausbildungsrecht“, weitere Lernfelder lassen sich ergänzen.

**App öffnen:** https://arturpeters.github.io/zajka-lernt/

## Aufs iPhone

1. Link oben in **Safari** öffnen.
2. Unten auf **Teilen** (□↑) tippen → **„Zum Home-Bildschirm“** → **Hinzufügen**.
3. Ab jetzt über das Symbol starten. Die App funktioniert dann auch offline.

## Was drin ist

- **Start:** Countdown bis zur Klausur, Tagesziel, Plan bis zum Klausurtag
- **Üben:** Schnelltraining, Fehler wiederholen, Paragraphen-Jagd, Rechentraining (immer neue Zahlen), Lernkarten, Training nach Thema
- **Antworten tippen:** Fundstellen und Rechenergebnisse werden eingetippt und geprüft (Paragraph, Absatz und Gesetz müssen stimmen; Satz/Nr. werden geprüft, wenn angegeben). In den Einstellungen abschaltbar.
- **Anleitung:** ⚙︎ → „Anleitung ansehen“ (8 Schritte mit Bildern)
- **Lernen:** Lernzettel je Thema, Übungsblätter mit Lösungen (zum Abhaken)
- **Klausuren:** Probetest und zwei Probeklausuren mit Timer, Punkte selbst eintragen, Notenschätzung nach IHK-Schlüssel

## Daten

Alles bleibt auf dem Gerät (localStorage). Kein Konto, kein Server, kein Tracking. Sicherung über **⚙︎ → Code kopieren**; dort lässt sich auch der Code aus dem alten LF1-Trainer einlesen.

## Technik

Reines HTML/CSS/JavaScript ohne Build-Schritt, Service Worker für Offline-Betrieb, gehostet über GitHub Pages.

- Neues Lernfeld: Datei `js/subjects/lfX.js` nach dem Muster von `lf1.js` anlegen, in `index.html` und `sw.js` eintragen.
- Bei jeder Änderung `CACHE_NAME` in `sw.js` hochzählen. Dann erscheint in der App der Hinweis „Neue Version da“.
