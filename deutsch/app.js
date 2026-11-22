"use strict";
/* ==========================================================
   INHALT – alles aus den Unterrichtsmaterialien (Schulportal).
   Wo nicht von der Lehrerin: im Text als "Einschätzung" markiert.
   ========================================================== */

const KLAUSUR = new Date(2026, 10, 24, 8, 0, 0); // Di 24.11.2026, 1.–2. Stunde

const PLAN = [
  {day:"Sonntag, 22.11.", time:"ca. 90 Min.", items:[
    {id:"so1", t:"15 Min: Kapitel 1 und 2 lesen (Werbeträger/Werbemittel, AIDA). Danach ohne Handy aufsagen: WO – WOMIT und die 4 AIDA-Stufen."},
    {id:"so2", t:"15 Min: Kapitel 3 lesen – die 10 sprachlichen Mittel."},
    {id:"so3", t:"15 Min: Karten „Die 10 Mittel“ und „Slogan → Mittel“ durchgehen."},
    {id:"so4", t:"5 Min Pause."},
    {id:"so5", t:"15 Min: Kapitel 5 lesen – Textfunktionen."},
    {id:"so6", t:"15 Min: Abfragen „Alles mischen“. Danach die Fehlerkiste einmal leeren."},
    {id:"so7", t:"Schlafen. Nichts Neues mehr anfangen."}
  ]},
  {day:"Montag, 23.11.", time:"ca. 60 Min. Deutsch – Rest für Mittwoch", items:[
    {id:"mo1", t:"10 Min (morgens oder in der Pause): Fehlerkiste + Karten „Slogan → Mittel“."},
    {id:"mo2", t:"15 Min: Kapitel 4 (Bild und Text) und 6 (Tabu, Stilebenen) lesen, Kapitel 5 Teil Textsortentäuschung."},
    {id:"mo3", t:"10 Min: Teil-C-Trainer (Bereich Klausur) – 2 Aufgaben schriftlich."},
    {id:"mo4", t:"25 Min: Probeklausur der Lehrerin (PDF) auf Papier schreiben. Lösungsseite abdecken! Danach vergleichen."},
    {id:"mo5", t:"Wenn noch Kraft da ist: Zweite Probeklausur hier in der App. Sonst auf Mittwoch umschalten."}
  ]},
  {day:"Dienstag, 24.11.", time:"10 Min. vor der Schule", items:[
    {id:"di1", t:"Nur „Alles auf einen Blick“ (Bereich Lernen, ganz oben) durchlesen. Nichts Neues anfangen."},
    {id:"di2", t:"In der Klausur: bei jeder Antwort ein Beleg aus der Anzeige in „Anführungszeichen“."}
  ]}
];

const CHECKLISTE = [
  {id:"c1", t:"… die vier Phasen des AIDA-Prinzips nennen und an einer Anzeige erläutern.", ch:2},
  {id:"c2", t:"… die Bausteine des strategischen Rahmens (Werbeziel, Zielgruppe, Werbeträger, Werbemittel) von den Gestaltungselementen unterscheiden.", ch:1},
  {id:"c3", t:"… die sprachlichen Mittel der Hilfekarten A und B erkennen, mit Textbeleg benennen und ihre Wirkung erläutern.", ch:3},
  {id:"c4", t:"… die intermodalen Bezüge (additiv, komplementär, hierarchisch, konfliktiv) erklären und das Verhältnis von Bild und Text bestimmen.", ch:4},
  {id:"c5", t:"… die fünf Textfunktionen unterscheiden und Beispielsätzen zuordnen.", ch:5},
  {id:"c6", t:"… erklären, was eine Textsortentäuschung ist.", ch:5},
  {id:"c7", t:"… erklären, was ein Tabu ist, Tabubereiche nennen und Stilebenen unterscheiden.", ch:6}
];

const MITTEL = [
  {n:"Alliteration", e:"Mehrere Wörter hintereinander fangen mit <b>demselben Laut</b> an.", b:"„Fit. Frei. Fokussiert.“", w:"klingt gut, bleibt im Kopf, erzeugt Aufmerksamkeit"},
  {n:"Ellipse", e:"<b>Unvollständiger Satz</b> – meist fehlt das Verb. Man versteht ihn trotzdem.", b:"„Jetzt neu. Nur bei uns.“", w:"kurz und direkt, hebt einzelne Aussagen hervor"},
  {n:"Hyperbel", e:"Starke <b>Übertreibung</b>, die nicht wörtlich stimmen kann.", b:"„Das beste Training deines Lebens.“", w:"erzeugt Aufmerksamkeit, hebt Eigenschaften besonders hervor"},
  {n:"Metapher", e:"Ein <b>Bild ohne „wie“</b>: Ein Wort steht für etwas anderes.", b:"„Der Schlüssel zu deiner Freiheit.“", w:"erzeugt Bilder im Kopf, emotionalisiert"},
  {n:"Neologismus", e:"Ein <b>neu erfundenes Wort</b> oder ein ungewöhnlich verändertes Wort.", b:"„Frischekick“", w:"fällt auf, macht neugierig, bleibt im Gedächtnis"},
  {n:"Personifikation", e:"Ein <b>Ding tut etwas Menschliches</b> (warten, vermissen, lieben).", b:"„Dein Rucksack wartet auf das nächste Abenteuer.“", w:"Produkt wirkt lebendig, schafft Nähe und Sympathie"},
  {n:"Reim", e:"Wörter <b>klingen am Ende</b> gleich.", b:"„Fit im Schritt.“", w:"einprägsam, Botschaft leichter merkbar"},
  {n:"Rhetorische Frage", e:"Eine Frage, auf die <b>niemand wirklich antworten</b> soll.", b:"„Bereit für mehr?“", w:"spricht direkt an, weckt Interesse, regt zum Nachdenken an"},
  {n:"Vergleich", e:"Zwei Dinge werden mit <b>„wie“ oder „als“</b> verbunden.", b:"„Leicht wie eine Feder.“", w:"macht Eigenschaften anschaulich, positiver Eindruck"},
  {n:"Wiederholung", e:"<b>Dasselbe Wort</b> kommt mehrmals vor.", b:"„Guter Kaffee für einen guten Morgen.“", w:"verstärkt die Aussage, betont die Botschaft"}
];

