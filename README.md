# Zajka lernt

Lern-App für die Klausurvorbereitung (Kauffrau für Versicherungen und Finanzanlagen, 1. Ausbildungsjahr). Startet mit Lernfeld 1 „Arbeits- und Ausbildungsrecht“, weitere Lernfelder lassen sich ergänzen.

**App öffnen:** https://arturpeters.github.io/zajka-lernt/

## Aufs iPhone

1. Link oben in **Safari** öffnen.
2. Unten auf **Teilen** (□↑) tippen → **„Zum Home-Bildschirm“** → **Hinzufügen**.
3. Ab jetzt über das Symbol starten. Die App funktioniert dann auch offline.

## Was drin ist

- **Start:** Countdown bis zur Klausur, Fortschritt (Lernpunkte gesamt und pro Thema mit Bronze/Silber/Gold), Tagesziel, Plan bis zum Klausurtag, Level, Serie, Abzeichen
- **Üben:** Schnelltraining, Fehler wiederholen, Paragraphen-Jagd, Rechentraining, Lernkarten, Training nach Thema
- **Fundstellen:** immer vier Paragraphen zum Antippen
- **Selbst prüfen:** Bei Rechenaufgaben aufschreiben, „Lösung zeigen“, selbst als Richtig / Halb / Falsch bewerten (abschaltbar → Auswahl)
- **Spiele:** Memory (Paragraph ↔ Inhalt), Blitzrunde (60 Sek. richtig/falsch), Karten-Kino (Lernkarten laufen von selbst)
- **Lernen:** Lernzettel je Thema, Übungsblätter mit Schreibfeldern (Handytastatur, gespeichert), Paragraphen-Bausteinen und „Lösung vergleichen“ unter jeder Aufgabe
- **Klausuren:** Themenliste der Lehrerin mit Fortschritt und „Üben“ pro Thema; Probetest und zwei Probeklausuren mit Timer und Schreibfeldern, eigene Antworten über der Lösung, Punkte selbst eintragen, Notenschätzung nach IHK-Schlüssel
- **Anleitung:** ⚙︎ → „Anleitung ansehen“

## Fortschritt

Jede Frage gehört zu einem von 73 Lernpunkten. Richtig → Lernpunkt sitzt, Halb → halb, Falsch → eine halbe Stufe zurück. Prozent = Anteil der Lernpunkte, die sitzen (100 % mit rund 75 richtigen Antworten).

## Inhalte

256 Fragen und 12 Fall-Generatoren (`js/subjects/lf1-fragen.js`, `js/subjects/lf1.js`) – nur Stoff aus den Unterrichtsunterlagen (Arbeitsblätter mit Mitschriften, Lernzettel der Klasse, Lernsituation „Anita prüft nach“). Fehler in den Unterlagen stehen als Hinweis in den Lernzetteln.

## Daten

Alles bleibt auf dem Gerät (localStorage). Kein Konto, kein Server, kein Tracking. Sicherung über **⚙︎ → Code kopieren**; dort lässt sich auch der Code aus dem alten LF1-Trainer einlesen. Texte aus den Übungsblättern liegen getrennt unter `zajka-lernt:blaetter` und sind nicht im Sicherungscode.

## Technik

Reines HTML/CSS/JavaScript ohne Build-Schritt, Service Worker für Offline-Betrieb, gehostet über GitHub Pages.

- Neues Lernfeld: `js/subjects/lfX-fragen.js` und `js/subjects/lfX.js` nach dem Muster von LF1 anlegen, in `index.html` und `sw.js` eintragen.
- Bei jeder Änderung `CACHE_NAME` in `sw.js` hochzählen. Dann erscheint in der App der Hinweis „Neue Version da“.