/* Fragenbank: k = Kapitel/Thema, a = Index der richtigen Antwort */
const TOPICS = {
  rahmen:{n:"Werbeträger & Werbemittel", ch:1},
  aida:{n:"AIDA", ch:2},
  mittel:{n:"Sprachliche Mittel", ch:3},
  bild:{n:"Bild und Text", ch:4},
  funktion:{n:"Textfunktionen", ch:5},
  tabu:{n:"Tabu & Stilebenen", ch:6}
};
const Q = [
 // Rahmen
 {id:"r1",k:"rahmen",q:"Welches Beispiel ist ein Werbemittel?",o:["Fernsehen","Plakatwand","Radiospot","Instagram"],a:2,x:"Der Radiospot ist die Werbung selbst (WOMIT). Fernsehen, Plakatwand und Instagram sind Orte/Medien (WO) – also Werbeträger. (Probeklausur A1)"},
 {id:"r2",k:"rahmen",q:"Welches Beispiel ist ein Werbeträger?",o:["Flyer","Zeitung","TV-Spot","Werbebanner"],a:1,x:"Die Zeitung ist das Medium, also WO geworben wird. Flyer, TV-Spot und Werbebanner sind Werbemittel (WOMIT)."},
 {id:"r3",k:"rahmen",q:"Eine Litfaßsäule mit einem Plakat. Was ist die Säule?",o:["Werbeträger","Werbemittel","Werbeziel","Zielgruppe"],a:0,x:"Die Säule trägt die Botschaft zu den Leuten: Werbeträger. Das Plakat darauf ist das Werbemittel."},
 {id:"r4",k:"rahmen",q:"Mit welcher Frage findest du das Werbemittel?",o:["Warum?","Für wen?","Wo?","Womit?"],a:3,x:"Werbeziel = Warum? · Zielgruppe = Für wen? · Werbeträger = Wo? · Werbemittel = Womit?"},
 {id:"r5",k:"rahmen",q:"„Kunden halten und Vertrauen aufbauen“ – was ist das?",o:["Ein Werbeziel (Kundenbindung)","Eine Zielgruppe","Ein Werbeträger","Ein Gestaltungselement"],a:0,x:"Kundenbindung ist ein Werbeziel. Weitere: Absatzförderung, Aufmerksamkeit erzeugen, neue Produkte einführen, Image/Bekanntheit."},
 {id:"r6",k:"rahmen",q:"Welcher Begriff gehört zum strategischen Rahmen – nicht zur Gestaltung?",o:["Farbe","Typografie","Zielgruppe","Logo"],a:2,x:"Zum Rahmen gehören Werbeziel, Zielgruppe, Werbeträger, Werbemittel. Farbe, Typografie und Logo sieht man in der Werbung: Gestaltung."},
 {id:"r7",k:"rahmen",q:"Welcher Begriff ist ein Gestaltungselement?",o:["Werbeziel","Schrift (Typografie)","Werbeträger","Zielgruppe"],a:1,x:"Gestaltung = was man in der fertigen Werbung sieht oder hört: Bild, Farbe, Schrift, Text, Layout, Logo, Musik."},
 {id:"r8",k:"rahmen",q:"Welche Reihenfolge hat die Kette der Werbeplanung?",o:["Werbeziel → Zielgruppe → Werbeträger → Werbemittel","Zielgruppe → Werbemittel → Werbeziel → Werbeträger","Werbemittel → Werbeträger → Zielgruppe → Werbeziel","Werbeträger → Werbeziel → Werbemittel → Zielgruppe"],a:0,x:"Erst warum und für wen – dann wo und womit. Jede Entscheidung baut auf der vorherigen auf."},
 {id:"r9",k:"rahmen",q:"Zeitpunkt und Budget sind laut Unterricht …",o:["die 5. und 6. Frage der Werbeplanung","Rahmenbedingungen eine Ebene darüber","Gestaltungselemente","Werbemittel"],a:1,x:"So steht es auf der Folie: Zeitpunkt und Budget sind keine 5./6. Frage, sondern Rahmenbedingungen eine Ebene darüber."},
 {id:"r10",k:"rahmen",q:"Welche Angaben beschreiben eine Zielgruppe?",o:["Alter, Einkommen, Interessen","Farbe, Schrift, Layout","Radio, Zeitung, Plakatwand","TV-Spot, Flyer, Banner"],a:0,x:"Zielgruppe: Alter, Geschlecht, Bildung, Einkommen/sozialer Status, Interessen/Lebensstil, Mediennutzung."},
 {id:"r11",k:"rahmen",q:"Ein Fußballtrikot mit Firmenlogo: Was ist das Trikot (die Kleidung)?",o:["Werbeträger","Werbemittel","Werbeziel","Zielgruppe"],a:0,x:"Auf der Folie steht Kleidung bei den Werbeträgern. Das Firmenlogo/der Slogan darauf ist das Werbemittel."},
 // AIDA
 {id:"a1",k:"aida",q:"Ein QR-Code mit „Jetzt bestellen!“ unterstützt vor allem …",o:["Attention","Interest","Desire","Action"],a:3,x:"Call-to-Action: Die Zielgruppe soll konkret etwas tun. (Probeklausur A2)"},
 {id:"a2",k:"aida",q:"Ein riesiges Foto, knallige Farben, starker Kontrast – welche Stufe?",o:["Attention","Interest","Desire","Action"],a:0,x:"Blickfang (Eyecatcher) = Aufmerksamkeit = Attention."},
 {id:"a3",k:"aida",q:"Emotionale Bilder von Familie und Sicherheit, Vorteile werden genannt – welche Stufe?",o:["Attention","Interest","Desire","Action"],a:2,x:"Desire: Der Wunsch, das Produkt zu haben, soll entstehen."},
 {id:"a4",k:"aida",q:"Eine überraschende Info macht neugierig auf mehr – welche Stufe?",o:["Attention","Interest","Desire","Action"],a:1,x:"Interest: überraschende Info, konkrete Frage, angedeuteter Nutzen."},
 {id:"a5",k:"aida",q:"Wofür steht das D in AIDA?",o:["Design","Desire – Wunsch","Dialog","Detail"],a:1,x:"Attention – Interest – Desire – Action."},
 {id:"a6",k:"aida",q:"Kontaktdaten und „Jetzt anrufen!“ – welche Stufe?",o:["Attention","Interest","Desire","Action"],a:3,x:"Action: Die Kundin soll handeln (anrufen, bestellen, Website besuchen)."},
 {id:"a7",k:"aida",q:"Was sagt der Merksatz vom AIDA-Blatt über eine Wirkung?",o:["Man darf sie einfach behaupten.","Man begründet sie mit einem konkreten Gestaltungsmittel.","Sie gehört immer zu Action.","Sie ist dasselbe wie die Zielgruppe."],a:1,x:"„Eine Wirkung wird nicht nur behauptet: Sie wird mit einem konkreten Gestaltungsmittel der Werbung begründet.“"},
 {id:"a8",k:"aida",q:"Was beschreibt das AIDA-Prinzip?",o:["Vier Phasen, die Werbung bei Kunden auslösen soll","Vier Werbeträger","Vier Stilebenen","Vier Textfunktionen"],a:0,x:"AIDA = vier Phasen: Aufmerksamkeit, Interesse, Wunsch, Handlung."},
 {id:"a9",k:"aida",q:"Zusatz: Wodurch fällt ein Werbetext laut Infotext auf?",o:["Durch Abweichung vom Gewohnten oder auffällige Wiederholung","Durch möglichst lange Sätze","Durch kleine Schrift","Durch viele Fakten"],a:0,x:"Infotext: ungewohnte Wörter („Schönheitszahnweiß“) oder Wiederholung von Wörtern, Silben, Buchstaben („Ei, ei, ei …“)."},
 {id:"a10",k:"aida",q:"Zusatz: Was ist der Vampireffekt?",o:["Ein sehr auffälliges Element zieht so viel Blick auf sich, dass die Marke untergeht","Werbung, die nur nachts läuft","Ein Tabubruch mit Gewalt","Eine Werbung ohne Bild"],a:0,x:"Karte „Blickführung“: Zieht ein Element zu viel Aufmerksamkeit auf sich, geht die Marke im Gedächtnis unter."},
 // Mittel
 {id:"m1",k:"mittel",q:"„Fit. Frei. Fokussiert.“ – welches Mittel?",o:["Alliteration","Reim","Vergleich","Personifikation"],a:0,x:"F-F-F: gleicher Anfangslaut = Alliteration."},
 {id:"m2",k:"mittel",q:"„Leicht wie eine Feder.“ – welches Mittel?",o:["Metapher","Vergleich","Reim","Neologismus"],a:1,x:"Das „wie“ verrät den Vergleich. Eine Metapher hätte kein „wie“. (Probeklausur A3)"},
 {id:"m3",k:"mittel",q:"„Dein Handy vermisst dich schon.“ – welches Mittel?",o:["Vergleich","Alliteration","Personifikation","Reim"],a:2,x:"Ein Handy kann niemanden vermissen – das Ding tut etwas Menschliches: Personifikation. (Probeklausur B1)"},
 {id:"m4",k:"mittel",q:"„Fit im Schritt.“ – welches Mittel?",o:["Reim","Alliteration","Wiederholung","Vergleich"],a:0,x:"fit – Schritt: hinten gleich = Reim. Alliteration wäre vorne gleich."},
 {id:"m5",k:"mittel",q:"„Das beste Training deines Lebens.“ – welches Mittel?",o:["Metapher","Hyperbel","Reim","Personifikation"],a:1,x:"Starke Übertreibung = Hyperbel."},
 {id:"m6",k:"mittel",q:"„Frischekick“ – welches Mittel?",o:["Alliteration","Vergleich","Neologismus","Rhetorische Frage"],a:2,x:"Neu erfundenes Wort = Neologismus (neo = neu)."},
 {id:"m7",k:"mittel",q:"„Bereit für mehr?“ – welches Mittel?",o:["Reim","Rhetorische Frage","Vergleich","Personifikation"],a:1,x:"Niemand soll wirklich antworten: rhetorische Frage."},
 {id:"m8",k:"mittel",q:"„Der Schlüssel zu deiner Freiheit.“ – welches Mittel?",o:["Metapher","Vergleich","Reim","Alliteration"],a:0,x:"Kein echter Schlüssel, kein „wie“: Metapher."},
 {id:"m9",k:"mittel",q:"„Gute Laune für gute Tage.“ – welches Mittel?",o:["Reim","Vergleich","Wiederholung","Neologismus"],a:2,x:"„gute … gute“: dasselbe Wort zweimal = Wiederholung. (Probeklausur B1)"},
 {id:"m10",k:"mittel",q:"„Jetzt neu. Nur bei uns.“ – welches Mittel?",o:["Hyperbel","Ellipse","Personifikation","Vergleich"],a:1,x:"Das Verb fehlt, man versteht es trotzdem: Ellipse."},
 {id:"m11",k:"mittel",q:"„Weich wie eine Wolke.“ – welches Mittel?",o:["Metapher","Vergleich","Personifikation","Neologismus"],a:1,x:"„wie“ = Vergleich. (Probeklausur B1)"},
 {id:"m12",k:"mittel",q:"„Dein Rucksack wartet auf das nächste Abenteuer.“ – welches Mittel?",o:["Hyperbel","Reim","Personifikation","Neologismus"],a:2,x:"Ein Rucksack kann nicht warten – Personifikation."},
 {id:"m13",k:"mittel",q:"„Guter Kaffee für einen guten Morgen.“ – welches Mittel?",o:["Wiederholung","Vergleich","Hyperbel","Personifikation"],a:0,x:"„guter … guten“ = Wiederholung."},
 {id:"m14",k:"mittel",q:"„Cloud – Ihre Wolke im Büro.“ (Sitzkissen) – welches Mittel?",o:["Vergleich","Metapher","Reim","Rhetorische Frage"],a:1,x:"Das Kissen wird bildlich „Wolke“ genannt, ohne „wie“: Metapher. (Hilfekarte Musterbeispiel)"},
 {id:"m15",k:"mittel",q:"„Schönheitszahnweiß“ – welches Mittel?",o:["Neologismus","Vergleich","Reim","Personifikation"],a:0,x:"Ein ungewohntes, neu gebildetes Wort: Neologismus. (Infotext „Wie Werbung funktioniert“)"},
 {id:"m16",k:"mittel",q:"„Die Flasche, die mit dir geht.“ (Tafel) – welches Mittel?",o:["Personifikation","Reim","Neologismus","Hyperbel"],a:0,x:"Eine Flasche kann nicht gehen – Personifikation. (Einschätzung, keine Lösung der Lehrerin)"},
 {id:"m17",k:"mittel",q:"„Wir schicken Chicken.“ (Lieferando) – welches Mittel?",o:["Reim","Vergleich","Hyperbel","Personifikation"],a:0,x:"schicken – Chicken klingen am Ende gleich: Reim. (Einschätzung)"},
 {id:"m18",k:"mittel",q:"„Groß, gepolstert, geil.“ (Tafel) – welches Mittel?",o:["Alliteration","Reim","Vergleich","Personifikation"],a:0,x:"G-G-G: Alliteration. (Einschätzung)"},
 {id:"m19",k:"mittel",q:"Bei welchem Mittel stehen „wie“ oder „als“?",o:["Metapher","Vergleich","Ellipse","Hyperbel"],a:1,x:"„wie“/„als“ = Vergleich. Ohne = Metapher."},
 {id:"m20",k:"mittel",q:"Satzteile werden bewusst weggelassen, der Sinn bleibt verständlich. Das ist …",o:["Ellipse","Reim","Personifikation","Neologismus"],a:0,x:"Ellipse = unvollständiger Satz."},
 {id:"m21",k:"mittel",q:"Bei welchem Mittel ist der Anfang der Wörter gleich?",o:["Reim","Alliteration","Hyperbel","Ellipse"],a:1,x:"Alliteration = vorne gleich. Reim = hinten gleich."},
 {id:"m22",k:"mittel",q:"Wahr oder falsch: „Leicht wie eine Feder.“ ist eine Metapher.",o:["Wahr","Falsch – es ist ein Vergleich (wegen „wie“)"],a:1,x:"Genau so steht es in der Lösung der Probeklausur (A3)."},
 {id:"m23",k:"mittel",q:"Welche Wirkung passt typisch zur rhetorischen Frage?",o:["Spricht die Zielgruppe direkt an und weckt Interesse","Bildet ein neues Wort","Übertreibt stark","Lässt ein Ding menschlich wirken"],a:0,x:"Hilfekarte B: direkt ansprechen, zum Nachdenken anregen, Interesse wecken."},
 {id:"m24",k:"mittel",q:"Welche Wirkung passt typisch zur Personifikation?",o:["Erhöht das Lesetempo","Produkt wirkt lebendig, schafft Nähe und Sympathie","Macht einen Vergleich","Ist ein Fachwort für Übertreibung"],a:1,x:"Hilfekarte B: lebendiger, emotionale Nähe, Sympathie."},
 {id:"m25",k:"mittel",q:"Zusatz: „Mehr Leben. Mehr Möglichkeiten. Mehr für dich.“ – welches Mittel?",o:["Anapher","Reim","Vergleich","Neologismus"],a:0,x:"Gleiches Wort am Anfang mehrerer Sätze = Anapher (eine besondere Wiederholung). Die Lehrerin nutzt sie in der Probeklausur-Lösung."},
 // Bild und Text
 {id:"b1",k:"bild",q:"Bild und Text sagen dasselbe und verstärken sich. Welcher Bezug?",o:["komplementär","additiv","hierarchisch","konfliktiv"],a:1,x:"additiv = addieren: dasselbe noch einmal obendrauf."},
 {id:"b2",k:"bild",q:"Bild und Text widersprechen sich. Welcher Bezug?",o:["additiv","komplementär","konfliktiv","hierarchisch"],a:2,x:"konfliktiv = Konflikt, Streit. (Probeklausur A3: wahr)"},
 {id:"b3",k:"bild",q:"Bild und Text ergänzen sich – erst zusammen versteht man die Botschaft. Welcher Bezug?",o:["komplementär","additiv","konfliktiv","hierarchisch"],a:0,x:"komplementär = erst zusammen komplett."},
 {id:"b4",k:"bild",q:"Ein Teil ist klar wichtiger als der andere. Welcher Bezug?",o:["additiv","hierarchisch","komplementär","konfliktiv"],a:1,x:"hierarchisch = nach Wichtigkeit geordnet (wie Chef und Mitarbeiter)."},
 {id:"b5",k:"bild",q:"Plakat „Speichenwerk“: Eine Frau lacht beim Radfahren im Regen. Headline: „Regen? Na und.“ Welcher Bezug?",o:["konfliktiv","additiv","hierarchisch","komplementär"],a:1,x:"Lösung der Lehrerin (C2): additiv. Bild und Headline sagen beide: Regen ist kein Problem."},
 {id:"b6",k:"bild",q:"Was heißt „Werbung ist multimodal“?",o:["Sprache, Bild, Farbe, Schrift usw. wirken zusammen","Werbung läuft auf mehreren Werbeträgern","Werbung hat mehrere Zielgruppen","Werbung nutzt alle fünf Textfunktionen"],a:0,x:"Verschiedene Zeichensysteme wirken zusammen. Erst das Zusammenspiel ergibt die ganze Botschaft."},
 {id:"b7",k:"bild",q:"Mit welcher Testfrage prüfst du den Bezug?",o:["Würde der Text ohne das Bild funktionieren?","Wie teuer war die Anzeige?","Welche Stilebene hat das Wort?","Wer hat das AIDA-Prinzip erfunden?"],a:0,x:"Tipp vom Infoblatt: Würde der Text ohne das Bild funktionieren? Und das Bild ohne den Text?"},
 // Textfunktionen
 {id:"f1",k:"funktion",q:"„Die Hausratversicherung kostet ab 4,50 € im Monat.“",o:["Information","Appell","Obligation","Kontakt"],a:0,x:"Preis, Fakten = Information. (Probeklausur B2)"},
 {id:"f2",k:"funktion",q:"„Wir versprechen: Rückruf innerhalb einer Stunde.“",o:["Appell","Obligation","Deklaration","Information"],a:1,x:"Der Absender verpflichtet sich selbst („versprechen“) = Obligation. (Probeklausur B2)"},
 {id:"f3",k:"funktion",q:"„Jetzt wechseln und sparen!“",o:["Kontakt","Information","Appell","Deklaration"],a:2,x:"Befehlsform (Imperativ) = Appell."},
 {id:"f4",k:"funktion",q:"„Liebe Kundin, schön, dass Sie da sind!“",o:["Kontakt","Obligation","Appell","Deklaration"],a:0,x:"Gruß, direkte Anrede, Nähe = Kontakt."},
 {id:"f5",k:"funktion",q:"„Hiermit kündige ich meinen Vertrag.“",o:["Information","Obligation","Deklaration","Appell"],a:2,x:"„hiermit“ + schafft eine neue Realität = Deklaration."},
 {id:"f6",k:"funktion",q:"„Die Kfz-Versicherung ist gesetzlich vorgeschrieben.“",o:["Information","Appell","Kontakt","Obligation"],a:0,x:"Eine Tatsache wird mitgeteilt = Information."},
 {id:"f7",k:"funktion",q:"„Wir garantieren Ihnen 30 Tage Rückgaberecht.“",o:["Appell","Information","Obligation","Kontakt"],a:2,x:"„garantieren“ = Selbstverpflichtung = Obligation."},
 {id:"f8",k:"funktion",q:"Welche Textfunktion dominiert in der Werbung fast immer?",o:["Information","Appell","Deklaration","Kontakt"],a:1,x:"Tipp vom Infoblatt: In der Werbung dominiert fast immer der Appell. Frag dich: Was soll ich tun?"},
 {id:"f9",k:"funktion",q:"„Delial bräunt ideal.“ – Wie wird der Kauf-Appell ausgedrückt?",o:["Direkt","Indirekt","Gar nicht","Als Deklaration"],a:1,x:"Aussagesatz, aber gemeint ist: Kauf Delial! Das ist ein indirekter Appell. (Infotext)"},
 {id:"f10",k:"funktion",q:"Was ist eine Textsortentäuschung?",o:["Ein Text gibt sich als andere Textsorte aus, um seine Absicht (meist Appell) zu verbergen","Ein Text mit Rechtschreibfehlern","Werbung auf dem falschen Werbeträger","Bild und Text widersprechen sich"],a:0,x:"Definition vom Infoblatt Textfunktionen."},
 {id:"f11",k:"funktion",q:"Der Brief der „Gewerbeauskunft-Zentrale“ tut so, als wäre er …",o:["ein amtliches Formular zum Daten-Prüfen","ein Werbeplakat","ein Liebesbrief","ein Zeitungsartikel"],a:0,x:"Barcode, „Erfassung gewerblicher Einträge“, „Ergänzen oder korrigieren Sie bitte …“ – wirkt amtlich."},
 {id:"f12",k:"funktion",q:"Was ist der Gewerbeauskunft-Brief tatsächlich?",o:["Ein Vertragsangebot – also Werbung","Ein Schreiben einer Behörde","Eine Kündigung","Eine Glückwunschkarte"],a:0,x:"Kleingedruckt: „Durch die Unterzeichnung wird der Basiseintrag für zwei Jahre verbindlich bestellt.“ 569,06 € pro Jahr."},
 // Tabu
 {id:"t1",k:"tabu",q:"Was ist ein Tabu?",o:["Eine gesellschaftliche, oft moralische Regel, was man nicht sagen, zeigen oder tun darf","Ein Werbeträger","Ein sprachliches Mittel","Eine Textfunktion"],a:0,x:"Infoblatt: gesellschaftlich verbindliche, oft auf (moralischer) Konvention beruhende Vorschrift. Wer es bricht, muss mit Ablehnung rechnen."},
 {id:"t2",k:"tabu",q:"Welcher ist ein Tabubereich laut Infoblatt?",o:["Religion","Wetter","Mode","Urlaub"],a:0,x:"Tabubereiche u. a.: Leben und Tod, Religion, Armut, Gesundheit und Sucht, Politik und Geschichte, Gewalt, Sexualität, Krankheit und Behinderung, Diskriminierung, Sprache."},
 {id:"t3",k:"tabu",q:"Welcher ist ebenfalls ein Tabubereich laut Infoblatt?",o:["Sport","Krankheit und Behinderung","Technik","Essen"],a:1,x:"Krankheit und Behinderung, z. B. HIV, Inkontinenz, Pflege."},
 {id:"t4",k:"tabu",q:"„speisen“ – welche Stilebene?",o:["gehoben","neutral","salopp","derb"],a:0,x:"Infoblatt: gehoben = Antlitz, speisen."},
 {id:"t5",k:"tabu",q:"„Klamotten“ – welche Stilebene?",o:["gehoben","neutral","salopp","vulgär"],a:2,x:"Infoblatt: salopp = Klamotten."},
 {id:"t6",k:"tabu",q:"„Anziehsachen“ – welche Stilebene?",o:["umgangssprachlich","gehoben","derb","vulgär"],a:0,x:"Infoblatt: umgangssprachlich = Anziehsachen."},
 {id:"t7",k:"tabu",q:"„Gesicht“ – welche Stilebene?",o:["gehoben","neutral","salopp","derb"],a:1,x:"Infoblatt: neutral = Gesicht, Geld. (gehoben wäre „Antlitz“)"},
 {id:"t8",k:"tabu",q:"Welche Reihenfolge der Stilebenen stimmt (von fein nach grob)?",o:["gehoben – neutral – umgangssprachlich – salopp – derb – vulgär","neutral – gehoben – salopp – umgangssprachlich – vulgär – derb","vulgär – derb – neutral – gehoben – salopp – umgangssprachlich","gehoben – salopp – neutral – derb – umgangssprachlich – vulgär"],a:0,x:"Merksatz: „Gerne neue Unterhosen, sagt Dieter verlegen.“ G-N-U-S-D-V"},
 {id:"t9",k:"tabu",q:"Je gröber die Stilebene eines Wortes in der Werbung …",o:["desto eher wirkt es als Tabubruch","desto seriöser wirkt die Werbung","desto mehr Information enthält sie","desto weniger fällt sie auf"],a:0,x:"Infoblatt: Je weiter rechts, desto eher Tabubruch. Aber: Es hängt auch vom Kontext ab – wer sagt es zu wem?"},
 {id:"t10",k:"tabu",q:"Sexismus ist Abwertung wegen …",o:["des Geschlechts","der Herkunft","des sozialen Status","der Religion"],a:0,x:"Rassismus = Herkunft/Hautfarbe · Sexismus = Geschlecht · Klassismus = sozialer Status. Oberbegriff: Diskriminierung."},
 {id:"t11",k:"tabu",q:"Was gewinnt ein Unternehmen typischerweise durch einen Tabubruch?",o:["Viel Aufmerksamkeit – man spricht darüber","Ein garantiert gutes Image","Weniger Kosten für den Werbeträger","Eine neue Textfunktion"],a:0,x:"Gewinn: Aufmerksamkeit. Risiko: schlechtes Image, Ablehnung durch die Zielgruppe. (Arbeitsauftrag Tabubrüche)"}
];

const DECKS = [
  {id:"mittel", n:"Die 10 Mittel", d:"Name → Erkennungszeichen, Beispiel, Wirkung",
   cards: MITTEL.map(m=>({f:m.n, b:`${m.e}<br><br>Beispiel: <i>${m.b}</i><br>Wirkung: ${m.w}`}))
     .concat([{f:"Anapher <small>(Zusatz)</small>", b:"Gleiches Wort am <b>Anfang</b> mehrerer Sätze – eine besondere Wiederholung.<br><br>Beispiel: <i>„Dein Rad. Dein Weg.“</i>"}])},
  {id:"slogan", n:"Slogan → Mittel", d:"Erkennst du das Mittel?",
   cards:[
     {f:"„Weich wie eine Wolke.“", b:"<b>Vergleich</b> – wegen „wie“."},
     {f:"„Dein Handy vermisst dich schon.“", b:"<b>Personifikation</b> – ein Ding „vermisst“."},
     {f:"„Gute Laune für gute Tage.“", b:"<b>Wiederholung</b> – „gute … gute“."},
     {f:"„Fit. Frei. Fokussiert.“", b:"<b>Alliteration</b> – F-F-F."},
     {f:"„Jetzt neu. Nur bei uns.“", b:"<b>Ellipse</b> – das Verb fehlt."},
     {f:"„Das beste Training deines Lebens.“", b:"<b>Hyperbel</b> – starke Übertreibung."},
     {f:"„Der Schlüssel zu deiner Freiheit.“", b:"<b>Metapher</b> – Bild ohne „wie“."},
     {f:"„Frischekick“", b:"<b>Neologismus</b> – neu erfundenes Wort."},
     {f:"„Fit im Schritt.“", b:"<b>Reim</b> – hinten gleich."},
     {f:"„Bereit für mehr?“", b:"<b>Rhetorische Frage</b> – keine echte Antwort erwartet."},
     {f:"„Regen? Na und.“", b:"<b>Rhetorische Frage</b> („Regen?“) und <b>Ellipse</b> – laut Lehrerin beides richtig."},
     {f:"„Speichenwerk. Dein Rad. Dein Weg.“", b:"<b>Anapher</b> (Wiederholung von „Dein“ am Satzanfang) – so in der Lösung der Lehrerin."},
     {f:"„Die Flasche, die mit dir geht.“", b:"<b>Personifikation</b> – eine Flasche „geht mit“. <small>(Einschätzung)</small>"},
     {f:"„Mehr Kraft. Mehr Ausdauer. Mehr Energie.“", b:"<b>Anapher / Wiederholung</b> („Mehr“) und <b>Ellipse</b> (kein Verb). <small>(Einschätzung)</small>"},
     {f:"„Wir schicken Chicken.“", b:"<b>Reim</b> – schicken / Chicken. <small>(Einschätzung)</small>"},
     {f:"„… sorgen für Schmetterlinge in deinem Bauch.“", b:"<b>Metapher</b> – Bild für Verliebtsein, ohne „wie“. <small>(Einschätzung)</small>"},
     {f:"„Delial bräunt ideal.“", b:"<b>Reim</b> – Delial / ideal. <small>(Einschätzung)</small> Laut Infotext außerdem ein <b>indirekter Appell</b>: Gemeint ist „Kauf Delial!“."}
   ]},
  {id:"rahmen", n:"Rahmen & AIDA", d:"WO, WOMIT, WARUM – und die 4 Stufen",
   cards:[
     {f:"Werbeziel", b:"<b>WARUM</b> wird geworben?<br>Absatzförderung, Aufmerksamkeit, Kundenbindung, neue Produkte einführen, Image/Bekanntheit."},
     {f:"Zielgruppe", b:"<b>FÜR WEN</b>?<br>Alter, Geschlecht, Bildung, Einkommen, Interessen, Mediennutzung."},
     {f:"Werbeträger", b:"<b>WO</b> wird geworben? Das Medium, das die Werbung trägt.<br>Fernsehen, Internet, Instagram, Zeitung, Radio, Plakatwand, Kleidung."},
     {f:"Werbemittel", b:"<b>WOMIT</b>? Die Werbung selbst.<br>TV-Spot, Radiospot, Anzeige, Plakat, Flyer, Werbebanner."},
     {f:"A – Attention", b:"<b>Aufmerksamkeit</b>: auffällige Bilder, große Schrift, kräftige Farben, Kontraste.<br><i>„Die Aufmerksamkeit wird erzeugt durch …“</i>"},
     {f:"I – Interest", b:"<b>Interesse</b>: überraschende Info, konkrete Frage, angedeuteter Nutzen.<br><i>„Interesse entsteht durch …“</i>"},
     {f:"D – Desire", b:"<b>Wunsch</b>: emotionale Bilder (Sicherheit, Familie, Freiheit), konkrete Vorteile.<br><i>„Der Wunsch nach … wird geweckt, indem …“</i>"},
     {f:"A – Action", b:"<b>Handlung</b>: Call-to-Action („Jetzt anrufen“), QR-Code, Website, Kontaktdaten.<br><i>„Zur Handlung aufgefordert wird durch …“</i>"}
   ]},
  {id:"funk", n:"Textfunktionen & Bild–Text", d:"Signalwörter und die 4 Bezüge",
   cards:[
     {f:"Information", b:"Will <b>Wissen vermitteln</b>. Fakten, Zahlen, Preise.<br><i>„Die Hausratversicherung kostet ab 4,50 € im Monat.“</i>"},
     {f:"Appell", b:"Leser soll <b>etwas tun oder denken</b>. Imperativ, in Werbung oft indirekt.<br><i>„Jetzt wechseln und sparen!“</i>"},
     {f:"Obligation", b:"Absender <b>verpflichtet sich selbst</b>: versprechen, garantieren.<br><i>„Wir garantieren Ihnen 30 Tage Rückgaberecht.“</i>"},
     {f:"Kontakt", b:"<b>Beziehung</b> zum Leser: Gruß, direkte Anrede, Nähe.<br><i>„Liebe Kundin, schön, dass Sie da sind!“</i>"},
     {f:"Deklaration", b:"Schafft eine <b>neue Realität</b>: „hiermit“, Vertrag, Kündigung.<br><i>„Hiermit kündige ich meinen Vertrag.“</i>"},
     {f:"Textsortentäuschung", b:"Ein Text <b>tut so</b>, als wäre er eine andere Textsorte (Formular, Rechnung, Zeitungsartikel), um seine Absicht – meist einen Appell – zu verstecken."},
     {f:"additiv", b:"Bild und Text sagen <b>dasselbe</b>, verstärken sich."},
     {f:"komplementär", b:"Bild und Text <b>ergänzen</b> sich – erst zusammen versteht man es."},
     {f:"hierarchisch", b:"Ein Teil ist <b>klar wichtiger</b> als der andere."},
     {f:"konfliktiv", b:"Bild und Text <b>widersprechen</b> sich."}
   ]},
  {id:"tabu", n:"Tabu & Stilebenen", d:"Definition, Bereiche, 6 Stufen",
   cards:[
     {f:"Was ist ein Tabu?", b:"Eine gesellschaftlich verbindliche, oft <b>moralische Regel</b>, was man <b>nicht sagen, zeigen oder tun</b> darf. Wer sie bricht, muss mit Ablehnung rechnen."},
     {f:"Nenne 4 Tabubereiche", b:"z. B. Leben und Tod · Religion · Sexualität · Gewalt · Krankheit und Behinderung · Armut · Gesundheit und Sucht · Politik und Geschichte · Diskriminierung · Sprache"},
     {f:"Die 6 Stilebenen", b:"gehoben → neutral → umgangssprachlich → salopp → derb → vulgär<br><i>„Gerne neue Unterhosen, sagt Dieter verlegen.“</i>"},
     {f:"„speisen“, „Antlitz“", b:"<b>gehoben</b>"},
     {f:"„Gesicht“, „Geld“", b:"<b>neutral</b>"},
     {f:"„Anziehsachen“", b:"<b>umgangssprachlich</b>"},
     {f:"„Klamotten“", b:"<b>salopp</b>"},
     {f:"Rassismus · Sexismus · Klassismus", b:"Abwertung wegen <b>Herkunft/Hautfarbe</b> · wegen des <b>Geschlechts</b> · wegen des <b>sozialen Status</b>. Oberbegriff: Diskriminierung."},
     {f:"Tabubruch: Gewinn und Risiko", b:"Gewinn: <b>Aufmerksamkeit</b>, man spricht darüber.<br>Risiko: <b>schlechtes Image</b>, Ablehnung durch die Zielgruppe."}
   ]}
];

const TEILC = [
  {id:"tc1", src:"Probeklausur der Lehrerin, C1",
   ad:{head:"Regen? Na und.", txt:"Plakat des Fahrradladens SPEICHENWERK (fiktiv). Bild: Eine Frau in einem leuchtend orangen Regencape fährt im strömenden Regen Fahrrad und lacht. Grauer Hintergrund. Slogan unten rechts: „Speichenwerk. Dein Rad. Dein Weg.“"},
   task:"Benennen Sie ein sprachliches Mittel mit Textbeleg und erläutern Sie seine Wirkung. (2 P)",
   sol:"<b>Lösung der Lehrerin:</b> Anapher: „Dein Rad. Dein Weg.“ – Durch die Wiederholung von „Dein“ wirkt der Slogan einprägsam und spricht die Kundin persönlich an.<br><br>Auch richtig: rhetorische Frage „Regen?“ (spricht direkt an, weckt Interesse) oder Ellipse „Regen? Na und.“ (kurz, lässig, selbstbewusst)."},
  {id:"tc2", src:"Probeklausur der Lehrerin, C2", same:"tc1",
   task:"Bestimmen Sie den intermodalen Bezug zwischen Bild und Headline. Begründen Sie. (2 P)",
   sol:"<b>Lösung der Lehrerin:</b> additiv: Bild und Headline verstärken sich gegenseitig. Das Bild zeigt eine Frau, die trotz Regen lacht, und die Headline sagt dasselbe: „Regen? Na und.“ Beide vermitteln, dass Regen beim Radfahren kein Problem ist."},
  {id:"tc3", src:"Probeklausur der Lehrerin, C3", same:"tc1",
   task:"Erläutern Sie, wodurch die Anzeige Aufmerksamkeit (Attention) erzeugt. (2 P)",
   sol:"<b>Lösung der Lehrerin:</b> durch das leuchtend orange Regencape vor dem grauen Hintergrund (starker Kontrast, Blickfang) und durch die ungewöhnliche Situation: Die Frau lacht im strömenden Regen. Außerdem fällt die große, kurze Headline sofort ins Auge.<br><br>Erläutern heißt: Merkmal aus der Anzeige nennen und sagen, wie es wirkt."},
  {id:"tc4", src:"Slogan von der Tafel in deiner Klasse",
   ad:{head:"Mehr Kraft. Mehr Ausdauer. Mehr Energie", txt:"Fitnessstudio MOVE: „– komm ins MOVE und bring deine Muskeln in Bewegung.“"},
   task:"Benennen Sie ein sprachliches Mittel mit Textbeleg und erläutern Sie seine Wirkung.",
   sol:"<b>Musterantwort (Einschätzung, keine Lösung der Lehrerin):</b> Anapher: „Mehr Kraft. Mehr Ausdauer. Mehr Energie“. Durch die Wiederholung von „Mehr“ am Satzanfang wirkt der Slogan einprägsam und betont, wie viel man im Studio gewinnt.<br><br>Auch möglich: Ellipse (kein Verb – kurz und direkt) oder der Imperativ „komm“ als Aufforderung (Appell, AIDA: Action)."},
  {id:"tc5", src:"Slogan von der Tafel in deiner Klasse",
   ad:{head:"Du willst stärker, fitter und beweglicher werden?", txt:"„Dann komm ins MOVE und starte jetzt dein kostenloses Probetraining.“"},
   task:"Erläutern Sie, wodurch zur Handlung (Action) aufgefordert wird.",
   sol:"<b>Musterantwort (Einschätzung):</b> Zur Handlung aufgefordert wird durch die Imperative „komm“ und „starte jetzt“ (Call-to-Action). Das kostenlose Probetraining senkt die Hürde – die Kundin kann ohne Risiko sofort anfangen."}
];

const PROBE = {
  min:35,
  parts:[
    {h:"Teil A – Ankreuzen und Wahr/Falsch", tasks:[
      {t:"<b>A1</b> Welches Beispiel ist ein Werbe<b>träger</b>? (1 P)<br>☐ Flyer ☐ Werbebanner ☐ Zeitung ☐ TV-Spot", s:"Zeitung. Flyer, Werbebanner und TV-Spot sind Werbemittel (WOMIT).", p:1},
      {t:"<b>A2</b> Ein riesiges Foto vor knallgelbem Hintergrund unterstützt vor allem welche AIDA-Stufe? (1 P)<br>☐ Attention ☐ Interest ☐ Desire ☐ Action", s:"Attention – großes Bild, kräftige Farbe = Blickfang.", p:1},
      {t:"<b>A3</b> Welcher Begriff gehört zum strategischen Rahmen und nicht zur Gestaltung? (1 P)<br>☐ Farbe ☐ Typografie ☐ Zielgruppe ☐ Logo", s:"Zielgruppe. Farbe, Typografie und Logo sind Gestaltungselemente.", p:1},
      {t:"<b>A4</b> Wahr oder falsch? Verbessern Sie falsche Aussagen. (3 P)<br>1. „Das beste Frühstück der Welt.“ ist eine Hyperbel.<br>2. Bei einem additiven Bezug widersprechen sich Bild und Text.<br>3. Eine Textsortentäuschung liegt vor, wenn Werbung wie ein amtliches Formular aussieht, um ihren Appell zu verstecken.", s:"1 wahr. 2 falsch: Bei additiv sagen Bild und Text dasselbe und verstärken sich. Widerspruch heißt konfliktiv. 3 wahr.", p:3}
    ]},
    {h:"Teil B – Zuordnen", tasks:[
      {t:"<b>B1</b> Ordnen Sie jedem Slogan das sprachliche Mittel zu. (4 P)<br>1 „Dein Sofa sehnt sich nach dir.“<br>2 „Sauber wie nach der Dusche.“<br>3 „Der Durstlöschomat.“<br>4 „Bunte Bälle, beste Laune.“", s:"1 Personifikation (das Sofa „sehnt sich“) · 2 Vergleich („wie“) · 3 Neologismus (neu erfundenes Wort) · 4 Alliteration (B-B-B)", p:4},
      {t:"<b>B2</b> Ordnen Sie jedem Satz die Textfunktion zu. (4 P)<br>1 „Hiermit erteile ich meiner Mutter die Vollmacht für meinen Versicherungsvertrag.“<br>2 „Wir garantieren Ihnen die Regulierung innerhalb von 48 Stunden.“<br>3 „Hallo du, schön, dass du wieder vorbeischaust!“<br>4 „Jetzt Termin vereinbaren!“", s:"1 Deklaration („Hiermit“ + Vollmacht – schafft eine neue Realität) · 2 Obligation („garantieren“) · 3 Kontakt (Gruß, Nähe) · 4 Appell (Imperativ)", p:4},
      {t:"<b>B3</b> Ordnen Sie die Wörter einer Stilebene zu: „speisen“, „Klamotten“. (2 P)", s:"speisen = gehoben · Klamotten = salopp", p:2}
    ]},
    {h:"Teil C – Kurze Analyse", ad:{head:"Wasserschaden? Kein Drama.", txt:"Plakat der Hausratversicherung „Hausfrieden“ (fiktiv) an einer Bushaltestelle. Bild: Wasser tropft von der Wohnzimmerdecke, ein Mann steht entspannt mit einer Kaffeetasse daneben und lächelt. Große weiße Headline auf dunkelblauem Balken. Unten: „Hausfrieden – dein Zuhause atmet auf.“ Daneben ein QR-Code mit „Jetzt Tarif berechnen!“"}, tasks:[
      {t:"<b>C1</b> Benennen Sie zwei sprachliche Mittel mit Textbeleg und erläutern Sie die Wirkung von einem. (3 P)", s:"Rhetorische Frage: „Wasserschaden?“ · Personifikation: „dein Zuhause atmet auf“ · auch richtig: Ellipse „Kein Drama.“<br>Wirkung z. B.: Durch die rhetorische Frage „Wasserschaden?“ wird die Leserin direkt angesprochen. Sie denkt an ihr eigenes Zuhause – das weckt Interesse.", p:3},
      {t:"<b>C2</b> Bestimmen Sie den intermodalen Bezug zwischen Bild und Headline. Begründen Sie. (2 P)", s:"Additiv: Das Bild zeigt einen Mann, der trotz Wasserschaden entspannt bleibt. Die Headline sagt dasselbe: „Kein Drama.“ Beide vermitteln: Mit der Versicherung ist ein Wasserschaden kein Problem.", p:2},
      {t:"<b>C3</b> Erläutern Sie, wodurch zur Handlung (Action) aufgefordert wird. (2 P)", s:"Durch den QR-Code und die Aufforderung „Jetzt Tarif berechnen!“ (Imperativ, Call-to-Action). Die Zielgruppe kann sofort und ohne Aufwand handeln.", p:2},
      {t:"<b>C4</b> Benennen Sie Werbeträger und Werbemittel dieser Anzeige. (2 P)", s:"Werbeträger: Plakatfläche an der Bushaltestelle (WO). Werbemittel: das Plakat (WOMIT).", p:2},
      {t:"<b>C5</b> Erklären Sie, was ein Tabu ist, und nennen Sie zwei Tabubereiche. (2 P)", s:"Ein Tabu ist eine gesellschaftliche, oft moralische Regel, was man nicht sagen, zeigen oder tun darf. Wer es bricht, muss mit Ablehnung rechnen. Zwei Bereiche, z. B. Religion und Sexualität.", p:2}
    ]}
  ]
};

/* ==========================================================
   SPEICHER (nur auf diesem Gerät, darf fehlen)
   ========================================================== */
const KEY = "zajka-deutsch:v1";
function fresh(){ return {plan:{}, self:{}, wrong:[], best:{}, q:{}, ta:{}, kc:{}, pts:{}, timerEnd:null, timerLeft:null, installHidden:false}; }
let S = fresh();
let STORE_OK = false;
try {
  localStorage.setItem(KEY+":test","1");
  STORE_OK = localStorage.getItem(KEY+":test") === "1";
  localStorage.removeItem(KEY+":test");
  const raw = localStorage.getItem(KEY);
  if (raw) S = Object.assign(fresh(), JSON.parse(raw));
} catch(e) { STORE_OK = false; }
function save(){
  try { localStorage.setItem(KEY, JSON.stringify(S)); STORE_OK = true; }
  catch(e) { if (STORE_OK) { STORE_OK = false; route(); } }
}
function isIOS(){ return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
function isStandalone(){ return window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches; }
function noticeHtml(){
  let h = "";
  if (STORE_OK && isIOS() && !isStandalone() && !S.installHidden) h += `<div class="install small"><b>Als App auf den Home-Bildschirm</b>In Safari unten auf <b>Teilen</b> (□↑) → <b>„Zum Home-Bildschirm“</b> → Hinzufügen. Dann über das neue Symbol starten: So bleibt alles sicher gespeichert und die App läuft auch offline.<div><button type="button" class="btn ghost" data-hideinstall>Verstanden</button></div></div>`;
  return h;
}
function bindNotice(){
  const b = document.querySelector("[data-hideinstall]");
  if (b) b.addEventListener("click", ()=>{ S.installHidden = true; save(); route(); });
}

/* ==========================================================
   HILFEN
   ========================================================== */
const $ = (sel, el=document) => el.querySelector(sel);
const app = $("#app");
function applyBars(root){ (root||app).querySelectorAll("[data-w]").forEach(el=>{ el.style.width = Math.max(0,Math.min(100,Number(el.dataset.w)||0)) + "%"; }); }
new MutationObserver(()=>applyBars()).observe(app,{childList:true,subtree:true});
function shuffle(a){ a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function daysLeft(){
  const now = new Date();
  const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d1 = new Date(KLAUSUR.getFullYear(), KLAUSUR.getMonth(), KLAUSUR.getDate());
  return Math.round((d1 - d0) / 86400000);
}
function header(title){
  return `<div class="top"><span class="brand">Deutsch · Werbung</span><span class="date">Klausur Di 24.11.</span></div>` +
    (STORE_OK ? "" : `<div class="storewarn small mb"><b>Achtung: Hier wird nichts gespeichert.</b> Öffne die App in Safari über den Link und füge sie zum Home-Bildschirm hinzu (Teilen □↑ → „Zum Home-Bildschirm“). Dann bleibt alles erhalten.</div>`);
}

/* ==========================================================
   VIEW: PLAN
   ========================================================== */
function viewPlan(){
  const dl = daysLeft();
  let big;
  if (dl > 1) big = `Noch <em>${dl} Tage</em>`;
  else if (dl === 1) big = `<em>Morgen</em> ist Klausur`;
  else if (dl === 0) big = `<em>Heute</em> ist Klausur`;
  else big = `Klausur <em>geschafft</em>`;
  const totalItems = PLAN.reduce((n,d)=>n+d.items.length,0);
  const doneItems = PLAN.reduce((n,d)=>n+d.items.filter(i=>S.plan[i.id]).length,0);
  const selfCount = [0,1,2].map(v=>CHECKLISTE.filter(c=>S.self[c.id]===v).length);
  const sure = Q.filter(q=>S.q[q.id]===1).length;

  app.innerHTML = header() + `
  <div class="stack-lg">
    ${noticeHtml()}
    <section class="poster" aria-label="Countdown">
      <div class="big">${big}</div>
      <div class="sub">Dienstag, 24.11.2026 · 1. und 2. Stunde · 45 Minuten · keine Hilfsmittel</div>
    </section>

    <a class="card stack plain" href="#ueben">
      <div class="row between"><h3>Abfrage-Fortschritt</h3><span class="pill">${sure} von ${Q.length} sicher</span></div>
      <div class="progress" aria-hidden="true"><span data-w="${sure/Q.length*100}"></span></div>
      <p class="small muted">${S.wrong.length ? `${S.wrong.length} ${S.wrong.length===1?"Frage":"Fragen"} in der Fehlerkiste – antippen zum Üben.` : "Zuletzt richtig beantwortete Fragen zählen als sicher."}</p>
    </a>

    <section class="stack">
      <h2>Dein <span class="mark">Lernplan</span></h2>
      <p class="muted small">${doneItems} von ${totalItems} erledigt. Hak ab, was du geschafft hast.</p>
      ${PLAN.map(d=>`
        <div class="card">
          <div class="dayhead"><h3>${d.day}</h3><span class="pill">${d.time}</span></div>
          <div class="mt">
          ${d.items.map(i=>`
            <label class="check ${S.plan[i.id]?'done':''}" for="p-${i.id}">
              <input type="checkbox" id="p-${i.id}" data-plan="${i.id}" ${S.plan[i.id]?'checked':''}>
              <span>${i.t}</span>
            </label>`).join("")}
          </div>
        </div>`).join("")}
    </section>

    <section class="stack">
      <h2>Was kann ich <span class="mark">schon?</span></h2>
      <p class="muted small">Die Checkliste deiner Lehrerin. Wo „teilweise“ oder „noch nicht“ steht: Kapitel antippen und wiederholen.</p>
      <div class="row small"><span class="pill g">sicher: ${selfCount[2]}</span><span class="pill y">teilweise: ${selfCount[1]}</span><span class="pill r">noch nicht: ${selfCount[0]}</span></div>
      <div class="card">
        <p class="small b">Ich kann …</p>
        ${CHECKLISTE.map(c=>`
          <div class="self">
            <span>${c.t}</span>
            <div class="seg" role="group" aria-label="Selbsteinschätzung">
              ${[["2","sicher"],["1","teilweise"],["0","noch nicht"]].map(([v,l])=>`<button type="button" data-self="${c.id}" data-v="${v}" aria-pressed="${S.self[c.id]===Number(v)}">${l}</button>`).join("")}
            </div>
            <button type="button" class="linkish small" data-goch="${c.ch}">→ Kapitel ${c.ch} öffnen</button>
          </div>`).join("")}
      </div>
    </section>

    <section class="stack">
      <h2>So ist die Klausur <span class="mark">aufgebaut</span></h2>
      <div class="card stack">
        <dl class="kv">
          <dt>Teil A</dt><dd>Ankreuzen – nur eine Antwort ist richtig</dd>
          <dt>Teil B</dt><dd>Zuordnen (z. B. Slogan → Mittel)</dd>
          <dt>Teil C</dt><dd>Kurze Analysefragen zu einer Anzeige</dd>
        </dl>
      </div>
      <h3>Die 4 Operatoren</h3>
      <div class="card">
        <dl class="kv">
          <dt>benennen</dt><dd>Fachbegriff + Textstelle als Beleg</dd>
          <dt>bestimmen</dt><dd>Dich für einen Fachbegriff entscheiden</dd>
          <dt>erläutern</dt><dd>Sagen, wie etwas wirkt und warum – mit Beispiel aus der Anzeige</dd>
          <dt>begründen</dt><dd>Deine Entscheidung mit Beobachtungen am Material stützen</dd>
        </dl>
      </div>
      <p class="tip">Eine Wirkung nie nur behaupten. Immer das konkrete Mittel aus der Anzeige dazuschreiben.</p>
    </section>
  </div>`;

  bindNotice();
  app.querySelectorAll("[data-plan]").forEach(cb=>cb.addEventListener("change",()=>{
    S.plan[cb.dataset.plan] = cb.checked; save();
    const y = window.scrollY; viewPlan(); window.scrollTo(0,y);
  }));
  app.querySelectorAll("[data-self]").forEach(b=>b.addEventListener("click",()=>{
    S.self[b.dataset.self] = Number(b.dataset.v); save();
    const y = window.scrollY; viewPlan(); window.scrollTo(0,y);
  }));
  app.querySelectorAll("[data-goch]").forEach(b=>b.addEventListener("click",()=>{
    openChapter = Number(b.dataset.goch); location.hash = "lernen";
  }));
}

/* ==========================================================
   VIEW: LERNEN
   ========================================================== */
let openChapter = null;
function quizBtn(k){ return `<button type="button" class="btn blue wide" data-quiz="${k}">Dieses Kapitel abfragen</button>`; }

function chapters(){
  return [
  {n:1, t:"Planung oder Gestaltung?", s:"Werbeziel, Zielgruppe, Werbeträger, Werbemittel", k:"rahmen", body:`
    <p><b>Kurz gesagt:</b> Der <b>strategische Rahmen</b> wird <i>vor</i> der Werbung geplant. Die <b>Gestaltung</b> siehst oder hörst du <i>in</i> der fertigen Werbung.</p>
    <div class="card flat"><dl class="kv">
      <dt>Werbeziel</dt><dd><b>WARUM?</b> Absatzförderung, Aufmerksamkeit, Kundenbindung, neue Produkte einführen, Image</dd>
      <dt>Zielgruppe</dt><dd><b>FÜR WEN?</b> Alter, Geschlecht, Bildung, Einkommen, Interessen, Mediennutzung</dd>
      <dt>Werbeträger</dt><dd><b>WO?</b> Fernsehen, Internet, Instagram, Zeitung, Radio, Plakatwand, Bus/Bahn, Kleidung</dd>
      <dt>Werbemittel</dt><dd><b>WOMIT?</b> TV-Spot, Radiospot, Anzeige, Plakat, Flyer, Werbebanner, Katalog</dd>
    </dl></div>
    <p class="tip"><b>Eselsbrücke:</b> Werbe<b>träger</b> = das, was die Werbung <b>trägt</b> (Ort, Medium). Werbe<b>mittel</b> = die Werbung <b>selbst</b>. Die Litfaßsäule ist der Träger, das Plakat darauf das Mittel.</p>
    <p><b>Gestaltungselemente:</b> Bild/Motiv (Ort, Figuren, Personen), Farbe, Schrift (Typografie), Text und Sprache, Layout, Logo – im Spot auch Musik, Ton, Ohrwurm, Kamera (Perspektive, Schnitt).</p>
    <p class="warn"><b>Klausurfalle (Probeklausur A1):</b> „Welches ist ein Werbemittel? Fernsehen, Plakatwand, Radiospot, Instagram.“ Nur der <b>Radiospot</b>. Die anderen sind Orte → Werbeträger.</p>
    <p class="extra">Zeitpunkt und Budget sind keine 5. und 6. Frage, sondern Rahmenbedingungen eine Ebene darüber.</p>
    <p><b>Reihenfolge einer Werbeanalyse:</b> 1. Rahmen → 2. Gestaltung → 3. Wirkung (AIDA).</p>
    ${quizBtn("rahmen")}`},

  {n:2, t:"AIDA", s:"Was Werbung im Kopf auslösen soll", k:"aida", body:`
    <p><b>Stell dir vor:</b> Du gehst an einem Plakat vorbei. <b>A</b> – es fällt dir auf. <b>I</b> – du bleibst stehen und liest. <b>D</b> – du denkst „Will ich haben“. <b>A</b> – du scannst den QR-Code und bestellst.</p>
    <div class="stack">
      <div class="card flat"><h3>A – Attention · Aufmerksamkeit</h3><p class="small">Erkennst du an: auffällige Bilder, große Schrift, kräftige Farben, starke Kontraste, Blickfang.</p><p class="small"><i>„Die Aufmerksamkeit wird erzeugt durch …“</i></p></div>
      <div class="card flat"><h3>I – Interest · Interesse</h3><p class="small">Erkennst du an: überraschende Info, konkrete Frage, angedeuteter Nutzen.</p><p class="small"><i>„Interesse entsteht durch …“</i></p></div>
      <div class="card flat"><h3>D – Desire · Wunsch</h3><p class="small">Erkennst du an: emotionale Bilder (Sicherheit, Familie, Freiheit), konkret genannte Vorteile.</p><p class="small"><i>„Der Wunsch nach … wird geweckt, indem …“</i></p></div>
      <div class="card flat"><h3>A – Action · Handlung</h3><p class="small">Erkennst du an: Call-to-Action („Jetzt anrufen“), QR-Code, Website, Kontaktdaten.</p><p class="small"><i>„Zur Handlung aufgefordert wird durch …“</i></p></div>
    </div>
    <p class="warn"><b>Probeklausur A2:</b> QR-Code mit „Jetzt bestellen!“ → <b>Action</b>.</p>
    <p class="tip"><b>Merksatz vom AIDA-Blatt:</b> Eine Wirkung wird nicht nur behauptet. Sie wird mit einem konkreten Gestaltungsmittel begründet.</p>
    <p><b>Analysesatz:</b> „Das Gestaltungsmittel ___ soll bewirken, dass ___. Damit lässt es sich der AIDA-Stufe ___ zuordnen.“</p>
    <p class="extra">AIDA stammt von Elmo Lewis. Er beobachtete, dass erfolgreiche Verkaufsgespräche in vier Phasen ablaufen.</p>
    <div class="card flat stack small">
      <p><span class="pill y">Zusatz</span> <b>Infotext „Wie Werbung funktioniert“</b> (nicht auf der Checkliste)</p>
      <p>Ein Text fällt auf, wenn er sich von der Masse abhebt – durch <b>Abweichung vom Gewohnten</b> (ungewohnte Wörter wie „Schönheitszahnweiß“) oder durch <b>auffällige Wiederholung</b> (von Wörtern, Silben oder Buchstaben, z. B. „Ei, ei, ei …“).</p>
      <p>Unsere Einstellung zu einem Produkt besteht aus drei Faktoren: <b>Emotionen</b> (Gefühle), <b>Motive</b> (Bedürfnisse) und <b>Wissen</b> (Informationen).</p>
      <p><b>Blickführung</b> (Karte „Vertiefung“): Das Auge springt (Saccade) und bleibt kurz stehen (Fixation) – nur dann nimmt es etwas auf. <b>Vampireffekt:</b> Ein zu auffälliges Element (Gesicht, Humor) „saugt“ die Aufmerksamkeit ab, die Marke geht unter. <b>Hot-Spots:</b> Stellen, auf die oft geschaut wird – dort gehört die Kernbotschaft hin.</p>
    </div>
    ${quizBtn("aida")}`},

  {n:3, t:"Die 10 sprachlichen Mittel", s:"Das wichtigste Kapitel – bringt die meisten Punkte", k:"mittel", body:`
    <p>Für jedes Mittel brauchst du drei Dinge: <b>Erkennungszeichen</b>, <b>ein Beispiel</b>, <b>eine Wirkung</b>. Alles von den Hilfekarten A und B.</p>
    <div class="mittel">
      ${MITTEL.map(m=>`<div class="mi"><h4>${m.n}</h4><dl class="kv small">
        <dt>Erkennen</dt><dd>${m.e}</dd>
        <dt>Beispiel</dt><dd class="ex">${m.b}</dd>
        <dt>Wirkung</dt><dd>${m.w}</dd></dl></div>`).join("")}
    </div>
    <h3>Eselsbrücken</h3>
    <ul class="small ul">
      <li><b>Allit</b>eration: „<b>A</b>lle <b>a</b>m <b>A</b>nfang gleich.“</li>
      <li><b>Hyper</b>bel: „hyper“ = zu viel. Das Beste, Größte, Schnellste.</li>
      <li><b>Neo</b>logismus: „neo“ = neu. Das Wort hast du so noch nie gelesen.</li>
      <li><b>Person</b>ifikation: Im Wort steckt „Person“. Das Ding benimmt sich wie ein Mensch.</li>
      <li><b>Vergleich</b>: Steht „wie“ da? Dann Vergleich – keine Metapher.</li>
    </ul>
    <h3>Die 5 Verwechslungsfallen</h3>
    <ol class="small olist">
      <li><b>Vergleich oder Metapher?</b> Mit „wie/als“ = Vergleich. „Leicht wie eine Feder“ ist <b>keine</b> Metapher (Probeklausur A3).</li>
      <li><b>Alliteration oder Wiederholung?</b> Alliteration: verschiedene Wörter, gleicher Anfangslaut. Wiederholung: dasselbe Wort.</li>
      <li><b>Alliteration oder Reim?</b> Alliteration vorne gleich, Reim hinten gleich.</li>
      <li><b>Personifikation oder Metapher?</b> Tut ein Ding etwas Menschliches (vermissen, warten)? → Personifikation.</li>
      <li><b>Mehrere Mittel in einem Satz:</b> „Regen? Na und.“ ist rhetorische Frage <b>und</b> Ellipse – laut Lehrerin beides richtig. Nimm das, das du am besten erklären kannst.</li>
    </ol>
    <div class="card flat stack">
      <p><span class="pill y">Zusatz</span> <b>Anapher</b> – gleiches Wort am <b>Anfang</b> mehrerer Sätze: „Dein Rad. Dein Weg.“ Steht nicht auf der Checkliste, aber die Lehrerin nutzt sie in der Probeklausur-Lösung.</p>
      <p class="small"><b>Tipp:</b> Schreib „Anapher (Wiederholung von ‚Dein‘ am Satzanfang)“ – dann passt beides.</p>
      <p class="small muted">Weitere Zusatz-Mittel (Vertiefungskarte, nicht auf der Checkliste): Antithese „Klein im Preis. Groß im Service.“ · Klimax „Entdecken. Erleben. Bleiben.“ · Parallelismus „Du wählst den Film. Wir liefern die Pizza.“ · Trikolon „Schützen. Vorsorgen. Durchatmen.“</p>
    </div>
    ${quizBtn("mittel")}`},

  {n:4, t:"Bild und Text", s:"additiv, komplementär, hierarchisch, konfliktiv", k:"bild", body:`
    <p>Werbung ist <b>multimodal</b>: Sprache, Bild, Farbe, Schrift und Layout wirken zusammen (im Spot auch Ton und Musik). Die Frage ist: <b>Wie passen Bild und Text zusammen?</b></p>
    <div class="stack">
      <div class="card flat"><h3>additiv</h3><p class="small">Bild und Text sagen <b>dasselbe</b>, sie verstärken sich.</p><p class="small muted">Merke: „addieren“ – dasselbe noch einmal obendrauf.</p></div>
      <div class="card flat"><h3>komplementär</h3><p class="small">Jeder Teil liefert, was dem anderen <b>fehlt</b>. Erst zusammen versteht man es.</p><p class="small muted">Merke: erst zusammen „komplett“.</p></div>
      <div class="card flat"><h3>hierarchisch</h3><p class="small">Ein Teil ist <b>klar wichtiger</b>, der andere Nebensache.</p><p class="small muted">Merke: Chef und Mitarbeiter.</p></div>
      <div class="card flat"><h3>konfliktiv</h3><p class="small">Bild und Text <b>widersprechen</b> sich.</p><p class="small muted">Merke: Konflikt = Streit.</p></div>
    </div>
    <p class="tip"><b>Testfrage:</b> Würde der Text ohne das Bild funktionieren? Und das Bild ohne den Text?</p>
    <p class="warn"><b>Probeklausur C2:</b> „Speichenwerk“: Frau lacht beim Radfahren im Regen + „Regen? Na und.“ → <b>additiv</b>. Beide sagen: Regen ist kein Problem.</p>
    <p><b>Antwortsatz:</b> „Der Bezug ist additiv. Das Bild zeigt ___. Die Headline sagt ___. Beide vermitteln dasselbe, nämlich ___.“</p>
    <p class="extra">Das Infoblatt nennt noch einen fünften Bezug: divergent (auseinanderlaufende Lesarten). Auf der Checkliste stehen nur die vier oben.</p>
    ${quizBtn("bild")}`},

  {n:5, t:"Textfunktionen & Textsortentäuschung", s:"Was will der Text von mir?", k:"funktion", body:`
    <p>Die Textfunktion ist die <b>Absicht</b> des Textes. Du erkennst sie an Signalwörtern.</p>
    <div class="stack">
      <div class="card flat"><h3>Information</h3><p class="small">Wissen vermitteln. Fakten, Zahlen, Preise.</p><p class="small"><i>„Die Hausratversicherung kostet ab 4,50 € im Monat.“</i></p></div>
      <div class="card flat"><h3>Appell</h3><p class="small">Ich soll etwas tun oder denken. Befehlsform: „Jetzt …!“</p><p class="small"><i>„Jetzt wechseln und sparen!“</i></p></div>
      <div class="card flat"><h3>Obligation</h3><p class="small">Der <b>Absender</b> verpflichtet sich selbst: versprechen, garantieren.</p><p class="small"><i>„Wir versprechen: Rückruf innerhalb einer Stunde.“</i></p></div>
      <div class="card flat"><h3>Kontakt</h3><p class="small">Beziehung pflegen: Gruß, direkte Anrede, Sprache der Nähe.</p><p class="small"><i>„Liebe Kundin, schön, dass Sie da sind!“</i></p></div>
      <div class="card flat"><h3>Deklaration</h3><p class="small">Schafft eine <b>neue Realität</b>: „hiermit“, Vertrag, Kündigung, Vollmacht.</p><p class="small"><i>„Hiermit kündige ich meinen Vertrag.“</i></p></div>
    </div>
    <p class="tip"><b>Merksatz I-A-O-K-D:</b> „<b>I</b>ch <b>a</b>tme <b>o</b>hne <b>K</b>ummer <b>d</b>urch.“</p>
    <p><b>Die 3 schnellen Tests:</b> „hiermit“? → Deklaration. Verspricht der Absender etwas? → Obligation. Soll ich etwas tun? → Appell.</p>
    <p class="warn"><b>Wichtig:</b> In der Werbung dominiert fast immer der <b>Appell</b> – oft <b>indirekt</b> als Aussagesatz. „Delial bräunt ideal.“ heißt eigentlich: Kauf Delial!</p>
    <h3>Textsortentäuschung</h3>
    <p>Ein Text <b>tut so</b>, als wäre er eine andere Textsorte (Rechnung, Formular, Zeitungsartikel), um seine eigentliche Absicht – meist einen Appell – zu <b>verstecken</b>.</p>
    <div class="card flat stack small">
      <p><b>Beispiel: Brief der „Gewerbeauskunft-Zentrale“</b></p>
      <p><b>Tut so, als wäre er:</b> ein amtliches Formular zum Daten-Prüfen (Barcode, „Erfassung gewerblicher Einträge“, „Ergänzen oder korrigieren Sie bitte …“, „Stempel/rechtsgültige Unterschrift“).</p>
      <p><b>Ist tatsächlich:</b> Werbung, ein Vertragsangebot (Betreff „Angebot 2012“). Kleingedruckt: „Durch die Unterzeichnung wird der Basiseintrag für zwei Jahre verbindlich bestellt.“ Kosten: 569,06 € pro Jahr, also 1.138,12 € für zwei Jahre.</p>
      <p class="muted">Die Einordnung ist eine Einschätzung – zu diesem Blatt gibt es keine Lösung der Lehrerin.</p>
    </div>
    <p><b>Klausursatz:</b> „Eine Textsortentäuschung liegt vor, wenn ein Werbetext so tut, als wäre er eine andere Textsorte (z. B. ein amtliches Formular), damit der Leser die eigentliche Absicht, den Appell, nicht bemerkt.“</p>
    ${quizBtn("funktion")}`},

  {n:6, t:"Tabu & Stilebenen", s:"Was man nicht sagen darf – und wie grob ein Wort ist", k:"tabu", body:`
    <p><b>Einfach:</b> Ein Tabu ist eine ungeschriebene Regel, was man <b>nicht sagen, zeigen oder tun</b> darf. Wer sie bricht, muss mit Ablehnung rechnen.</p>
    <p class="tip"><b>Klausurdefinition (Infoblatt):</b> „Ein Tabu ist eine gesellschaftlich verbindliche, oft auf (moralischer) Konvention beruhende Vorschrift. Es legt fest, was in einer Gemeinschaft nicht gesagt, gezeigt oder getan werden darf.“</p>
    <h3>Tabubereiche (lerne mindestens 4)</h3>
    <div class="scroll"><table class="t">
      <tr><th>Bereich</th><th>Beispiele</th></tr>
      <tr><td>Leben und Tod</td><td>Geburt, Sterben, Trauer, Krieg</td></tr>
      <tr><td>Religion</td><td>Glaube, religiöse Figuren und Symbole</td></tr>
      <tr><td>Sexualität</td><td>Nacktheit, Erotik, Anspielungen</td></tr>
      <tr><td>Gewalt</td><td>gegen Menschen, Tiere, Kinder</td></tr>
      <tr><td>Krankheit und Behinderung</td><td>z. B. HIV, Inkontinenz, Pflege</td></tr>
      <tr><td>Armut und Ausgrenzung</td><td>Obdachlosigkeit, Existenznot</td></tr>
      <tr><td>Gesundheit und Sucht</td><td>Alkohol, Drogen, Schwangerschaft</td></tr>
      <tr><td>Politik und Geschichte</td><td>Politiker, Militär, NS-Zeit</td></tr>
      <tr><td>Diskriminierung</td><td>Abwertung von Menschengruppen</td></tr>
      <tr><td>Sprache</td><td>derbe oder vulgäre Wörter, Beleidigungen</td></tr>
    </table></div>
    <h3>Die 6 Stilebenen – von fein nach grob</h3>
    <div class="scroll"><table class="t">
      <tr><th>Stilebene</th><th>Beispiel (Infoblatt)</th></tr>
      <tr><td>gehoben</td><td>Antlitz, speisen</td></tr>
      <tr><td>neutral</td><td>Gesicht, Geld</td></tr>
      <tr><td>umgangssprachlich</td><td>Anziehsachen</td></tr>
      <tr><td>salopp</td><td>Klamotten</td></tr>
      <tr><td>derb</td><td>grobe Körperwörter</td></tr>
      <tr><td>vulgär</td><td>Flüche</td></tr>
    </table></div>
    <p class="tip"><b>Merksatz G-N-U-S-D-V:</b> „<b>G</b>erne <b>n</b>eue <b>U</b>nterhosen, <b>s</b>agt <b>D</b>ieter <b>v</b>erlegen.“</p>
    <p>Je gröber ein Wort, desto eher wirkt es in der Werbung als Tabubruch. Aber: Es hängt vom Kontext ab – wer sagt es zu wem?</p>
    <p><b>Gewinn und Risiko eines Tabubruchs:</b> Gewinn = viel Aufmerksamkeit, man spricht darüber. Risiko = schlechtes Image, Ablehnung durch die Zielgruppe.</p>
    <p class="extra">Zusatz: Diskriminierung ist der Oberbegriff. Rassismus = wegen Herkunft/Hautfarbe, Sexismus = wegen des Geschlechts, Klassismus = wegen des sozialen Status.</p>
    <p class="extra">Beispiel (Einschätzung): Lieferando „Ich will ein Rind von dir!“ spielt auf „ein Kind von dir“ an → Tabubereich Sexualität (Anspielung).</p>
    ${quizBtn("tabu")}`},

  {n:7, t:"Teil C: So schreibst du die Antwort", s:"Begriff – Beleg – Wirkung", k:null, body:`
    <p>Mit dem Schema <b>Begriff – Beleg – Wirkung</b> holst du in Teil C fast immer die Punkte.</p>
    <ol class="small olist">
      <li><b>Begriff:</b> Welches Mittel? („Anapher“)</li>
      <li><b>Beleg:</b> Zitat aus der Anzeige in „Anführungszeichen“</li>
      <li><b>Wirkung:</b> Was bewirkt es – und warum? („Dadurch wirkt der Slogan einprägsam, weil …“)</li>
    </ol>
    <div class="card flat stack small">
      <p><b>Satzbausteine</b></p>
      <p>„In der Anzeige wird eine ___ verwendet: „___“. Dadurch wirkt der Slogan ___, weil ___.“</p>
      <p>„Der Bezug ist ___. Das Bild zeigt ___, die Headline sagt ___. Daher ___.“</p>
      <p>„Die Aufmerksamkeit wird erzeugt durch ___. Das wirkt ___, weil ___.“</p>
    </div>
    <p class="tip"><b>Notfall-Plan:</b> Ist es eine Frage? (rhetorische Frage) · Fehlt das Verb? (Ellipse) · Kommt ein Wort zweimal vor? (Wiederholung) · Steht „wie“ da? (Vergleich) · Gleiche Anfangslaute? (Alliteration). Eins passt fast immer.</p>
    <p><b>Zeit in der Klausur:</b> Teil A und B zügig (ca. 15 Min.), dann Teil C. 5 Minuten am Ende: Steht bei jeder Antwort ein Beleg?</p>
    <button type="button" class="btn blue wide" data-go="klausur">Zum Teil-C-Trainer</button>`}
  ];
}

function viewLernen(){
  const ch = chapters();
  app.innerHTML = header() + `
  <div class="stack-lg">
    <div class="stack">
      <h1><span class="mark">Lernen</span></h1>
      <p class="muted">Sieben kurze Kapitel. Lies eins, dann tippe unten auf „Dieses Kapitel abfragen“.</p>
    </div>

    <details class="ch" id="kurz">
      <summary><span class="num y">!</span><span class="ttl"><h3>Alles auf einen Blick</h3><small>Für Dienstag früh – nur durchlesen</small></span><span class="chev" aria-hidden="true">›</span></summary>
      <div class="body small">
        <p><b>WO = Werbeträger</b> (Zeitung, TV, Plakatwand, Instagram) · <b>WOMIT = Werbemittel</b> (Plakat, Spot, Flyer, Banner)</p>
        <p><b>AIDA:</b> Attention (Blickfang) · Interest (Neugier) · Desire (Wunsch) · Action (QR-Code, „Jetzt …!“)</p>
        <div class="scroll"><table class="t">
          <tr><th>Mittel</th><th>Erkennungszeichen</th></tr>
          <tr><td>Alliteration</td><td>gleicher Laut vorne</td></tr>
          <tr><td>Ellipse</td><td>Satz ohne Verb</td></tr>
          <tr><td>Hyperbel</td><td>übertrieben</td></tr>
          <tr><td>Metapher</td><td>Bild ohne „wie“</td></tr>
          <tr><td>Neologismus</td><td>neues Wort</td></tr>
          <tr><td>Personifikation</td><td>Ding tut Menschliches</td></tr>
          <tr><td>Reim</td><td>gleich am Ende</td></tr>
          <tr><td>Rhetorische Frage</td><td>Frage ohne echte Antwort</td></tr>
          <tr><td>Vergleich</td><td>„wie“ / „als“</td></tr>
          <tr><td>Wiederholung</td><td>gleiches Wort mehrmals</td></tr>
          <tr><td>Anapher (Zusatz)</td><td>gleiches Wort am Satzanfang</td></tr>
        </table></div>
        <p><b>Bild–Text:</b> additiv = dasselbe · komplementär = ergänzen sich · hierarchisch = einer wichtiger · konfliktiv = Widerspruch</p>
        <p><b>Textfunktionen:</b> Information (Fakten) · Appell (Imperativ) · Obligation (versprechen, garantieren) · Kontakt (Gruß, Nähe) · Deklaration („hiermit“)</p>
        <p><b>Textsortentäuschung:</b> Werbung tut so, als wäre sie eine andere Textsorte, um den Appell zu verstecken.</p>
        <p><b>Tabu:</b> gesellschaftliche Regel, was man nicht sagen, zeigen, tun darf. <b>Stilebenen:</b> gehoben – neutral – umgangssprachlich – salopp – derb – vulgär</p>
        <p class="tip"><b>Teil C:</b> Begriff – Beleg in „…“ – Wirkung mit „weil“.</p>
      </div>
    </details>

    <div class="stack">
    ${ch.map(c=>`
      <details class="ch" id="ch${c.n}" ${openChapter===c.n?'open':''}>
        <summary><span class="num">${c.n}</span><span class="ttl"><h3>${c.t}</h3><small>${c.s}</small></span><span class="chev" aria-hidden="true">›</span></summary>
        <div class="body">${c.body}</div>
      </details>`).join("")}
    </div>
    <p class="muted small">Alle Inhalte stammen aus deinen Unterrichtsmaterialien. Wo „Einschätzung“ steht, gibt es keine Lösung der Lehrerin.</p>
  </div>`;
  app.querySelectorAll("[data-quiz]").forEach(b=>b.addEventListener("click",()=>{ startQuiz(b.dataset.quiz); }));
  app.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>{ location.hash = b.dataset.go; }));
  if (openChapter){ const el = $("#ch"+openChapter); if (el) setTimeout(()=>el.scrollIntoView({block:"start"}),30); openChapter = null; }
}

/* ==========================================================
   VIEW: ABFRAGEN (Quiz)
   ========================================================== */
let quiz = null;
function startQuiz(kind){
  let pool;
  if (kind === "all") pool = shuffle(Q).slice(0, 15);
  else if (kind === "wrong") pool = shuffle(Q.filter(q=>S.wrong.includes(q.id)));
  else pool = shuffle(Q.filter(q=>q.k===kind));
  if (!pool.length) return;
  quiz = {kind, list:pool.map(q=>({q, order:shuffle(q.o.map((t,i)=>i))})), i:0, right:0, answered:null, again:[]};
  if (location.hash !== "#ueben") location.hash = "ueben"; else viewUeben();
}
function viewUeben(){
  if (quiz) return renderQuiz();
  const topics = Object.entries(TOPICS);
  app.innerHTML = header() + `
  <div class="stack-lg">
    <div class="stack">
      <h1><span class="mark">Abfragen</span></h1>
      <p class="muted">Eine Frage nach der anderen. Was du falsch hast, landet in der Fehlerkiste und kommt wieder.</p>
    </div>
    <button type="button" class="btn wide" data-start="all">Alles mischen · 15 Fragen</button>
    <button type="button" class="btn ghost wide" data-start="wrong" ${S.wrong.length?'':'disabled'}>Fehlerkiste · ${S.wrong.length} ${S.wrong.length===1?'Frage':'Fragen'}</button>
    <div class="stack">
      <h3>Nach Thema</h3>
      <div class="topicgrid">
        ${topics.map(([k,t])=>{
          const qs = Q.filter(q=>q.k===k), n = qs.length;
          const sure = qs.filter(q=>S.q[q.id]===1).length;
          return `<button type="button" class="topicbtn" data-start="${k}"><span>${t.n}</span><small>${sure} von ${n} sicher</small><span class="progress" aria-hidden="true"><span data-w="${sure/n*100}"></span></span></button>`;
        }).join("")}
      </div>
    </div>
  </div>`;
  app.querySelectorAll("[data-start]").forEach(b=>b.addEventListener("click",()=>startQuiz(b.dataset.start)));
}
function renderQuiz(){
  const z = quiz;
  if (z.i >= z.list.length) return renderResult();
  const item = z.list[z.i];
  const q = item.q;
  const title = z.kind==="all" ? "Alles gemischt" : z.kind==="wrong" ? "Fehlerkiste" : TOPICS[z.kind].n;
  const ans = z.answered;
  app.innerHTML = header() + `
  <div class="stack-lg">
    <div class="stack">
      <div class="row between"><span class="pill">${title}</span><span class="small muted">Frage ${z.i+1} von ${z.list.length}</span></div>
      <div class="progress" aria-hidden="true"><span data-w="${(z.i/z.list.length)*100}"></span></div>
    </div>
    <p class="q">${q.q}</p>
    <div class="opts">
      ${item.order.map(oi=>{
        let cls = "opt";
        if (ans!==null){ if (oi===q.a) cls+=" right"; else if (oi===ans) cls+=" wrong"; }
        return `<button type="button" class="${cls}" data-o="${oi}" ${ans!==null?'disabled':''}>${q.o[oi]}</button>`;
      }).join("")}
    </div>
    ${ans!==null ? `
      <div class="fb ${ans===q.a?'ok':'no'}"><b>${ans===q.a?'Richtig!':'Leider falsch – richtig ist: '+q.o[q.a]}</b>${q.x}</div>
      <button type="button" class="btn blue wide" id="next">${z.i+1<z.list.length?'Weiter':'Ergebnis ansehen'}</button>` : ``}
    <button type="button" class="btn ghost wide" id="quit">Abbrechen</button>
  </div>`;
  app.querySelectorAll("[data-o]").forEach(b=>b.addEventListener("click",()=>{
    const o = Number(b.dataset.o);
    z.answered = o;
    S.q[q.id] = o===q.a ? 1 : 0;
    if (o===q.a){
      z.right++;
      S.wrong = S.wrong.filter(id=>id!==q.id);
    } else {
      if (!S.wrong.includes(q.id)) S.wrong.push(q.id);
      z.again.push(q.id);
    }
    save(); renderQuiz();
    const nx = $("#next"); if (nx) nx.scrollIntoView({block:"nearest", behavior:"smooth"});
  }));
  const nx = $("#next");
  if (nx) nx.addEventListener("click",()=>{ z.i++; z.answered=null; renderQuiz(); window.scrollTo(0,0); });
  $("#quit").addEventListener("click",()=>{ quiz=null; viewUeben(); });
}
function renderResult(){
  const z = quiz;
  const n = z.list.length;
  if (TOPICS[z.kind]) { S.best[z.kind] = Math.max(S.best[z.kind]||0, z.right); save(); }
  const pct = Math.round(z.right/n*100);
  let msg = pct>=85 ? "Stark! Das sitzt." : pct>=65 ? "Gut! Die Fehler noch einmal üben." : "Noch nicht sicher – Kapitel kurz lesen und nochmal.";
  app.innerHTML = header() + `
  <div class="stack-lg">
    <div class="poster">
      <div class="big"><em>${z.right}</em> von ${n}</div>
      <div class="sub">${msg}</div>
    </div>
    ${z.again.length ? `<button type="button" class="btn blue wide" id="again">Die ${z.again.length} Fehler sofort nochmal</button>`:''}
    ${TOPICS[z.kind] ? `<button type="button" class="btn ghost wide" id="read">Kapitel ${TOPICS[z.kind].ch} lesen</button>`:''}
    <button type="button" class="btn ghost wide" id="back">Zur Übersicht</button>
  </div>`;
  const ag = $("#again");
  if (ag) ag.addEventListener("click",()=>{
    const ids = z.again;
    quiz = {kind:"wrong", list:shuffle(Q.filter(q=>ids.includes(q.id))).map(q=>({q, order:shuffle(q.o.map((t,i)=>i))})), i:0, right:0, answered:null, again:[]};
    renderQuiz(); window.scrollTo(0,0);
  });
  const rd = $("#read");
  if (rd) rd.addEventListener("click",()=>{ openChapter = TOPICS[z.kind].ch; quiz=null; location.hash="lernen"; });
  $("#back").addEventListener("click",()=>{ quiz=null; viewUeben(); });
}

/* ==========================================================
   VIEW: KARTEIKARTEN
   ========================================================== */
let deck = null;
function viewKarten(){
  if (deck) return renderCard();
  app.innerHTML = header() + `
  <div class="stack-lg">
    <div class="stack">
      <h1><span class="mark">Karten</span></h1>
      <p class="muted">Erst selbst überlegen, dann umdrehen. „Nochmal“ schiebt die Karte nach hinten.</p>
    </div>
    <div class="stack">
      ${DECKS.map(d=>`<button type="button" class="topicbtn" data-deck="${d.id}"><span>${d.n}</span><small>${d.cards.length} Karten · ${d.d}</small></button>`).join("")}
    </div>
  </div>`;
  app.querySelectorAll("[data-deck]").forEach(b=>b.addEventListener("click",()=>{
    const d = DECKS.find(x=>x.id===b.dataset.deck);
    deck = {d, queue:shuffle(d.cards), known:0, flipped:false, total:d.cards.length};
    renderCard();
  }));
}
function renderCard(){
  const k = deck;
  if (!k.queue.length){
    app.innerHTML = header() + `
    <div class="stack-lg">
      <div class="poster"><div class="big"><em>Fertig</em></div><div class="sub">Alle ${k.total} Karten „${k.d.n}“ gewusst.</div></div>
      <button type="button" class="btn blue wide" id="re">Nochmal von vorn</button>
      <button type="button" class="btn ghost wide" id="bk">Andere Karten</button>
    </div>`;
    $("#re").addEventListener("click",()=>{ deck = {d:k.d, queue:shuffle(k.d.cards), known:0, flipped:false, total:k.d.cards.length}; renderCard(); });
    $("#bk").addEventListener("click",()=>{ deck=null; viewKarten(); });
    return;
  }
  const c = k.queue[0];
  app.innerHTML = header() + `
  <div class="stack-lg">
    <div class="stack">
      <div class="row between"><span class="pill">${k.d.n}</span><span class="small muted">${k.known} von ${k.total} gewusst</span></div>
      <div class="progress" aria-hidden="true"><span data-w="${k.known/k.total*100}"></span></div>
    </div>
    <div class="flip ${k.flipped?'on':''}" id="flip" role="button" tabindex="0" aria-label="Karte umdrehen">
      <div class="inner">
        <div class="face front"><div class="front-txt">${c.f}</div><div class="hint">Tippen zum Umdrehen</div></div>
        <div class="face back"><div class="back-txt">${c.b}</div></div>
      </div>
    </div>
    <div class="row two">
      <button type="button" class="btn ghost" id="no" ${k.flipped?'':'disabled'}>Nochmal</button>
      <button type="button" class="btn blue" id="yes" ${k.flipped?'':'disabled'}>Gewusst</button>
    </div>
    <button type="button" class="btn ghost wide" id="quit">Andere Karten</button>
  </div>`;
  const fl = $("#flip");
  // Höhe an den längeren Text anpassen
  const faces = fl.querySelectorAll(".face");
  let h = 260; faces.forEach(f=>{ f.style.position="relative"; h=Math.max(h,f.offsetHeight); f.style.position=""; });
  fl.style.minHeight = h+"px"; fl.querySelector(".inner").style.minHeight = h+"px";
  const flip = ()=>{ k.flipped = !k.flipped; fl.classList.toggle("on", k.flipped); $("#no").disabled = !k.flipped; $("#yes").disabled = !k.flipped; };
  fl.addEventListener("click", flip);
  fl.addEventListener("keydown", e=>{ if (e.key===" "||e.key==="Enter"){ e.preventDefault(); flip(); }});
  $("#no").addEventListener("click",()=>{ k.queue.push(k.queue.shift()); k.flipped=false; renderCard(); });
  $("#yes").addEventListener("click",()=>{ k.queue.shift(); k.known++; k.flipped=false; renderCard(); });
  $("#quit").addEventListener("click",()=>{ deck=null; viewKarten(); });
}

/* ==========================================================
   VIEW: KLAUSUR (Teil-C-Trainer + Probeklausur)
   ========================================================== */
function fmt(s){ const m=Math.floor(s/60), r=s%60; return `${m}:${String(r).padStart(2,"0")}`; }
function adHtml(ad){ return `<div class="ad"><div class="head">${ad.head}</div><p class="small mt">${ad.txt}</p></div>`; }
/* Timer: Endzeit wird gespeichert → läuft weiter, auch wenn die App geschlossen wird. */
let tick = null;
function timerLeft(){
  if (S.timerEnd) return Math.max(0, Math.round((S.timerEnd - Date.now())/1000));
  if (S.timerLeft != null) return S.timerLeft;
  return PROBE.min*60;
}
function paintTimer(){
  const tm = $("#tm"), go = $("#tgo"); if (!tm) { clearInterval(tick); return; }
  const left = timerLeft();
  tm.textContent = left ? fmt(left) : "Zeit um!";
  if (go) go.textContent = S.timerEnd && left ? "Pause" : "Start";
  if (S.timerEnd && !left){ S.timerEnd = null; S.timerLeft = 0; save(); clearInterval(tick); }
}

function viewKlausur(){
  const max = PROBE.parts.reduce((n,p)=>n+p.tasks.reduce((m,t)=>m+t.p,0),0);
  const got = Object.values(S.pts).reduce((a,b)=>a+b,0);
  app.innerHTML = header() + `
  <div class="stack-lg">
    <div class="stack">
      <h1><span class="mark">Klausur</span>-Training</h1>
      <p class="muted">Erst Teil C üben, dann eine ganze Probeklausur unter Zeitdruck. Alles, was du schreibst, bleibt gespeichert.</p>
    </div>

    <section class="stack">
      <h2>Teil-C-Trainer</h2>
      <p class="small muted">Schreib deine Antwort ins Feld. Dann „Musterantwort zeigen“ und mit der Checkliste vergleichen.</p>
      ${TEILC.map((c,i)=>{
        const ad = c.ad || TEILC.find(x=>x.id===c.same).ad;
        return `<div class="card stack" id="${c.id}">
          <div class="row between"><span class="pill">${i+1} / ${TEILC.length}</span><span class="small muted">${c.src}</span></div>
          ${c.same ? `<p class="small muted">Gleiche Anzeige wie Aufgabe 1: „${ad.head}“</p>` : adHtml(ad)}
          <p><b>${c.task}</b></p>
          <label class="small muted" for="ta-${c.id}">Deine Antwort</label>
          <textarea id="ta-${c.id}" data-ta="${c.id}" placeholder="Begriff – Beleg in „…“ – Wirkung mit „weil“"></textarea>
          <button type="button" class="btn ghost wide" data-sol="${c.id}">Musterantwort zeigen</button>
          <div class="sol hidden" id="sol-${c.id}">
            <p class="small">${c.sol}</p>
            <div class="mt">
              ${[["1","Fachbegriff genannt"],["2","Beleg aus der Anzeige in „Anführungszeichen“"],["3","Wirkung erklärt (mit „weil“ / „dadurch“)"]].map(([n,l])=>`
              <label class="check" for="k${n}-${c.id}"><input type="checkbox" id="k${n}-${c.id}" data-kc="${c.id}-${n}" ${S.kc[c.id+"-"+n]?"checked":""}><span>${l}</span></label>`).join("")}
            </div>
          </div>
        </div>`;}).join("")}
    </section>

    <section class="stack" id="probe">
      <h2>Zweite Probeklausur</h2>
      <p class="small muted">Im Stil der Probeklausur deiner Lehrerin, etwas umfangreicher: ${max} Punkte, ${PROBE.min} Minuten. Ohne Hilfsmittel auf Papier schreiben. Danach Lösung zeigen und deine Punkte antippen. Die Probeklausur der Lehrerin (PDF) schreibst du zusätzlich auf Papier – Lösungsseite abdecken.</p>
      <div class="card row between">
        <span class="timer" id="tm" aria-live="polite">${fmt(timerLeft())}</span>
        <div class="row">
          <button type="button" class="btn blue" id="tgo">Start</button>
          <button type="button" class="btn ghost" id="trs">Zurück</button>
        </div>
      </div>
      ${PROBE.parts.map((p,pi)=>`
        <div class="stack">
          <h3>${p.h}</h3>
          ${p.ad ? adHtml(p.ad) : ''}
          ${p.tasks.map((t,ti)=>{
            const key = pi+"-"+ti;
            return `<div class="card stack">
              <p>${t.t}</p>
              <button type="button" class="linkish small" data-ps="${key}">Lösung zeigen</button>
              <div class="hidden stack" id="ps-${key}">
                <div class="sol small">${t.s}</div>
                <div class="pts" role="group" aria-label="Meine Punkte">
                  <span class="small muted">Meine Punkte:</span>
                  ${Array.from({length:t.p+1},(_,v)=>`<button type="button" data-pt="${key}" data-v="${v}" aria-pressed="${S.pts[key]===v}">${v}</button>`).join("")}
                </div>
              </div>
            </div>`;}).join("")}
        </div>`).join("")}
      <div class="card row sumbar between">
        <b>Deine Punkte</b><span class="pill">${got} von ${max}</span>
      </div>
      <button type="button" class="btn ghost wide" id="ptsreset">Punkte und Timer zurücksetzen</button>
      <p class="small muted">Eine Punkte-Noten-Tabelle deiner Lehrerin gibt es nicht. Wichtiger: Was war falsch? Genau das in „Abfragen“ oder bei den Karten nochmal üben.</p>
    </section>
  </div>`;

  app.querySelectorAll("[data-ta]").forEach(ta=>{
    ta.value = S.ta[ta.dataset.ta] || "";
    let t = null;
    ta.addEventListener("input",()=>{ S.ta[ta.dataset.ta] = ta.value; clearTimeout(t); t = setTimeout(save, 300); });
    ta.addEventListener("blur", save);
  });
  app.querySelectorAll("[data-kc]").forEach(cb=>cb.addEventListener("change",()=>{ S.kc[cb.dataset.kc] = cb.checked; save(); }));
  app.querySelectorAll("[data-sol]").forEach(b=>b.addEventListener("click",()=>{
    const el = $("#sol-"+b.dataset.sol); el.classList.toggle("hidden");
    b.textContent = el.classList.contains("hidden") ? "Musterantwort zeigen" : "Musterantwort verbergen";
  }));
  app.querySelectorAll("[data-ps]").forEach(b=>{
    const el = $("#ps-"+b.dataset.ps);
    if (S.pts[b.dataset.ps] != null){ el.classList.remove("hidden"); b.textContent = "Lösung verbergen"; }
    b.addEventListener("click",()=>{
      el.classList.toggle("hidden");
      b.textContent = el.classList.contains("hidden") ? "Lösung zeigen" : "Lösung verbergen";
    });
  });
  app.querySelectorAll("[data-pt]").forEach(b=>b.addEventListener("click",()=>{
    S.pts[b.dataset.pt] = Number(b.dataset.v); save();
    const y = window.scrollY; viewKlausur(); window.scrollTo(0,y);
  }));
  $("#tgo").addEventListener("click",()=>{
    if (S.timerEnd){ S.timerLeft = timerLeft(); S.timerEnd = null; }
    else { const left = timerLeft() || PROBE.min*60; S.timerEnd = Date.now() + left*1000; S.timerLeft = null; }
    save(); paintTimer();
  });
  $("#trs").addEventListener("click",()=>{ S.timerEnd = null; S.timerLeft = null; save(); paintTimer(); });
  $("#ptsreset").addEventListener("click",()=>{
    const b = $("#ptsreset");
    if (b.dataset.sure !== "1"){ b.dataset.sure = "1"; b.textContent = "Wirklich zurücksetzen? Nochmal tippen"; return; }
    S.pts = {}; S.timerEnd = null; S.timerLeft = null; save(); viewKlausur();
  });
  clearInterval(tick); tick = setInterval(paintTimer, 1000); paintTimer();
}

/* ==========================================================
   ROUTER
   ========================================================== */
const VIEWS = {plan:viewPlan, lernen:viewLernen, ueben:viewUeben, karten:viewKarten, klausur:viewKlausur};
function route(){
  const v = (location.hash||"#plan").slice(1);
  const fn = VIEWS[v] || viewPlan;
  document.querySelectorAll(".tabs a").forEach(a=>{ if (a.dataset.v === (VIEWS[v]?v:"plan")) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
  fn();
  if (!(v==="lernen" && openChapter)) window.scrollTo(0,0);
}
document.querySelectorAll(".tabs a").forEach(a=>a.addEventListener("click",()=>{
  if (a.dataset.v==="ueben") quiz=null;
  if (a.dataset.v==="karten") deck=null;
  if (location.hash === "#"+a.dataset.v) route();
}));
window.addEventListener("hashchange", route);
window.addEventListener("pageshow", e=>{ if (e.persisted) route(); });
route();

/* ==========================================================
   OFFLINE & UPDATES (wie pwa.js der LF1-App)
   ========================================================== */
(function(){
  if (!("serviceWorker" in navigator)) return;
  const host = location.hostname;
  const local = location.protocol === "file:" || host === "localhost" || host === "127.0.0.1" || host === "";
  if (local) return;
  const banner = document.getElementById("updateBanner");
  let waiting = null, reloading = false;
  function announce(w){ waiting = w; banner.classList.remove("hidden"); }
  banner.addEventListener("click", ()=>{ if (waiting) waiting.postMessage({type:"SKIP_WAITING"}); else location.reload(); });
  navigator.serviceWorker.addEventListener("controllerchange", ()=>{ if (reloading) return; reloading = true; location.reload(); });
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("sw.js", {scope:"./"}).then(reg=>{
      if (reg.waiting && navigator.serviceWorker.controller) announce(reg.waiting);
      reg.addEventListener("updatefound", ()=>{
        const w = reg.installing; if (!w) return;
        w.addEventListener("statechange", ()=>{ if (w.state === "installed" && navigator.serviceWorker.controller) announce(w); });
      });
      document.addEventListener("visibilitychange", ()=>{ if (document.visibilityState === "visible") reg.update().catch(()=>{}); });
    }).catch(()=>{});
  });
})();
