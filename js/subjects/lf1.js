/* LF1 – Arbeits- und Ausbildungsrecht. Inhalte: Fragen, Rechen-Generatoren, Lernkarten, Lernzettel, Blätter, Probeklausuren. */
(function () {
"use strict";
const TOPICS=[
 {id:"duales",n:"1",name:"Duales System & Ausbildungsvertrag",short:"Vertrag"},
 {id:"pflichten",n:"2",name:"Rechte, Pflichten & Ende der Ausbildung",short:"Pflichten"},
 {id:"jarbschg",n:"3",name:"Jugendarbeitsschutz & Urlaub",short:"JArbSchG"},
 {id:"schule",n:"4",name:"Berufsschule: Freistellung & Anrechnung",short:"Berufsschule"},
 {id:"vertrag",n:"5",name:"Arbeitsvertrag, Rechte & Pflichten",short:"Arbeitsvertrag"},
 {id:"kuendigung",n:"6",name:"Kündigung des Arbeitsverhältnisses",short:"Kündigung"}
];
// type: mc | tf | para | match | order
const Q=[
// ---- 1 Duales System & Vertrag
{id:"d1",t:"duales",type:"mc",q:"Was bedeutet „duales System“ der Berufsausbildung?",o:["Ausbildung an zwei Lernorten: Betrieb und Berufsschule","Ausbildung in zwei Betrieben gleichzeitig","Zwei Abschlussprüfungen bei der IHK","Theorie an der Hochschule, Praxis im Betrieb"],a:0,e:"Der Betrieb vermittelt die Fachpraxis, die Berufsschule Fachtheorie und Allgemeinbildung. Beide arbeiten zusammen."},
{id:"d2",t:"duales",type:"match",q:"Ordne zu: Wer macht was?",pairs:[["Ausbildungsbetrieb","Fachpraxis"],["Berufsschule","Fachtheorie & Allgemeinbildung"],["IHK","Prüfung & Überwachung"]],e:"Betrieb = Praxis, Berufsschule = Theorie, IHK = zuständige Stelle (Prüfungen, Verzeichnis, Beratung)."},
{id:"d3",t:"duales",type:"mc",q:"Wer ist die zuständige Stelle für die Ausbildung zur Kauffrau für Versicherungen und Finanzanlagen?",o:["Die IHK","Die Berufsschule","Die Agentur für Arbeit","Das Arbeitsgericht"],a:0,e:"Für kaufmännische Berufe ist die Industrie- und Handelskammer zuständig.",p:"§ 71 Abs. 2 BBiG"},
{id:"d4",t:"duales",type:"mc",q:"Welche Aufgabe hat die IHK NICHT?",o:["Berufsschulunterricht erteilen","Verzeichnis der Ausbildungsverhältnisse führen","Abschlussprüfungen abnehmen","Ausbildung überwachen und beraten"],a:0,e:"Den Unterricht erteilt die Berufsschule. Die IHK führt das Verzeichnis (§ 34), berät und überwacht (§ 76) und nimmt Prüfungen ab."},
{id:"d5",t:"duales",type:"tf",q:"Der Ausbildungsvertrag kommt erst zustande, wenn er unterschrieben ist.",a:false,e:"Er entsteht schon durch die Einigung (z. B. die Zusage). § 11 BBiG regelt nur, dass der Inhalt danach festgehalten werden muss."},
{id:"d6",t:"duales",type:"para",q:"Bis wann muss der Ausbildende den wesentlichen Vertragsinhalt festhalten? (unverzüglich nach Abschluss, spätestens vor Beginn)",o:["§ 11 Abs. 1 Satz 1 BBiG","§ 20 Satz 2 BBiG","§ 12 Abs. 1 Satz 1 BBiG","§ 36 Abs. 1 Satz 1 BBiG"],a:0,e:"Spätestens vor Beginn der Ausbildung, seit 01.08.2024 in Textform."},
{id:"d7",t:"duales",type:"mc",q:"Wie lang darf die Probezeit in der Ausbildung sein?",o:["Mindestens 1, höchstens 4 Monate","Mindestens 2 Wochen, höchstens 3 Monate","Genau 6 Monate","Höchstens 6 Monate"],a:0,e:"Die Probezeit ist im BBiG fest begrenzt.",p:"§ 20 Satz 2 BBiG"},
{id:"d8",t:"duales",type:"para",q:"Im Ausbildungsvertrag steht: „Probezeit 6 Monate“. Welche Vorschrift verletzt das?",o:["§ 20 Satz 2 BBiG","§ 622 Abs. 3 BGB","§ 12 Abs. 2 Nr. 1 BBiG","§ 22 Abs. 1 BBiG"],a:0,e:"Höchstens 4 Monate. Die 6 Monate aus § 622 Abs. 3 BGB gelten für Arbeitsverhältnisse, nicht für die Ausbildung."},
{id:"d9",t:"duales",type:"para",q:"Bricht die Azubine ab, soll sie 1.000 € Vertragsstrafe zahlen. Fundstelle?",o:["§ 12 Abs. 2 Nr. 2 BBiG","§ 12 Abs. 2 Nr. 1 BBiG","§ 12 Abs. 2 Nr. 4 BBiG","§ 22 Abs. 2 BBiG"],a:0,e:"Vertragsstrafen sind nichtig."},
{id:"d10",t:"duales",type:"para",q:"Der Azubi soll 800 € „Ausbildungsgebühr“ zahlen. Fundstelle?",o:["§ 12 Abs. 2 Nr. 1 BBiG","§ 12 Abs. 2 Nr. 2 BBiG","§ 14 Abs. 1 Nr. 3 BBiG","§ 17 Abs. 1 BBiG"],a:0,e:"Eine Entschädigung für die Ausbildung ist nichtig."},
{id:"d11",t:"duales",type:"para",q:"Beschädigt der Azubi den Laptop, zahlt er pauschal 1.500 €. Fundstelle?",o:["§ 12 Abs. 2 Nr. 4 BBiG","§ 12 Abs. 2 Nr. 3 BBiG","§ 12 Abs. 2 Nr. 2 BBiG","§ 13 Satz 2 Nr. 5 BBiG"],a:0,e:"Schadensersatz in Pauschbeträgen ist nichtig. (Nr. 3 = Ausschluss von Schadensersatzansprüchen)"},
{id:"d12",t:"duales",type:"tf",q:"Vier Monate vor Ausbildungsende verpflichtet sich Lina, danach im Betrieb zu arbeiten. Das ist wirksam.",a:true,e:"Innerhalb der letzten sechs Monate darf eine Übernahme vereinbart werden.",p:"§ 12 Abs. 1 Satz 2 BBiG"},
{id:"d13",t:"duales",type:"tf",q:"Schon im 1. Ausbildungsjahr darf vereinbart werden, dass der Azubi nach der Ausbildung 2 Jahre bleiben muss.",a:false,e:"Eine Beschränkung für die Zeit nach der Ausbildung ist nichtig – Ausnahme nur in den letzten 6 Monaten.",p:"§ 12 Abs. 1 Satz 1 BBiG"},
{id:"d14",t:"duales",type:"mc",q:"Wie heißt der Beruf nach der Ausbildungsordnung 2022 richtig?",o:["Kauffrau für Versicherungen und Finanzanlagen","Kauffrau für Versicherungen und Finanzen","Versicherungskauffrau","Bankkauffrau"],a:0,e:"„Versicherungen und Finanzen“ war die frühere Ausbildung. Ein klassischer Fehler im Vertragscheck."},
{id:"d15",t:"duales",type:"mc",q:"Was ist der Unterschied zwischen Ausbildendem und Ausbilder?",o:["Ausbildender = Vertragspartner (Betrieb); Ausbilder = Person, die tatsächlich ausbildet","Beide Begriffe meinen dasselbe","Ausbilder = Vertragspartner; Ausbildender = Berufsschullehrer","Ausbildender = Azubi; Ausbilder = Betrieb"],a:0,e:"Der Ausbildende kann selbst ausbilden oder einen Ausbilder ausdrücklich beauftragen.",p:"§ 14 Abs. 1 Nr. 2 BBiG"},
{id:"d16",t:"duales",type:"mc",q:"Wie hoch ist die Mindestvergütung im 1. Ausbildungsjahr bei Beginn 2026?",o:["724 €","682 €","649 €","800 €"],a:0,e:"Bei Beginn 2026: 724 € · 854 € · 977 € (1.–3. Jahr).",p:"§ 17 Abs. 2 BBiG"},
{id:"d17",t:"duales",type:"tf",q:"Die Ausbildungsvergütung muss mindestens jährlich steigen.",a:true,e:"Sie steigt mit fortschreitender Berufsausbildung, mindestens jährlich.",p:"§ 17 Abs. 1 Satz 2 BBiG"},
{id:"d18",t:"duales",type:"mc",q:"Welche Form genügt seit 01.08.2024 für die Abfassung des Ausbildungsvertrags?",o:["Textform (auch digital)","Schriftform mit drei Unterschriften","Notarielle Beurkundung","Eine mündliche Absprache"],a:0,e:"Euer Skript nennt noch die alte Fassung (schriftlich + Unterschriften). Schau, was in deiner Gesetzessammlung steht.",p:"§ 11 Abs. 1 Satz 1 BBiG"},
{id:"d19",t:"duales",type:"mc",q:"Was muss die Vertragsabfassung NICHT enthalten?",o:["Die Schulnoten des Azubis","Dauer der Probezeit","Höhe der Vergütung","Dauer des Urlaubs"],a:0,e:"Mindestangaben u. a.: Ziel, Beginn und Dauer, tägliche Ausbildungszeit, Probezeit, Vergütung, Urlaub, Kündigungsvoraussetzungen.",p:"§ 11 Abs. 1 Satz 2 BBiG"},
// ---- 2 Pflichten
{id:"p1",t:"pflichten",type:"para",q:"Die Azubine sitzt beim Beratungsgespräch dabei und soll dem Kunden einen Kaffee reichen. Sie muss das tun – welche Fundstelle?",o:["§ 13 Satz 2 Nr. 1 i. V. m. § 14 Abs. 3 BBiG","§ 14 Abs. 1 Nr. 3 BBiG","§ 12 Abs. 2 Nr. 1 BBiG","§ 22 Abs. 1 BBiG"],a:0,e:"Kundenbewirtung gehört zum Kundenservice und dient dem Ausbildungszweck."},
{id:"p2",t:"pflichten",type:"para",q:"Der Azubi soll das Fachbuch für die Prüfung selbst kaufen. Fundstelle (Nein)?",o:["§ 14 Abs. 1 Nr. 3 BBiG","§ 13 Satz 2 Nr. 5 BBiG","§ 17 Abs. 7 BBiG","§ 14 Abs. 3 BBiG"],a:0,e:"Ausbildungsmittel stellt der Betrieb kostenlos."},
{id:"p3",t:"pflichten",type:"para",q:"Der Ausbilder verbietet, das Berichtsheft während der Arbeitszeit zu führen. Fundstelle?",o:["§ 14 Abs. 2 Satz 2 BBiG","§ 13 Satz 2 Nr. 7 BBiG","§ 43 Abs. 1 Nr. 2 BBiG","§ 15 Abs. 1 Satz 1 BBiG"],a:0,e:"Der Azubi muss Gelegenheit bekommen, den Nachweis am Arbeitsplatz zu führen."},
{id:"p4",t:"pflichten",type:"para",q:"Der Azubi erzählt Freunden, welche Kunden hohe Lebensversicherungen haben. Fundstelle?",o:["§ 13 Satz 2 Nr. 6 BBiG","§ 13 Satz 2 Nr. 4 BBiG","§ 14 Abs. 1 Nr. 5 BBiG","§ 60 Abs. 1 HGB"],a:0,e:"Pflicht, über Betriebs- und Geschäftsgeheimnisse Stillschweigen zu wahren."},
{id:"p5",t:"pflichten",type:"para",q:"Der Azubi muss drei Wochen nur Altakten schreddern. Fundstelle (Nein)?",o:["§ 14 Abs. 3 BBiG","§ 13 Satz 2 Nr. 1 BBiG","§ 14 Abs. 1 Nr. 1 BBiG","§ 12 Abs. 1 BBiG"],a:0,e:"Nur Aufgaben, die dem Ausbildungszweck dienen."},
{id:"p6",t:"pflichten",type:"para",q:"Der Azubi legt sein Berichtsheft nicht vor. Folge?",o:["Keine Zulassung zur Abschlussprüfung – § 43 Abs. 1 Nr. 2 BBiG","Fristlose Kündigung – § 22 Abs. 2 Nr. 1 BBiG","Keine Folge","Abzug von der Vergütung – § 17 Abs. 1 BBiG"],a:0,e:"Reicht er ihn nach, kann er am nächsten Prüfungstermin teilnehmen."},
{id:"p7",t:"pflichten",type:"para",q:"Lina macht drei Überstunden. Was gilt?",o:["Besonders vergüten oder Freizeitausgleich – § 17 Abs. 7 BBiG","Mit der Vergütung abgegolten – § 17 Abs. 1 BBiG","Überstunden sind bei Azubis immer verboten","Nur mit Zustimmung der IHK – § 76 BBiG"],a:0,e:"Jede Beschäftigung über die vereinbarte tägliche Zeit hinaus."},
{id:"p8",t:"pflichten",type:"para",q:"Die Vergütung für November kommt erst am 10. Dezember. Fundstelle?",o:["§ 18 Abs. 2 BBiG","§ 17 Abs. 7 BBiG","§ 19 Abs. 1 BBiG","§ 611a Abs. 2 BGB"],a:0,e:"Spätestens am letzten Arbeitstag des Monats."},
{id:"p9",t:"pflichten",type:"para",q:"Lina will am Arbeitstag vor ihrer schriftlichen Abschlussprüfung frei. Fundstelle?",o:["§ 15 Abs. 1 Satz 2 Nr. 5 BBiG","§ 15 Abs. 1 Satz 2 Nr. 4 BBiG","§ 21 Abs. 2 BBiG","§ 43 Abs. 1 BBiG"],a:0,e:"Nr. 4 = Freistellung für die Prüfung selbst, Nr. 5 = Arbeitstag davor."},
{id:"p10",t:"pflichten",type:"para",q:"Lina verlangt ein Zeugnis mit Angaben zu Leistung und Verhalten. Fundstelle?",o:["§ 16 Abs. 2 Satz 2 BBiG","§ 16 Abs. 1 Satz 1 BBiG","§ 109 Abs. 1 GewO","§ 14 Abs. 1 Nr. 5 BBiG"],a:0,e:"Auf Verlangen des Azubis (qualifiziertes Zeugnis)."},
{id:"p11",t:"pflichten",type:"para",q:"Ole hat bestanden und arbeitet am nächsten Tag ohne Absprache weiter. Was gilt?",o:["Unbefristetes Arbeitsverhältnis – § 24 BBiG","Ausbildung verlängert sich – § 21 Abs. 3 BBiG","Befristetes Arbeitsverhältnis für 6 Monate","Nichts, er muss gehen – § 21 Abs. 1 BBiG"],a:0,e:"Weiterarbeit ohne ausdrückliche Vereinbarung = Arbeitsverhältnis auf unbestimmte Zeit."},
{id:"p12",t:"pflichten",type:"mc",q:"Wann endet die Ausbildung, wenn die Prüfung vor dem Vertragsende bestanden wird?",o:["Mit Bekanntgabe des Ergebnisses durch den Prüfungsausschuss","Am Datum im Vertrag","Am Ende des Monats der Prüfung","Mit Erhalt des Zeugnisses der Berufsschule"],a:0,e:"Beispiel: Vertragsende 31.07., Bekanntgabe 19.06. → Ende 19.06.",p:"§ 21 Abs. 2 BBiG"},
{id:"p13",t:"pflichten",type:"mc",q:"Die Azubine besteht die Abschlussprüfung nicht. Was gilt?",o:["Auf ihr Verlangen Verlängerung bis zur nächsten Wiederholungsprüfung, höchstens 1 Jahr","Die Ausbildung endet sofort","Automatische Verlängerung um 2 Jahre","Der Betrieb entscheidet allein"],a:0,e:"Die Verlängerung gibt es nur, wenn sie es verlangt.",p:"§ 21 Abs. 3 BBiG"},
{id:"p14",t:"pflichten",type:"match",q:"Kündigung in der Ausbildung – ordne zu.",pairs:[["In der Probezeit","jederzeit, ohne Frist"],["Nach der Probezeit, Betrieb","nur aus wichtigem Grund"],["Azubi gibt Ausbildung auf","4 Wochen Frist"],["Form","schriftlich (nach Probezeit mit Gründen)"]],e:"§ 22 Abs. 1 · Abs. 2 Nr. 1 · Abs. 2 Nr. 2 · Abs. 3 BBiG"},
{id:"p15",t:"pflichten",type:"tf",q:"Nach der Probezeit kann die Azubine mit 4 Wochen Frist kündigen, um im selben Beruf den Betrieb zu wechseln.",a:false,e:"Nur wer die Ausbildung aufgibt oder einen anderen Beruf lernt. Für den Wechsel bleibt nur ein Aufhebungsvertrag.",p:"§ 22 Abs. 2 Nr. 2 BBiG"},
{id:"p16",t:"pflichten",type:"tf",q:"Eine fristlose Kündigung der Ausbildung ist unwirksam, wenn die Tatsachen schon länger als zwei Wochen bekannt sind.",a:true,e:"Beispiel: Kenntnis am 02.03., Kündigung am 22.03. → zu spät.",p:"§ 22 Abs. 4 Satz 1 BBiG"},
{id:"p17",t:"pflichten",type:"mc",q:"Wer entscheidet über die Verkürzung der Ausbildungszeit?",o:["Die IHK auf gemeinsamen Antrag von Azubi und Betrieb","Der Betrieb allein","Die Berufsschule","Der Azubi allein"],a:0,e:"„Notendurchschnitt besser als 2,5“ ist eine IHK-Richtlinie, nicht das Gesetz.",p:"§ 8 Abs. 1 Satz 1 BBiG"},
{id:"p18",t:"pflichten",type:"para",q:"Der Chef schickt die Azubine mittags heim („nichts los“) und will den Tag nicht bezahlen. Fundstelle?",o:["§ 19 Abs. 1 Nr. 2 a BBiG","§ 615 Satz 3 BGB","§ 17 Abs. 7 BBiG","§ 18 Abs. 2 BBiG"],a:0,e:"Sie hält sich bereit, die Ausbildung fällt aus → Vergütung weiterzahlen."},
{id:"p19",t:"pflichten",type:"tf",q:"Laptop und Arbeitsplatz pfleglich zu behandeln gehört zu den Pflichten des Azubis.",a:true,e:"Werkzeug, Maschinen und sonstige Einrichtungen pfleglich behandeln.",p:"§ 13 Satz 2 Nr. 5 BBiG"},
{id:"p20",t:"pflichten",type:"para",q:"Kündigung nach der Probezeit per WhatsApp – Fundstelle (unwirksam)?",o:["§ 22 Abs. 3 BBiG","§ 22 Abs. 1 BBiG","§ 623 BGB","§ 11 Abs. 1 BBiG"],a:0,e:"Schriftlich – und nach der Probezeit mit Angabe der Gründe."},
// ---- 3 JArbSchG
{id:"j1",t:"jarbschg",type:"mc",q:"Wer ist Jugendlicher im Sinne des JArbSchG?",o:["Wer 15, aber noch nicht 18 ist","Wer noch nicht 15 ist","Wer 14 bis 18 ist","Wer noch nicht 21 ist"],a:0,e:"Unter 15 = Kind.",p:"§ 2 Abs. 2 JArbSchG"},
{id:"j2",t:"jarbschg",type:"mc",q:"Wie lange dürfen Jugendliche höchstens arbeiten?",o:["8 Std. täglich, 40 Std. wöchentlich","10 Std. täglich, 48 Std. wöchentlich","8 Std. täglich, 48 Std. wöchentlich","9 Std. täglich, 45 Std. wöchentlich"],a:0,e:"8,5 Std. nur, wenn andere Tage derselben Woche kürzer sind (Abs. 2a).",p:"§ 8 Abs. 1 JArbSchG"},
{id:"j3",t:"jarbschg",type:"para",q:"Der minderjährige Azubi soll um 5 Uhr auf der Baustelle sein. Fundstelle (Nein)?",o:["§ 14 Abs. 1 JArbSchG","§ 13 JArbSchG","§ 8 Abs. 1 JArbSchG","§ 22 Abs. 1 JArbSchG"],a:0,e:"Jugendliche nur von 6 bis 20 Uhr."},
{id:"j4",t:"jarbschg",type:"para",q:"Sophie (16) soll samstags ins Büro der Versicherungsagentur. Fundstelle?",o:["§ 16 Abs. 1 JArbSchG","§ 17 Abs. 1 JArbSchG","§ 15 JArbSchG","§ 14 Abs. 1 JArbSchG"],a:0,e:"Samstagsruhe – ein Versicherungsbüro ist keine Ausnahme."},
{id:"j5",t:"jarbschg",type:"para",q:"Finn (16) soll am Sonntag den Messestand betreuen. Fundstelle?",o:["§ 17 Abs. 1 JArbSchG","§ 16 Abs. 1 JArbSchG","§ 14 Abs. 1 JArbSchG","§ 15 JArbSchG"],a:0,e:"Sonntagsruhe."},
{id:"j6",t:"jarbschg",type:"para",q:"Feierabend 19:00 Uhr, nächster Arbeitsbeginn 6:30 Uhr (Sophie, 16). Fundstelle?",o:["§ 13 JArbSchG","§ 14 Abs. 1 JArbSchG","§ 12 JArbSchG","§ 11 Abs. 1 JArbSchG"],a:0,e:"Nur 11,5 Std. statt mindestens 12 Std. Freizeit."},
{id:"j7",t:"jarbschg",type:"para",q:"Drei Pausen à 10 Minuten. Fundstelle?",o:["§ 11 Abs. 1 Satz 3 JArbSchG","§ 11 Abs. 2 Satz 2 JArbSchG","§ 11 Abs. 1 Satz 2 Nr. 1 JArbSchG","§ 4 Abs. 2 JArbSchG"],a:0,e:"Als Ruhepause zählt nur eine Unterbrechung von mindestens 15 Minuten."},
{id:"j8",t:"jarbschg",type:"para",q:"7:30–12:30 Uhr durcharbeiten, dann erst Pause. Fundstelle?",o:["§ 11 Abs. 2 Satz 2 JArbSchG","§ 11 Abs. 1 Satz 3 JArbSchG","§ 8 Abs. 1 JArbSchG","§ 12 JArbSchG"],a:0,e:"Höchstens 4,5 Std. am Stück ohne Pause."},
{id:"j9",t:"jarbschg",type:"para",q:"Der 16-Jährige soll regelmäßig 25-kg-Kartons schleppen. Fundstelle?",o:["§ 22 Abs. 1 Nr. 1 JArbSchG","§ 14 Abs. 1 JArbSchG","§ 32 Abs. 1 JArbSchG","§ 13 Satz 2 Nr. 5 BBiG"],a:0,e:"Keine Arbeiten, die die körperliche Leistungsfähigkeit übersteigen."},
{id:"j10",t:"jarbschg",type:"para",q:"Die Erstuntersuchung ist bei Ausbildungsbeginn 16 Monate alt. Fundstelle?",o:["§ 32 Abs. 1 Nr. 1 JArbSchG","§ 33 Abs. 1 JArbSchG","§ 22 Abs. 1 JArbSchG","§ 35 Abs. 1 BBiG"],a:0,e:"Sie darf höchstens 14 Monate zurückliegen."},
{id:"j11",t:"jarbschg",type:"mc",q:"Wann ist die erste Nachuntersuchung fällig?",o:["Ein Jahr nach Beginn der Beschäftigung","Nach der Probezeit","Vor der Abschlussprüfung","Nur bei Krankheit"],a:0,e:"Liegt die Bescheinigung nach 14 Monaten nicht vor: Beschäftigungsverbot (Abs. 3).",p:"§ 33 Abs. 1 JArbSchG"},
{id:"j12",t:"jarbschg",type:"tf",q:"Für den Urlaub nach dem JArbSchG zählt das Alter zu Beginn des Kalenderjahres.",a:true,e:"Wer im Laufe des Jahres älter wird, behält die Staffel vom 1. Januar.",p:"§ 19 Abs. 2 JArbSchG"},
{id:"j13",t:"jarbschg",type:"match",q:"Alter am 1. Januar → Mindesturlaub",pairs:[["noch nicht 16","30 Werktage"],["noch nicht 17","27 Werktage"],["noch nicht 18","25 Werktage"],["18 oder älter","24 Werktage"]],e:"§ 19 Abs. 2 Satz 1 Nr. 1–3 JArbSchG · ab 18: § 3 Abs. 1 BUrlG"},
{id:"j14",t:"jarbschg",type:"mc",q:"Was sind Werktage?",o:["Alle Kalendertage außer Sonn- und gesetzlichen Feiertagen (Mo–Sa)","Nur Montag bis Freitag","Alle Tage, an denen man tatsächlich arbeitet","Alle 7 Tage der Woche"],a:0,e:"Deshalb sind 24 Werktage bei einer 5-Tage-Woche nur 20 Arbeitstage.",p:"§ 3 Abs. 2 BUrlG"},
{id:"j15",t:"jarbschg",type:"tf",q:"Mo–Do je 8,5 Std. und Freitag 6 Std. ist für einen 16-Jährigen erlaubt.",a:true,e:"4 × 8,5 + 6 = 40 Std.; an einem Tag ist es kürzer.",p:"§ 8 Abs. 2a JArbSchG"},
{id:"j16",t:"jarbschg",type:"mc",q:"Was ist die Schichtzeit?",o:["Arbeitszeit einschließlich der Pausen (max. 10 Std.)","Arbeitszeit ohne Pausen","Zeit zwischen zwei Arbeitstagen","Nur die Pausenzeit"],a:0,e:"Arbeitszeit = ohne Pausen (§ 4 Abs. 1); Schichtzeit = mit Pausen (§ 4 Abs. 2), höchstens 10 Std. (§ 12)."},
{id:"j17",t:"jarbschg",type:"tf",q:"Lena (19) hat 24 Werktage Urlaub, Tim (17) 25 Werktage. Das ist rechtens.",a:true,e:"Lena: § 3 Abs. 1 BUrlG · Tim: § 19 Abs. 2 Satz 1 Nr. 3 JArbSchG"},
{id:"j18",t:"jarbschg",type:"para",q:"Kundenabend: Die 16-Jährige arbeitet bis 21 Uhr. Fundstelle?",o:["§ 14 Abs. 1 JArbSchG","§ 13 JArbSchG","§ 8 Abs. 1 JArbSchG","§ 16 Abs. 1 JArbSchG"],a:0,e:"Nachtruhe: Arbeit nur zwischen 6 und 20 Uhr."},
// ---- 4 Berufsschule
{id:"s1",t:"schule",type:"mc",q:"Der Unterricht beginnt um 8:15 Uhr. Darf der Azubi vorher im Betrieb arbeiten?",o:["Nein – vor einem vor 9 Uhr beginnenden Unterricht nicht","Ja, bis 30 Minuten vorher","Ja, wenn er volljährig ist","Ja, wenn er zustimmt"],a:0,e:"Gilt seit 2020 auch für Volljährige.",p:"§ 15 Abs. 1 Satz 1 BBiG / § 9 Abs. 1 Satz 2 Nr. 1 JArbSchG"},
{id:"s2",t:"schule",type:"tf",q:"Beginnt der Unterricht um 9:30 Uhr, darf vorher im Betrieb gearbeitet werden.",a:true,e:"Das Verbot gilt nur bei Unterrichtsbeginn vor 9 Uhr.",p:"§ 15 Abs. 1 Satz 1 BBiG"},
{id:"s3",t:"schule",type:"mc",q:"Wann ist ein Berufsschultag ein „langer“ Tag (frei, keine Rückkehr)?",o:["Bei mehr als 5 Unterrichtsstunden à mind. 45 Min.","Ab 5 Unterrichtsstunden","Ab 4 Zeitstunden","Wenn der Unterricht nach 13 Uhr endet"],a:0,e:"Einmal in der Woche.",p:"§ 15 Abs. 1 Satz 2 Nr. 2 BBiG / § 9 Abs. 1 Satz 2 Nr. 2 JArbSchG"},
{id:"s4",t:"schule",type:"tf",q:"Genau 5 Unterrichtsstunden reichen für einen freien Nachmittag.",a:false,e:"Es müssen MEHR als fünf sein. Bei genau 5 zurück in den Betrieb."},
{id:"s5",t:"schule",type:"mc",q:"Zwei Schultage mit je 6 Unterrichtsstunden in einer Woche. Was gilt?",o:["Nur an einem Tag frei – der Betrieb bestimmt, an welchem","An beiden Tagen frei","Der Azubi entscheidet","An keinem Tag frei"],a:0,e:"Der freie Nachmittag gilt einmal in der Woche."},
{id:"s6",t:"schule",type:"mc",q:"Mit welcher Zeit wird ein langer Berufsschultag angerechnet?",o:["Mit der durchschnittlichen täglichen Ausbildungszeit","Nur mit der Unterrichtszeit","Mit der Unterrichtszeit ohne Pausen","Gar nicht"],a:0,e:"Bei 40 Std./5 Tage = 8 Std.",p:"§ 15 Abs. 2 Nr. 2 BBiG / § 9 Abs. 2 Nr. 1 JArbSchG"},
{id:"s7",t:"schule",type:"mc",q:"Was wird an einem „normalen“ Schultag (≤ 5 Std.) angerechnet?",o:["Unterrichtszeit inkl. Pausen + notwendige Wegezeit zum Betrieb","Nur die reine Unterrichtszeit","Die durchschnittliche tägliche Ausbildungszeit","Unterricht + Weg von zu Hause"],a:0,e:"Die Wegezeit Schule → Betrieb zählt seit 01.08.2024.",p:"§ 15 Abs. 2 Nr. 1 BBiG"},
{id:"s8",t:"schule",type:"tf",q:"Der Weg von zu Hause zur Berufsschule wird auf die Ausbildungszeit angerechnet.",a:false,e:"Angerechnet wird nur die notwendige Wegezeit zwischen Berufsschule und Ausbildungsstätte."},
{id:"s9",t:"schule",type:"para",q:"Videounterricht der Berufsschule: Ausbilder sagt „Das ist kein Unterricht“. Fundstelle?",o:["§ 15 Abs. 1 Satz 2 Nr. 1 BBiG","§ 15 Abs. 1 Satz 1 BBiG","§ 14 Abs. 3 BBiG","§ 13 Satz 2 Nr. 2 BBiG"],a:0,e:"Die Freistellung gilt auch für virtuellen Unterricht."},
{id:"s10",t:"schule",type:"mc",q:"Der Unterricht fällt komplett aus. Was muss der Azubi tun?",o:["In den Betrieb gehen","Zu Hause bleiben, der Tag ist frei","Einen Urlaubstag nehmen","Nichts, die Schule meldet es"],a:0,e:"Die Freistellungspflicht besteht nur für tatsächlichen Unterricht."},
{id:"s11",t:"schule",type:"mc",q:"Blockwoche mit 30 Stunden Unterricht an 5 Tagen. Was gilt?",o:["Frei; angerechnet mit der durchschnittlichen wöchentlichen Ausbildungszeit","Nachmittags in den Betrieb","Nur 30 Std. angerechnet","Samstags nacharbeiten"],a:0,e:"Erlaubt sind zusätzlich nur betriebliche Ausbildungsveranstaltungen bis 2 Std. pro Woche.",p:"§ 15 Abs. 1 Satz 2 Nr. 3, Abs. 2 Nr. 3 BBiG"},
{id:"s12",t:"schule",type:"para",q:"„Du kommst morgen in den Betrieb, nicht in die Schule!“ (Azubi, 16). Fundstelle?",o:["§ 9 Abs. 1 Satz 1 JArbSchG","§ 14 Abs. 1 JArbSchG","§ 15 Abs. 1 Satz 1 BBiG","§ 13 Satz 2 Nr. 3 BBiG"],a:0,e:"Der Arbeitgeber muss Jugendliche für die Berufsschule freistellen."},
{id:"s13",t:"schule",type:"tf",q:"Die Regeln zum freien Nachmittag und zum Unterricht vor 9 Uhr gelten seit 2020 auch für volljährige Azubis.",a:true,e:"Seit der BBiG-Novelle stehen sie in § 15 BBiG – für alle Azubis."},
{id:"s14",t:"schule",type:"mc",q:"Welches Gesetz regelt die Anrechnung für Azubis unter 18?",o:["Das JArbSchG (§ 9)","Nur das BUrlG","Das KSchG","Das BGB"],a:0,e:"Für unter 18-Jährige gilt das JArbSchG; für Volljährige § 15 BBiG.",p:"§ 15 Abs. 3 BBiG"},
// ---- 5 Arbeitsvertrag
{id:"v1",t:"vertrag",type:"match",q:"Wer schließt welchen Vertrag?",pairs:[["Arbeitsvertrag","Arbeitgeber & Arbeitnehmer"],["Tarifvertrag","Gewerkschaft & Arbeitgeberverband"],["Betriebsvereinbarung","Arbeitgeber & Betriebsrat"]],e:"Arbeitsvertrag = Individualarbeitsrecht; Tarifvertrag und Betriebsvereinbarung = Kollektivarbeitsrecht."},
{id:"v2",t:"vertrag",type:"mc",q:"Was sind die Hauptpflichten aus dem Arbeitsvertrag?",o:["Arbeitnehmer: Arbeitsleistung · Arbeitgeber: Vergütung","Arbeitnehmer: Schweigepflicht · Arbeitgeber: Zeugnis","Arbeitnehmer: Urlaub nehmen · Arbeitgeber: Fürsorge","Beide: Tarifvertrag einhalten"],a:0,e:"Alles andere sind Nebenpflichten.",p:"§ 611a BGB"},
{id:"v3",t:"vertrag",type:"tf",q:"Ein Arbeitsvertrag ist unwirksam, wenn er nicht schriftlich geschlossen wird.",a:false,e:"Arbeitsverträge sind grundsätzlich formfrei. Der Arbeitgeber muss die wesentlichen Bedingungen aber nachweisen (Nachweisgesetz)."},
{id:"v4",t:"vertrag",type:"mc",q:"Was ist das Weisungsrecht (Direktionsrecht)?",o:["Der Arbeitgeber bestimmt Inhalt, Ort und Zeit der Arbeit nach billigem Ermessen","Der Arbeitnehmer bestimmt seine Arbeitszeit selbst","Der Betriebsrat erteilt Weisungen","Die IHK bestimmt die Aufgaben"],a:0,e:"Soweit Vertrag, Tarifvertrag, Betriebsvereinbarung oder Gesetz nichts festlegen.",p:"§ 106 Satz 1 GewO"},
{id:"v5",t:"vertrag",type:"para",q:"Kuno steht pünktlich vor der Tür, der Chef hat verschlafen und schickt ihn heim. Lohn?",o:["Ja – § 615 Satz 1 BGB","Nein – § 611a Abs. 2 BGB","Nur zur Hälfte","Ja – § 17 Abs. 7 BBiG"],a:0,e:"Annahmeverzug: Er hat die Arbeit angeboten, der Arbeitgeber hat sie nicht angenommen."},
{id:"v6",t:"vertrag",type:"para",q:"Stromausfall im Gebäude – alle werden heimgeschickt. Lohn?",o:["Ja – § 615 Satz 3 BGB (Betriebsrisiko)","Nein, höhere Gewalt","Nur wenn es im Tarifvertrag steht","Nein – § 626 BGB"],a:0,e:"Das Risiko des Arbeitsausfalls trägt der Arbeitgeber."},
{id:"v7",t:"vertrag",type:"mc",q:"Was ist eine betriebliche Übung?",o:["Mind. dreimal vorbehaltlos gezahlte Leistung → Anspruch auch künftig","Eine Feuerübung im Betrieb","Eine Regel im Tarifvertrag","Eine Schulung durch die IHK"],a:0,e:"Rechtsprechung, kein Paragraph. Dreimal vorbehaltlos reicht (in deiner Mitschrift steht „mehr als 3x“ – das BAG sagt: dreimal). Ein Freiwilligkeitsvorbehalt verhindert sie."},
{id:"v8",t:"vertrag",type:"tf",q:"Fünf Jahre Weihnachtsgeld, jedes Mal mit „freiwillig, ohne Rechtsanspruch“ – jetzt besteht trotzdem ein Anspruch.",a:false,e:"Der Vorbehalt verhindert die betriebliche Übung."},
{id:"v9",t:"vertrag",type:"para",q:"Eine angestellte Versicherungsberaterin vermittelt nebenbei für einen Konkurrenten. Fundstelle?",o:["§ 60 Abs. 1 HGB","§ 13 Satz 2 Nr. 6 BBiG","§ 106 GewO","§ 626 Abs. 2 BGB"],a:0,e:"Wettbewerbsverbot für kaufmännische Angestellte."},
{id:"v10",t:"vertrag",type:"mc",q:"Herr Cornelius erzählt in der Sauna von den Gewinnzahlen seines Chefs. Was liegt vor?",o:["Verstoß gegen die Schweigepflicht","Verstoß gegen das Wettbewerbsverbot","Kein Verstoß, privat ist privat","Annahmeverzug"],a:0,e:"Nebenpflicht aus dem Arbeitsvertrag (§ 241 Abs. 2 BGB) → Abmahnung möglich."},
{id:"v14",t:"vertrag",type:"mc",q:"Welche Pflicht hat NICHT der Arbeitgeber?",o:["Wettbewerbsverbot einhalten","Vergütung zahlen","Urlaub gewähren","Zeugnis ausstellen"],a:0,e:"Das Wettbewerbsverbot ist eine Pflicht des Arbeitnehmers."},
{id:"v15",t:"vertrag",type:"para",q:"Der Arbeitgeber verweigert der ausscheidenden Ina das Arbeitszeugnis. Fundstelle?",o:["§ 109 Abs. 1 GewO","§ 16 Abs. 1 BBiG","§ 611a BGB","§ 623 BGB"],a:0,e:"§ 16 BBiG gilt für Azubis; für Arbeitnehmer gilt die Gewerbeordnung."},
{id:"v16",t:"vertrag",type:"match",q:"Individual- oder Kollektivarbeitsrecht?",pairs:[["Arbeitsvertrag","Individualarbeitsrecht"],["Tarifvertrag","Kollektivarbeitsrecht (Branche)"],["Betriebsvereinbarung","Kollektivarbeitsrecht (Betrieb)"]],e:"Tarifvertrag gilt für tarifgebundene Arbeitgeber/Arbeitnehmer, Betriebsvereinbarung für die Arbeitnehmer eines Betriebs."},
// ---- 6 Kündigung
{id:"k1",t:"kuendigung",type:"para",q:"Der Chef kündigt per E-Mail. Fundstelle (unwirksam)?",o:["§ 623 BGB","§ 622 Abs. 1 BGB","§ 626 Abs. 1 BGB","§ 22 Abs. 3 BBiG"],a:0,e:"Schriftform, elektronische Form ausgeschlossen – auch kein Fax oder WhatsApp."},
{id:"k2",t:"kuendigung",type:"mc",q:"Wie lautet die Grundkündigungsfrist?",o:["4 Wochen zum 15. oder zum Ende eines Kalendermonats","1 Monat zum Monatsende","2 Wochen","3 Monate zum Quartalsende"],a:0,e:"Gesetzliche Grundfrist (wenn Vertrag oder Tarifvertrag nichts anderes regeln). Kündigt der Arbeitnehmer, bleibt es dabei – die längeren Fristen aus Abs. 2 gelten nur für den Arbeitgeber.",p:"§ 622 Abs. 1 BGB"},
{id:"k3",t:"kuendigung",type:"tf",q:"Die verlängerten Kündigungsfristen nach Betriebszugehörigkeit gelten auch, wenn der Arbeitnehmer kündigt.",a:false,e:"§ 622 Abs. 2 BGB gilt nur bei Kündigung durch den Arbeitgeber."},
{id:"k4",t:"kuendigung",type:"match",q:"Arbeitgeber kündigt: Betriebszugehörigkeit → Frist (zum Monatsende)",pairs:[["2 Jahre","1 Monat"],["5 Jahre","2 Monate"],["8 Jahre","3 Monate"],["10 Jahre","4 Monate"]],e:"Weiter: 12 J. → 5, 15 J. → 6, 20 J. → 7 Monate (§ 622 Abs. 2 Satz 1 Nr. 1–7 BGB)."},
{id:"k5",t:"kuendigung",type:"mc",q:"Kündigungsfrist in einer vereinbarten Probezeit (max. 6 Monate)?",o:["2 Wochen","4 Wochen","1 Monat","Keine Frist"],a:0,e:"Ohne festen Termin – das Ende kann jeder Tag sein.",p:"§ 622 Abs. 3 BGB"},
{id:"k6",t:"kuendigung",type:"mc",q:"Innerhalb welcher Frist muss eine fristlose Kündigung erfolgen?",o:["2 Wochen ab Kenntnis der Gründe","4 Wochen ab Kenntnis","3 Wochen ab der Tat","Jederzeit"],a:0,e:"Kenntnis am 02.03. → spätestens 16.03.",p:"§ 626 Abs. 2 Satz 1 und 2 BGB"},
{id:"k7",t:"kuendigung",type:"para",q:"Nach einem einmaligen Wutausbruch gegenüber einem Kunden fristlos gekündigt. Fundstelle (in der Regel unwirksam)?",o:["§ 626 Abs. 1 BGB","§ 623 BGB","§ 622 Abs. 1 BGB","§ 1 Abs. 3 KSchG"],a:0,e:"Kein wichtiger Grund, der die Fortsetzung unzumutbar macht → zuerst Abmahnung."},
{id:"k8",t:"kuendigung",type:"mc",q:"Wann gilt das Kündigungsschutzgesetz?",o:["Mehr als 10 Arbeitnehmer UND mehr als 6 Monate beschäftigt","Ab 5 Arbeitnehmern","Ab dem ersten Arbeitstag","Nur für Azubis"],a:0,e:"§ 23 Abs. 1 KSchG (Betriebsgröße) und § 1 Abs. 1 KSchG (Wartezeit)."},
{id:"k9",t:"kuendigung",type:"match",q:"Welche Art von Kündigungsgrund?",pairs:[["Außendienstler verliert Führerschein","personenbedingt"],["Filiale wird geschlossen","betriebsbedingt"],["Wiederholte Unpünktlichkeit","verhaltensbedingt"]],e:"Verhaltensbedingt i. d. R. erst nach Abmahnung (§ 1 Abs. 2 Satz 1 KSchG)."},
{id:"k10",t:"kuendigung",type:"mc",q:"Welches ist KEIN Kriterium der Sozialauswahl?",o:["Höhe des Gehalts","Dauer der Betriebszugehörigkeit","Lebensalter","Unterhaltspflichten"],a:0,e:"Die vier Kriterien: Betriebszugehörigkeit, Lebensalter, Unterhaltspflichten, Schwerbehinderung.",p:"§ 1 Abs. 3 Satz 1 KSchG"},
{id:"k11",t:"kuendigung",type:"mc",q:"Was gehört NICHT zu einer Abmahnung?",o:["Angabe einer Kündigungsfrist","Rüge des konkreten Fehlverhaltens","Aufforderung, sich künftig vertragsgemäß zu verhalten","Androhung von Konsequenzen"],a:0,e:"Rügefunktion – Aufforderungsfunktion – Warnfunktion."},
{id:"k12",t:"kuendigung",type:"para",q:"Bis wann muss die Kündigungsschutzklage erhoben werden?",o:["3 Wochen nach Zugang – § 4 Satz 1 KSchG","2 Wochen nach Zugang – § 626 Abs. 2 BGB","4 Wochen – § 622 Abs. 1 BGB","6 Monate – § 1 Abs. 1 KSchG"],a:0,e:"Sonst gilt die Kündigung als wirksam (§ 7 KSchG)."},
{id:"k13",t:"kuendigung",type:"tf",q:"Tom (4 Monate im Betrieb, 50 Mitarbeiter) wird ordentlich, fristgerecht und ohne Grund gekündigt. Die Kündigung ist wirksam.",a:true,e:"Kündigungsschutz erst nach mehr als 6 Monaten.",p:"§ 1 Abs. 1 KSchG"},
{id:"k14",t:"kuendigung",type:"mc",q:"Wer hat KEINEN besonderen Kündigungsschutz?",o:["Teilzeitkräfte","Schwangere","Schwerbehinderte","Betriebsratsmitglieder"],a:0,e:"Außerdem besonders geschützt: Arbeitnehmer in Elternzeit, Azubis nach der Probezeit."},
{id:"k15",t:"kuendigung",type:"tf",q:"Eine Kündigung wird erst wirksam, wenn sie dem Empfänger zugeht.",a:true,e:"Einseitige, empfangsbedürftige Willenserklärung – ab Zugang laufen die Fristen."},
{id:"k16",t:"kuendigung",type:"mc",q:"Eine Teilzeitkraft mit 18 Wochenstunden zählt beim KSchG mit …",o:["0,5","0,75","1","0"],a:0,e:"Bis 20 Std. → 0,5; bis 30 Std. → 0,75; Azubis zählen nicht.",p:"§ 23 Abs. 1 KSchG"},
{id:"k17",t:"kuendigung",type:"para",q:"Der Arbeitgeber zahlt seit drei Monaten keinen Lohn. Darf die Arbeitnehmerin fristlos kündigen?",o:["Ja – § 626 Abs. 1 BGB","Nein – § 622 Abs. 1 BGB","Nur mit 4 Wochen Frist","Nein – § 1 Abs. 2 KSchG"],a:0,e:"Auch Arbeitnehmer können aus wichtigem Grund fristlos kündigen."},
{id:"k18",t:"kuendigung",type:"mc",q:"Betriebsbedingt muss einer gehen: Frau Albers (52, 20 J., 2 Kinder) oder Herr Berg (28, 3 J., ledig)?",o:["Herr Berg","Frau Albers","Beide","Wer schlechter arbeitet"],a:0,e:"Er ist sozial weniger schutzbedürftig.",p:"§ 1 Abs. 3 Satz 1 KSchG"},
{id:"d20",t:"duales",type:"mc",q:"Was muss die Ausbildungsordnung NICHT festlegen?",o:["Die Höhe der Ausbildungsvergütung","Den Ausbildungsrahmenplan","Die Prüfungsanforderungen","Die Ausbildungsdauer"],a:0,e:"Mindestinhalte: Bezeichnung, Dauer, Ausbildungsberufsbild, Ausbildungsrahmenplan, Prüfungsanforderungen. Die Vergütung steht im Ausbildungsvertrag.",p:"§ 5 Abs. 1 BBiG"},
{id:"d21",t:"duales",type:"mc",q:"Was beschreibt der Ausbildungsrahmenplan?",o:["Die sachliche und zeitliche Gliederung der Ausbildung (was und wann)","Die Höhe der Vergütung pro Jahr","Den Stundenplan der Berufsschule","Die Kündigungsfristen"],a:0,e:"Er ist Teil der Ausbildungsordnung.",p:"§ 5 Abs. 1 BBiG"},
{id:"d22",t:"duales",type:"match",q:"Gesetzestexte lesen: Was bedeutet die Abkürzung?",pairs:[["§§","mehrere Paragraphen"],["Abs.","Absatz"],["S.","Satz"],["Buchst.","Buchstabe"]],e:"Beispiel: § 15 Abs. 1 S. 2 Nr. 5 BBiG = Paragraph 15, Absatz 1, Satz 2, Nummer 5 des Berufsbildungsgesetzes."},
{id:"j19",t:"jarbschg",type:"para",q:"Jugendliche dürfen grundsätzlich nur an fünf Tagen in der Woche beschäftigt werden. Fundstelle?",o:["§ 15 JArbSchG","§ 8 Abs. 1 JArbSchG","§ 16 Abs. 1 JArbSchG","§ 13 JArbSchG"],a:0,e:"§ 8 regelt 8 Std. täglich / 40 Std. wöchentlich – nicht die 5-Tage-Woche. (Im Lernzettel der Klasse steht hier § 8.)"},
{id:"j20",t:"jarbschg",type:"tf",q:"Fehlt die Bescheinigung über die Nachuntersuchung, darf der Jugendliche schon nach genau einem Jahr nicht mehr beschäftigt werden.",a:false,e:"Nach einem Jahr muss der Arbeitgeber sie verlangen und schriftlich auffordern. Das Beschäftigungsverbot gilt erst nach Ablauf von 14 Monaten.",p:"§ 33 Abs. 3 JArbSchG"},
{id:"j21",t:"jarbschg",type:"mc",q:"Eine 17-Jährige arbeitet erlaubt samstags in einer Bäckerei. Was muss der Betrieb tun?",o:["Einen anderen berufsschulfreien Arbeitstag derselben Woche freigeben","Nichts weiter","Samstags doppelten Lohn zahlen","Einen Urlaubstag gutschreiben"],a:0,e:"So bleibt die 5-Tage-Woche erhalten.",p:"§ 16 Abs. 3 JArbSchG"},
{id:"v18",t:"vertrag",type:"match",q:"Pflicht → einfache Erklärung",pairs:[["Beschäftigungspflicht (AG)","Arbeitnehmer vertragsgemäß beschäftigen"],["Fürsorgepflicht (AG)","Gesundheit und Interessen des AN schützen"],["Betriebsfrieden (AN)","sich angemessen gegenüber Kollegen verhalten"],["Sorgfaltspflicht (AN)","Arbeitsmittel sorgfältig behandeln"]],e:"Tabelle aus dem Lernzettel der Klasse: Pflichten des Arbeitgebers und des Arbeitnehmers."},
{id:"v19",t:"vertrag",type:"mc",q:"Welche Pflicht hat der ARBEITGEBER?",o:["Beschäftigungspflicht","Betriebsfrieden wahren","Weisungsgebundenheit","Wettbewerbsverbot"],a:0,e:"Weitere AG-Pflichten: Vergütung, Urlaub, Arbeitsmittel, Fürsorge, Arbeitsschutz."},
{id:"v20",t:"vertrag",type:"mc",q:"Welche Pflicht hat der ARBEITNEHMER?",o:["Betriebsfrieden wahren","Arbeitsschutz","Urlaubsgewährung","Beschäftigungspflicht"],a:0,e:"Weitere AN-Pflichten: Arbeitspflicht, Arbeitszeit einhalten, Schweigepflicht, Sorgfaltspflicht, Weisungen befolgen, Wettbewerbsverbot."},
{id:"v21",t:"vertrag",type:"mc",q:"Jemand fängt mit Wissen und Zustimmung des Chefs an zu arbeiten, ohne dass über einen Vertrag gesprochen wurde. Wie ist der Arbeitsvertrag zustande gekommen?",o:["Konkludent (durch schlüssiges Verhalten)","Gar nicht – er muss schriftlich sein","Mündlich","Nur vorläufig bis zur Unterschrift"],a:0,e:"Formen: schriftlich, mündlich, konkludent."},
{id:"v22",t:"vertrag",type:"mc",q:"Was verlangt das Nachweisgesetz?",o:["Der Arbeitgeber muss die wesentlichen Arbeitsbedingungen festhalten und dem Arbeitnehmer nachweisen","Der Arbeitsvertrag ist ohne Unterschrift nichtig","Der Arbeitnehmer muss seine Zeugnisse nachweisen","Die IHK muss jeden Arbeitsvertrag prüfen"],a:0,e:"Z. B. Parteien, Beginn, Arbeitsort, Tätigkeit, Arbeitszeit, Vergütung, Urlaub, Kündigungsfristen."},
{id:"k19",t:"kuendigung",type:"match",q:"Kündigungsschutzgruppe → Gesetz",pairs:[["Schwangere","§ 17 MuSchG"],["Arbeitnehmer in Elternzeit","§ 18 BEEG"],["Schwerbehinderte","§ 168 SGB IX"],["Betriebsrat & JAV","§ 15 KSchG"]],e:"Dazu: Azubis nach der Probezeit (§ 22 BBiG)."},
{id:"k20",t:"kuendigung",type:"para",q:"Ein Betriebsratsmitglied wird wegen Umsatzrückgang ordentlich gekündigt. Fundstelle (unzulässig)?",o:["§ 15 Abs. 1 KSchG","§ 1 Abs. 2 KSchG","§ 102 Abs. 1 BetrVG","§ 622 Abs. 2 BGB"],a:0,e:"Ordentliche Kündigung ausgeschlossen; außerordentlich nur mit Zustimmung des Betriebsrats (§ 103 BetrVG)."},
{id:"k21",t:"kuendigung",type:"para",q:"Einem schwerbehinderten Mitarbeiter (GdB 60) wird ohne Zustimmung des Integrationsamts gekündigt. Fundstelle?",o:["§ 168 SGB IX","§ 18 BEEG","§ 17 MuSchG","§ 1 Abs. 3 KSchG"],a:0,e:"Die Zustimmung muss vorher eingeholt werden."},
{id:"k22",t:"kuendigung",type:"tf",q:"Frau Kraus teilt dem Chef 10 Tage nach Zugang der Kündigung mit, dass sie schwanger ist. Die Kündigung ist unwirksam.",a:true,e:"Es reicht, wenn sie es innerhalb von 2 Wochen nach Zugang mitteilt.",p:"§ 17 Abs. 1 MuSchG"},
{id:"k23",t:"kuendigung",type:"mc",q:"Wie lange wirkt der Kündigungsschutz eines JAV- oder Betriebsratsmitglieds nach Ende der Amtszeit nach?",o:["1 Jahr","6 Monate","3 Monate","Gar nicht"],a:0,e:"Innerhalb eines Jahres nach der Amtszeit ist die ordentliche Kündigung unzulässig.",p:"§ 15 Abs. 1 KSchG"},
{id:"k24",t:"kuendigung",type:"para",q:"Der Chef kündigt, ohne den vorhandenen Betriebsrat anzuhören. Fundstelle (unwirksam)?",o:["§ 102 Abs. 1 BetrVG","§ 103 BetrVG","§ 623 BGB","§ 4 KSchG"],a:0,e:"Der Betriebsrat ist vor jeder Kündigung zu hören."},
{id:"k25",t:"kuendigung",type:"mc",q:"Wie lange hat der Betriebsrat, um Bedenken gegen eine Kündigung mitzuteilen?",o:["Ordentlich: 1 Woche · außerordentlich: 3 Tage","Ordentlich: 2 Wochen · außerordentlich: 1 Woche","Immer 3 Wochen","Ordentlich: 4 Wochen · außerordentlich: 2 Wochen"],a:0,e:"Schweigt er bei der ordentlichen Kündigung, gilt die Zustimmung als erteilt.",p:"§ 102 Abs. 2 BetrVG"},
{id:"k26",t:"kuendigung",type:"mc",q:"Welche Bedingung gehört NICHT zum Abfindungsanspruch nach § 1a KSchG?",o:["Der Arbeitnehmer erhebt innerhalb von 3 Wochen Klage","Die Kündigung ist betriebsbedingt","Das Kündigungsschreiben weist auf die Abfindung hin","Der Arbeitnehmer lässt die Klagefrist verstreichen"],a:0,e:"Wer klagt, verliert den Anspruch nach § 1a. Höhe: 0,5 Monatsverdienste je Beschäftigungsjahr.",p:"§ 1a KSchG"},
{id:"k27",t:"kuendigung",type:"match",q:"Welche Funktion der Abmahnung?",pairs:[["„Am 03.03. kamen Sie 30 Min. zu spät.“","Rügefunktion"],["„Bitte erscheinen Sie künftig pünktlich.“","Aufforderungsfunktion"],["„Im Wiederholungsfall droht die Kündigung.“","Warnfunktion"]],e:"Die drei Funktionen aus dem Unterricht: Rüge – Aufforderung – Warnung."},
{id:"k28",t:"kuendigung",type:"tf",q:"Eine Abmahnung ist nur wirksam, wenn sie schriftlich erfolgt.",a:false,e:"Sie muss nicht schriftlich sein; die Schriftform ist nur zum Beweis sinnvoll. Sie muss aber zugehen. (Euer Infoblatt schreibt „schriftliche Abmahnung“ – vorgeschrieben ist das nicht, aber üblich.)"},
{id:"k29",t:"kuendigung",type:"mc",q:"Wodurch endet ein Arbeitsverhältnis NICHT automatisch?",o:["Durch eine Krankheit des Arbeitnehmers","Durch einen Aufhebungsvertrag","Durch Ablauf eines befristeten Vertrags","Durch eine wirksame Kündigung"],a:0,e:"Enden kann es durch Kündigung, Aufhebungsvertrag, Ablauf der Befristung oder Erreichen des vereinbarten Zwecks."},
{id:"k30",t:"kuendigung",type:"tf",q:"Langjährig Beschäftigte haben einen besonderen Kündigungsschutz wie Schwangere.",a:false,e:"Sie haben nur längere Kündigungsfristen bei Kündigung durch den Arbeitgeber.",p:"§ 622 Abs. 2 BGB"},
{id:"k31",t:"kuendigung",type:"para",q:"Frau Yilmaz ist in Elternzeit. Der Chef kündigt ihr ohne Zustimmung einer Behörde. Fundstelle?",o:["§ 18 Abs. 1 BEEG","§ 17 Abs. 1 MuSchG","§ 15 Abs. 1 KSchG","§ 626 Abs. 1 BGB"],a:0,e:"Schutz ab dem Verlangen der Elternzeit (frühestens 8 Wochen vor Beginn) und während der Elternzeit."}
];
const CARDS=[
["Duales System","Ausbildung an zwei Lernorten: Betrieb (Fachpraxis) und Berufsschule (Fachtheorie + Allgemeinbildung), die zusammenarbeiten."],
["Zuständige Stelle","Die IHK: führt das Verzeichnis, berät und überwacht, nimmt Prüfungen ab, entscheidet über Verkürzung. (§ 71 Abs. 2 BBiG)"],
["Ausbildender / Ausbilder","Ausbildender = Vertragspartner (Betrieb). Ausbilder = Person, die im Auftrag tatsächlich ausbildet. (§ 14 Abs. 1 Nr. 2 BBiG)"],
["Probezeit Ausbildung","Mindestens 1, höchstens 4 Monate. In der Probezeit Kündigung jederzeit ohne Frist. (§ 20 Satz 2, § 22 Abs. 1 BBiG)"],
["Nichtige Vereinbarungen","Ausbildungsgebühr, Vertragsstrafe, Ausschluss von Schadensersatz, pauschaler Schadensersatz, Bindung nach der Ausbildung. (§ 12 BBiG)"],
["Ausbildungsnachweis","Dokumentiert die Ausbildung; Führen am Arbeitsplatz erlaubt (§ 14 Abs. 2); Voraussetzung für die Prüfungszulassung (§ 43 Abs. 1 Nr. 2 BBiG)."],
["Ende der Ausbildung","Ablauf der Zeit oder Bekanntgabe des bestandenen Ergebnisses (§ 21 Abs. 2). Nicht bestanden: Verlängerung auf Verlangen, max. 1 Jahr (Abs. 3)."],
["Kündigung nach der Probezeit","Betrieb: nur wichtiger Grund, fristlos. Azubi: auch mit 4 Wochen Frist bei Aufgabe/Berufswechsel. Schriftlich mit Gründen. (§ 22 BBiG)"],
["Weiterarbeit","Wer nach der Ausbildung ohne Absprache weiterarbeitet, ist unbefristet angestellt. (§ 24 BBiG)"],
["Jugendlicher","15, aber noch nicht 18 Jahre alt. (§ 2 Abs. 2 JArbSchG)"],
["Pausen Jugendliche","> 4,5 bis 6 Std. → 30 Min.; > 6 Std. → 60 Min.; Blöcke ab 15 Min.; max. 4,5 Std. am Stück. (§ 11 JArbSchG)"],
["Urlaub","Alter am 1.1.: unter 16 → 30, unter 17 → 27, unter 18 → 25 Werktage (§ 19 Abs. 2 JArbSchG); ab 18 → 24 Werktage (§ 3 Abs. 1 BUrlG)."],
["Schichtzeit","Arbeitszeit einschließlich Pausen, höchstens 10 Std. (§ 4 Abs. 2, § 12 JArbSchG)"],
["Langer Berufsschultag","Mehr als 5 Unterrichtsstunden à 45 Min., einmal pro Woche: frei, angerechnet mit der durchschnittlichen täglichen Zeit."],
["Anrechnung sonst","Unterrichtszeit inkl. Pausen + notwendige Wegezeit Schule → Betrieb. (§ 15 Abs. 2 Nr. 1 BBiG)"],
["Weisungsrecht","Arbeitgeber bestimmt Inhalt, Ort und Zeit der Arbeit nach billigem Ermessen. (§ 106 Satz 1 GewO)"],
["Betriebliche Übung","Mindestens dreimal vorbehaltlos gezahlt → Anspruch auch in Zukunft. Freiwilligkeitsvorbehalt verhindert sie."],
["Annahmeverzug","Arbeitgeber nimmt die angebotene Arbeit nicht an → Lohn trotzdem. Betriebsrisiko (z. B. Stromausfall) ebenso. (§ 615 BGB)"],
["Tarifvertrag / Betriebsvereinbarung","Tarifvertrag: Gewerkschaft ↔ Arbeitgeberverband. Betriebsvereinbarung: Arbeitgeber ↔ Betriebsrat."],
["Kündigungsschutzgruppen","Azubis nach Probezeit (§ 22 BBiG) · Betriebsrat/JAV (§ 15 KSchG) · Schwangere (§ 17 MuSchG) · Elternzeit (§ 18 BEEG) · Schwerbehinderte (§ 168 SGB IX)."],
["Betriebsrat anhören","Vor jeder Kündigung (§ 102 Abs. 1 BetrVG), sonst unwirksam. Bedenken: ordentlich 1 Woche, außerordentlich 3 Tage."],
["Abfindung § 1a KSchG","Betriebsbedingte Kündigung + Hinweis im Schreiben + keine Klage in 3 Wochen → 0,5 Monatsverdienste je Jahr (mehr als 6 Monate aufrunden)."],
["Ausbildungsordnung","Bezeichnung, Dauer, Ausbildungsberufsbild, Ausbildungsrahmenplan, Prüfungsanforderungen. (§ 5 Abs. 1 BBiG)"],
["Kündigungsfristen","AN: 4 Wochen zum 15./Monatsende (§ 622 Abs. 1). AG: nach 2/5/8/10/12/15/20 Jahren 1–7 Monate zum Monatsende (Abs. 2)."],
["Außerordentliche Kündigung","Wichtiger Grund, Fortsetzung unzumutbar; innerhalb von 2 Wochen ab Kenntnis. (§ 626 BGB)"],
["Abmahnung","Drei Funktionen: Rügefunktion (Fehlverhalten benennen), Aufforderungsfunktion (künftig vertragsgemäß verhalten), Warnfunktion (Konsequenzen androhen). Muss nicht schriftlich sein, aber zugehen."],
["Kündigungsschutzgesetz","Mehr als 10 AN (Teilzeit 0,5/0,75, Azubis nicht), mehr als 6 Monate. Person-, verhaltens- oder betriebsbedingt; Klage in 3 Wochen."],
["Sozialauswahl","Betriebszugehörigkeit, Lebensalter, Unterhaltspflichten, Schwerbehinderung. (§ 1 Abs. 3 Satz 1 KSchG)"]
];

/* ====================== Generatoren (zufällige Rechenfragen) ====================== */
const MONTHS=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const WD=["So","Mo","Di","Mi","Do","Fr","Sa"];
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const D=(y,m,d)=>new Date(Date.UTC(y,m,d));
const addDays=(d,n)=>new Date(d.getTime()+n*864e5);
const lastOfMonth=(y,m)=>D(y,m+1,0);
const fmt=d=>String(d.getUTCDate()).padStart(2,"0")+"."+String(d.getUTCMonth()+1).padStart(2,"0")+"."+d.getUTCFullYear();
const fmtW=d=>WD[d.getUTCDay()]+" "+fmt(d);
const num=x=>String(Math.round(x*100)/100).replace(".",",");
const hm=min=>{const h=Math.floor(min/60),m=min%60;return h+" Std."+(m?" "+m+" Min.":"");};
const clock=min=>Math.floor(min/60)+":"+String(min%60).padStart(2,"0");
function randWeekday(y){let d;do{d=D(y,rnd(0,11),rnd(1,28));}while(d.getUTCDay()===0||d.getUTCDay()===6);return d;}
function addMonthsClamp(d,m){const y=d.getUTCFullYear(),mo=d.getUTCMonth()+m,day=d.getUTCDate();const last=lastOfMonth(y,mo).getUTCDate();return D(y,mo,Math.min(day,last));}
function fourWeeksTermin(z){const e=addDays(z,28);const y=e.getUTCFullYear(),m=e.getUTCMonth();return e.getUTCDate()<=15?D(y,m,15):lastOfMonth(y,m);}
const AGTAB=[[20,7,7],[15,6,6],[12,5,5],[10,4,4],[8,3,3],[5,2,2],[2,1,1]]; // [Jahre, Monate, Nr.]
function finishOpts(correct,dis,more){const set=[correct];for(const x of dis.concat(more||[])){if(set.length>=4)break;if(x&&!set.includes(x))set.push(x);}return set;}

const GENS={
 urlaub:{t:"jarbschg",label:"Urlaubsrechner",make(){
  const Y=pick([2027,2028]);const age=pick([15,16,17,17,18,19]);const X=Y-1-age;
  const bm=rnd(0,11);const bd=(bm===11&&Math.random()<.35)?31:rnd(2,28);const b=D(X,bm,bd);
  const name=pick(["Mara","Jan","Eda","Luca","Nele","Tom","Sina","Ben"]);
  let wt,ref,why;
  if(age<16){wt=30;ref="§ 19 Abs. 2 Satz 1 Nr. 1 JArbSchG";}else if(age<17){wt=27;ref="§ 19 Abs. 2 Satz 1 Nr. 2 JArbSchG";}else if(age<18){wt=25;ref="§ 19 Abs. 2 Satz 1 Nr. 3 JArbSchG";}else{wt=24;ref="§ 3 Abs. 1 BUrlG";}
  const o=finishOpts(wt+" Werktage",["30 Werktage","27 Werktage","25 Werktage","24 Werktage"].filter(s=>s!==wt+" Werktage"));
  return {inp:{kind:"num",v:wt,unit:"Werktage"},type:"mc",q:name+" ist am "+fmt(b)+" geboren. Wie viele Werktage Urlaub stehen "+name+" im Jahr "+Y+" mindestens zu?",o,a:0,
   e:"Am 01.01."+Y+" ist "+name+" "+age+" Jahre alt"+(bd===31&&bm===11?" (am 31.12. Geburtstag gehabt!)":"")+" → "+wt+" Werktage. Entscheidend ist das Alter zu Beginn des Kalenderjahres.",p:ref};}},
 pause:{t:"jarbschg",label:"Pausenrechner",make(){
  const mins=pick([240,270,285,300,330,360,375,390,420,450,480]);const name=pick(["Sophie (16)","Finn (16)","Lea (17)","Emil (17)"]);
  let ans,ref;if(mins<=270){ans="Keine Pause vorgeschrieben";ref="§ 11 Abs. 1 Satz 2 JArbSchG (erst ab mehr als 4,5 Std.)";}else if(mins<=360){ans="30 Minuten";ref="§ 11 Abs. 1 Satz 2 Nr. 1 JArbSchG";}else{ans="60 Minuten";ref="§ 11 Abs. 1 Satz 2 Nr. 2 JArbSchG";}
  return {inp:{kind:"num",v:mins<=270?0:mins<=360?30:60,unit:"Minuten",zero:true},type:"mc",q:name+" arbeitet heute "+hm(mins)+" (reine Arbeitszeit ohne Pausen). Wie lang müssen die Ruhepausen mindestens sein?",o:finishOpts(ans,["Keine Pause vorgeschrieben","30 Minuten","45 Minuten","60 Minuten"].filter(s=>s!==ans)),a:0,
   e:"Mehr als 4,5 bis 6 Std. → 30 Min.; mehr als 6 Std. → 60 Min. Genau 4,5 oder genau 6 Std. zählen noch zur unteren Stufe. (45 Min. ist die Regel für Erwachsene über 9 Std. – ArbZG.)",p:ref};}},
 anrechnung:{t:"schule",label:"Berufsschul-Anrechnung",make(){
  const minor=Math.random()<.5;const name=minor?pick(["Mia (17)","Ben (17)","Nele (16)"]):pick(["Jonas (20)","Lea (19)","Ole (21)"]);
  const k=pick([4,5,5,6,6,7]);const start=pick([465,480]);const pause=k<=4?15:45;const end=start+k*45+pause;const weg=pick([15,20,25,30]);
  const unt=end-start;let ans,ref,why;
  const refLong=minor?"§ 9 Abs. 1 Satz 2 Nr. 2, Abs. 2 Nr. 1 JArbSchG":"§ 15 Abs. 1 Satz 2 Nr. 2, Abs. 2 Nr. 2 BBiG";
  const refShort=minor?"§ 9 Abs. 2 Nr. 3 JArbSchG":"§ 15 Abs. 2 Nr. 1 BBiG";
  const optLong="8 Std. – frei, keine Rückkehr in den Betrieb";const optFull=hm(unt+weg)+" – danach zurück in den Betrieb";
  if(k>5){ans=optLong;ref=refLong;why=k+" Unterrichtsstunden sind mehr als 5 → frei, angerechnet mit der durchschnittlichen täglichen Zeit (8 Std.).";}
  else{ans=optFull;ref=refShort;why=(k===5?"Genau 5 Stunden sind nicht MEHR als 5! ":"")+"Unterricht inkl. Pausen "+hm(unt)+" + Weg "+weg+" Min. = "+hm(unt+weg)+". Bis 8 Std. darf noch im Betrieb gearbeitet werden: "+hm(480-unt-weg)+".";}
  const o=finishOpts(ans,[k>5?optFull:optLong,hm(unt)+" – danach zurück in den Betrieb",hm(k*45+weg)+" – danach zurück in den Betrieb",hm(k*45)+" – danach zurück in den Betrieb"]);
  return {inp:{kind:"hm",v:k>5?480:unt+weg,unit:"Std:Min"},type:"mc",q:name+", durchschnittlich 8 Std. täglich. Berufsschule "+clock(start)+"–"+clock(end)+" Uhr: "+k+" Unterrichtsstunden à 45 Min. + "+pause+" Min. Pausen. Weg zum Betrieb: "+weg+" Min. Es ist der einzige Schultag der Woche. Was wird angerechnet?",o,a:0,e:why,p:ref};}},
 kuendigung:{t:"kuendigung",label:"Kündigungstermin",make(){
  const z=randWeekday(2027);const who=pick(["AG","AG","AG","AN"]);const years=pick([1,3,6,9,11,13,16,21]);
  const name=pick(["Frau Kraus","Herr Lenz","Frau Yilmaz","Herr Brandt","Frau Albers"]);
  const row=AGTAB.find(r=>years>=r[0]);
  const fw=fourWeeksTermin(z);let ans,ref,why;
  let agEnd=null;if(row){const t=addMonthsClamp(z,row[1]);agEnd=lastOfMonth(t.getUTCFullYear(),t.getUTCMonth());}
  if(who==="AG"&&row){ans=agEnd;ref="§ 622 Abs. 2 Satz 1 Nr. "+row[2]+" BGB";const t=addMonthsClamp(z,row[1]);why=years+" Jahre → "+row[1]+" Monat"+(row[1]>1?"e":"")+" zum Monatsende: "+fmt(z)+" + "+row[1]+" = "+fmt(t)+" → "+fmt(agEnd)+".";}
  else{ans=fw;ref="§ 622 Abs. 1 BGB";why=(who==="AN"?"Der Arbeitnehmer kündigt → gesetzlich nur 4 Wochen, egal wie lange er dabei ist (die längeren Fristen gelten nur für den Arbeitgeber). ":"Unter 2 Jahren → Grundfrist. ")+fmt(z)+" + 28 Tage = "+fmt(addDays(z,28))+" → nächster Termin (15. oder Monatsende): "+fmt(fw)+".";}
  const t1=addMonthsClamp(z,1);
  const dis=[agEnd&&fmt(agEnd),fmt(fw),fmt(addDays(z,28)),fmt(lastOfMonth(ans.getUTCFullYear(),ans.getUTCMonth()+1)),fmt(lastOfMonth(t1.getUTCFullYear(),t1.getUTCMonth()))];
  const o=finishOpts(fmt(ans),dis.filter(x=>x!==fmt(ans)),[fmt(lastOfMonth(ans.getUTCFullYear(),ans.getUTCMonth()-1)),fmt(D(ans.getUTCFullYear(),ans.getUTCMonth(),15)),fmt(lastOfMonth(ans.getUTCFullYear(),ans.getUTCMonth()+2))]);
  return {inp:{kind:"date",v:fmt(ans)},type:"mc",q:(who==="AG"?"Der Arbeitgeber kündigt "+name.replace(/^Herr /,"Herrn "):name+" kündigt selbst")+" ("+years+" Jahr"+(years>1?"e":"")+" im Betrieb). Zugang: "+fmtW(z)+". Zu welchem Tag endet das Arbeitsverhältnis?",o,a:0,e:why,p:ref};}},
 zugang:{t:"kuendigung",label:"Spätester Zugang",make(){
  const m=rnd(1,11);const y=2027;const target=Math.random()<.5?D(y,m,15):lastOfMonth(y,m);const latest=addDays(target,-28);
  const name=pick(["Herr Lenz","Frau Kraus","Lina","Tom"]);
  const o=finishOpts(fmt(latest),[fmt(addDays(target,-30)),fmt(addMonthsClamp(target,-1)),fmt(addDays(target,-21)),fmt(addDays(target,-27))]);
  return {inp:{kind:"date",v:fmt(latest)},type:"mc",q:name+" (seit 14 Jahren im Betrieb) will selbst kündigen und zum "+fmt(target)+" aufhören. Wann muss die Kündigung spätestens zugehen?",o,a:0,
   e:"Arbeitnehmer kündigt → 4 Wochen (die langen Fristen gelten nur für den Arbeitgeber). "+fmt(target)+" − 28 Tage = "+fmtW(latest)+". Probe: Frist beginnt am Folgetag und endet "+fmt(target)+".",p:"§ 622 Abs. 1 BGB"};}},
 abfindung:{t:"kuendigung",label:"Abfindungsrechner",make(){
  const sal=rnd(20,45)*100;const y=rnd(1,14);const m=pick([0,2,4,5,6,6,7,8,9,11]);const r=y+(m>6?1:0);const ans=.5*sal*r;
  const name=pick(["Herr Lenz","Frau Kraus","Frau Albers","Herr Brandt","Tom"]);
  const eur=x=>x.toLocaleString("de-DE",{maximumFractionDigits:0})+" €";
  const o=finishOpts(eur(ans),[eur(.5*sal*(m>6?y:y+1)),eur(sal*r),eur(Math.round(.5*sal*(y+m/12))),eur(.5*sal*(r+1)),eur(.5*sal*Math.max(1,r-1))].filter(x=>x!==eur(ans)),[eur(.5*sal*(r+2)),eur(sal*(r+1)),eur(.25*sal*r)]);
  return {inp:{kind:"num",v:ans,unit:"€"},type:"mc",q:name+" erhält eine betriebsbedingte Kündigung mit Abfindungshinweis und klagt nicht. Betriebszugehörigkeit: "+y+" Jahr"+(y>1?"e":"")+(m?" und "+m+" Monat"+(m>1?"e":""):"")+", Monatsverdienst "+eur(sal)+". Wie hoch ist die Abfindung?",o,a:0,
   e:(m>6?m+" Monate sind mehr als 6 → auf "+r+" Jahre aufrunden. ":m?m+" Monate sind nicht mehr als 6 → bleibt bei "+r+" Jahr"+(r>1?"en":"")+". ":"")+"0,5 × "+eur(sal)+" × "+r+" = "+eur(ans)+".",p:"§ 1a Abs. 2 KSchG"};}},
 kschg:{t:"kuendigung",label:"KSchG-Zähler",make(){
  const vz=rnd(5,10),t20=rnd(0,5),t30=rnd(0,4),az=rnd(1,4);const T=vz+t20*.5+t30*.75;
  const s=x=>num(x)+" AN → KSchG "+(x>10?"gilt":"gilt nicht");
  const o=finishOpts(s(T),[s(T+az),s(vz+t20+t30),s(vz+(t20+t30)*.5),s(T+.5),s(T-.5)]);
  return {inp:{kind:"num",v:T,unit:"Arbeitnehmer"},type:"mc",q:"Betrieb: "+vz+" Vollzeitkräfte, "+t20+" Teilzeitkräfte mit 18 Std., "+t30+" Teilzeitkräfte mit 25 Std., "+az+" Azubis. Wie viele Arbeitnehmer zählen – gilt das KSchG?",o,a:0,
   e:vz+" + "+t20+" × 0,5 + "+t30+" × 0,75 = "+num(T)+". Azubis zählen nicht. Das KSchG gilt erst bei MEHR als 10.",p:"§ 23 Abs. 1 KSchG"};}}
};


/* ====================== Lernzettel ====================== */
// Jeder Block: h = Überschrift, li = Stichpunkte, tab = Tabelle (1. Zeile = Kopf), warn = typische Fallen
const NOTES = {
 duales: [
  {h:"Duales System", li:[
   "Ausbildung an <b>zwei Lernorten</b>: Ausbildungsbetrieb (Fachpraxis) und Berufsschule (Fachtheorie + Allgemeinbildung). Beide arbeiten zusammen.",
   "Abschluss: Abschlussprüfung vor der IHK + Abschlusszeugnis der Berufsschule."]},
  {h:"IHK = zuständige Stelle (§ 71 Abs. 2 BBiG)", li:[
   "führt das Verzeichnis der Ausbildungsverhältnisse (§ 34) – Eintragung beantragt der Ausbildende (§ 36 Abs. 1)",
   "berät und überwacht die Ausbildung (§ 76)", "nimmt die Prüfungen ab", "entscheidet über Verkürzung (§ 8)"]},
  {h:"Ausbildungsordnung (§ 5 Abs. 1 BBiG)", li:["Bezeichnung des Berufs · Ausbildungsdauer · Ausbildungsberufsbild · Ausbildungsrahmenplan (sachliche + zeitliche Gliederung) · Prüfungsanforderungen"]},
  {h:"Ausbildungsvertrag", li:[
   "Entsteht durch <b>Einigung</b> (z. B. Zusage). § 11 regelt nur, dass der Inhalt festgehalten wird.",
   "Der Ausbildende hält den wesentlichen Inhalt fest: unverzüglich nach Abschluss, <b>spätestens vor Beginn</b>; seit 01.08.2024 in <b>Textform</b> (§ 11 Abs. 1 Satz 1). Euer Skript nennt noch die alte Fassung „schriftlich + Unterschriften“.",
   "Mindestinhalte: Ziel, Beginn und Dauer, tägliche Ausbildungszeit, Probezeit, Vergütung, Urlaub, Kündigungsvoraussetzungen … (§ 11 Abs. 1 Satz 2)",
   "Aushändigen an Azubi <b>und</b> gesetzliche Vertreter (§ 11 Abs. 2)"]},
  {h:"Wichtige Zahlen", tab:[["Regel","Fundstelle"],["Probezeit mind. 1, höchstens 4 Monate","§ 20 Satz 2 BBiG"],["Vergütung steigt mindestens jährlich","§ 17 Abs. 1 Satz 2 BBiG"],["Mindestvergütung Beginn 2026: 724 / 854 / 977 €","§ 17 Abs. 2 BBiG"],["Überstunden: bezahlen oder Freizeit","§ 17 Abs. 7 BBiG"],["Vergütung spätestens letzter Arbeitstag des Monats","§ 18 Abs. 2 BBiG"]]},
  {h:"Nichtig (§ 12 BBiG)", tab:[["Vereinbarung","Fundstelle"],["Bindung an den Betrieb nach der Ausbildung","Abs. 1 Satz 1 – erlaubt nur in den letzten 6 Monaten (Satz 2)"],["Ausbildungsgebühr / Entschädigung","Abs. 2 Nr. 1"],["Vertragsstrafe","Abs. 2 Nr. 2"],["Ausschluss von Schadensersatz","Abs. 2 Nr. 3"],["Schadensersatz als Pauschale","Abs. 2 Nr. 4"]]},
  {warn:["Der Beruf heißt „Kauffrau für Versicherungen und <b>Finanzanlagen</b>“ (Ausbildungsordnung 2022).","6 Monate Probezeit gibt es nur im Arbeitsvertrag (§ 622 Abs. 3 BGB) – in der Ausbildung höchstens 4."]}
 ],
 pflichten: [
  {h:"Pflichten des Azubis (§ 13 Satz 2 BBiG)", tab:[["Nr.","Pflicht"],["1","Aufgaben sorgfältig ausführen"],["2","an Ausbildungsmaßnahmen/Berufsschule teilnehmen"],["3","Weisungen befolgen"],["4","Ordnung der Ausbildungsstätte beachten"],["5","Werkzeug, Maschinen, Einrichtungen pfleglich behandeln"],["6","Betriebs- und Geschäftsgeheimnisse wahren"],["7","Ausbildungsnachweis führen"]]},
  {h:"Pflichten des Ausbildenden (§ 14 BBiG)", li:[
   "Abs. 1 Nr. 1 Handlungsfähigkeit vermitteln · Nr. 2 selbst ausbilden oder Ausbilder beauftragen · Nr. 3 Ausbildungsmittel <b>kostenlos</b> (auch Fachliteratur) · Nr. 4 zum Berufsschulbesuch anhalten · Nr. 5 charakterlich fördern",
   "Abs. 2: Ausbildungsnachweis am Arbeitsplatz führen lassen (Satz 2)",
   "Abs. 3: nur Aufgaben, die dem <b>Ausbildungszweck</b> dienen",
   "dazu: Freistellung (§ 15), Zeugnis (§ 16 – Leistung/Verhalten auf Verlangen: Abs. 2 Satz 2), Vergütung (§ 17), Fortzahlung bei Ausfall (§ 19 Abs. 1 Nr. 2 a)"]},
  {h:"Ende der Ausbildung (§ 21 BBiG)", li:["Abs. 1: mit Ablauf der Ausbildungszeit","Abs. 2: früher mit <b>Bekanntgabe des Ergebnisses</b> durch den Prüfungsausschuss","Abs. 3: nicht bestanden → auf Verlangen bis zur Wiederholungsprüfung, höchstens 1 Jahr","§ 24: Weiterarbeit ohne Absprache → unbefristetes Arbeitsverhältnis","§ 43 Abs. 1 Nr. 2: ohne Ausbildungsnachweis keine Prüfungszulassung","§ 8 Abs. 1: Verkürzung auf gemeinsamen Antrag, die IHK entscheidet"]},
  {h:"Kündigung der Ausbildung (§ 22 BBiG)", tab:[["Situation","Regel","Fundstelle"],["Probezeit","jederzeit, ohne Frist","Abs. 1"],["nach Probezeit – Betrieb","nur wichtiger Grund, fristlos","Abs. 2 Nr. 1"],["nach Probezeit – Azubi gibt auf / anderer Beruf","4 Wochen Frist","Abs. 2 Nr. 2"],["Form","schriftlich; nach Probezeit mit Gründen","Abs. 3"],["wichtiger Grund bekannt","nur innerhalb von 2 Wochen","Abs. 4 Satz 1"]]},
  {warn:["Wechsel in den <b>gleichen Beruf</b> bei einem anderen Betrieb ist kein Fall von Abs. 2 Nr. 2 → nur Aufhebungsvertrag.","Dem Kunden im Beratungsgespräch Kaffee reichen: ja (Service am Kunden) – § 13 Satz 2 Nr. 1 i. V. m. § 14 Abs. 3 BBiG."]}
 ],
 jarbschg: [
  {h:"Jugendarbeitsschutz – gilt von 15 bis unter 18 (§ 2 Abs. 2)", tab:[["Thema","Regel","Fundstelle"],["Arbeitszeit","8 Std./Tag, 40 Std./Woche (8,5 Std., wenn andere Tage kürzer)","§ 8 Abs. 1 / 2a"],["Pausen","> 4,5–6 Std.: 30 Min.; > 6 Std.: 60 Min.; Blöcke ab 15 Min.; max. 4,5 Std. am Stück","§ 11 Abs. 1, 2"],["Schichtzeit","Arbeitszeit + Pausen, max. 10 Std.","§ 4 Abs. 2, § 12"],["Freizeit","mind. 12 Std. zwischen zwei Arbeitstagen","§ 13"],["Nachtruhe","nur 6–20 Uhr","§ 14 Abs. 1"],["5-Tage-Woche","nur 5 Tage pro Woche","§ 15"],["Samstag/Sonntag","grundsätzlich frei; bei Ausnahmen anderer Tag frei","§ 16, § 17"],["Gefährliche Arbeiten","verboten, z. B. über die Leistungsfähigkeit","§ 22 Abs. 1 Nr. 1"],["Erstuntersuchung","vor Beginn, max. 14 Monate alt","§ 32 Abs. 1"],["Nachuntersuchung","nach 1 Jahr; Verbot erst nach 14 Monaten","§ 33 Abs. 1, 3"]]},
  {h:"Urlaub", tab:[["Alter am 1. Januar","Mindesturlaub","Fundstelle"],["noch nicht 16","30 Werktage","§ 19 Abs. 2 Satz 1 Nr. 1 JArbSchG"],["noch nicht 17","27 Werktage","Nr. 2"],["noch nicht 18","25 Werktage","Nr. 3"],["ab 18","24 Werktage","§ 3 Abs. 1 BUrlG"]]},
  {li:["<b>Werktage</b> = alle Tage außer Sonn- und Feiertage (Mo–Sa), § 3 Abs. 2 BUrlG. 24 Werktage = 20 Arbeitstage bei 5-Tage-Woche."]},
  {warn:["Alter immer am <b>1. Januar</b> bestimmen – wer am 31.12. Geburtstag hatte, ist schon älter.","Genau 4,5 Std. → keine Pause; genau 6 Std. → 30 Min.","Die 5-Tage-Woche steht in § 15 (nicht § 8, wie im Lernzettel der Klasse)."]}
 ],
 schule: [
  {h:"Freistellung – Azubis unter 18: § 9 JArbSchG · ab 18: § 15 BBiG", li:[
   "Für den Unterricht freistellen – auch Video-/Distanzunterricht. Fällt Unterricht aus → in den Betrieb.",
   "Unterricht beginnt <b>vor 9 Uhr</b> → vorher keine Arbeit (§ 15 Abs. 1 Satz 1 BBiG / § 9 Abs. 1 Satz 2 Nr. 1 JArbSchG).",
   "Prüfungen und der Arbeitstag vor der schriftlichen Abschlussprüfung: frei (§ 15 Abs. 1 Satz 2 Nr. 4, 5 BBiG)."]},
  {h:"Rechenschema Anrechnung", tab:[["Schritt","Frage","Ergebnis"],["1","Mehr als 5 Unterrichtsstunden à 45 Min.? (einmal pro Woche)","Ja → frei, angerechnet mit der durchschnittlichen täglichen Zeit (§ 15 Abs. 2 Nr. 2 BBiG / § 9 Abs. 2 Nr. 1 JArbSchG)"],["2","Sonst","Unterricht inkl. Pausen + notwendige Wegezeit Schule → Betrieb (§ 15 Abs. 2 Nr. 1 BBiG / § 9 Abs. 2 Nr. 3 JArbSchG)"],["3","Rest","Tageshöchstzeit (Jugendliche 8 Std.) minus Angerechnetes = höchstens noch im Betrieb"],["4","Blockwoche ≥ 25 Std. an 5 Tagen","frei, angerechnet mit der durchschnittlichen Wochenzeit (§ 15 Abs. 1 Satz 2 Nr. 3, Abs. 2 Nr. 3 BBiG)"]]},
  {warn:["Genau 5 Unterrichtsstunden sind <b>nicht</b> „mehr als 5“ → zurück in den Betrieb.","Zwei lange Schultage: nur einer ist frei – der Betrieb bestimmt, welcher.","Der Weg von zu Hause zur Schule zählt nicht."]}
 ],
 vertrag: [
  {h:"Individual- und Kollektivarbeitsrecht", tab:[["Regelung","Art","Vertragspartner"],["Arbeitsvertrag","Individualarbeitsrecht","Arbeitgeber ↔ Arbeitnehmer"],["Tarifvertrag","Kollektivarbeitsrecht","Gewerkschaft ↔ Arbeitgeberverband"],["Betriebsvereinbarung","Kollektivarbeitsrecht","Arbeitgeber ↔ Betriebsrat"]]},
  {h:"Arbeitsvertrag", li:["Formen: schriftlich, mündlich, konkludent (durch schlüssiges Verhalten).","Nachweisgesetz: Der Arbeitgeber muss die wesentlichen Bedingungen festhalten und nachweisen.","Vertragsfreiheit, aber begrenzt durch Gesetze, Tarifverträge, Betriebsvereinbarungen und Rechtsprechung.","Hauptpflichten (§ 611a BGB): AN → Arbeitsleistung, AG → Vergütung."]},
  {h:"Pflichten", tab:[["Arbeitgeber","Arbeitnehmer"],["Vergütung","Arbeitspflicht"],["Urlaub gewähren","Arbeitszeit einhalten"],["Arbeitsmittel stellen","Schweigepflicht"],["Beschäftigungspflicht","Sorgfaltspflicht"],["Fürsorgepflicht","Weisungsgebundenheit"],["Arbeitsschutz","Betriebsfrieden wahren"],["Zeugnis (§ 109 GewO)","Wettbewerbsverbot (§ 60 HGB)"]]},
  {h:"Fälle", tab:[["Fall","Ergebnis"],["Chef verschläft, schickt heim","Lohn – § 615 Satz 1 BGB (Annahmeverzug)"],["Stromausfall","Lohn – § 615 Satz 3 BGB (Betriebsrisiko)"],["Versetzung in Nachbarfiliale","Weisungsrecht – § 106 Satz 1 GewO"],["3× vorbehaltlos Weihnachtsgeld","Anspruch – betriebliche Übung"],["mit „freiwillig, ohne Rechtsanspruch“","kein Anspruch"]]},
  {li:["<b>Arbeitsgericht</b> kommt laut Themenliste der Klasse wohl nicht dran (Arbeitsgericht → Landesarbeitsgericht → Bundesarbeitsgericht in Erfurt)."]}
 ],
 kuendigung: [
  {h:"Grundlagen", li:["Ende durch Kündigung, Aufhebungsvertrag, Ablauf der Befristung oder Erreichen des Zwecks.","Kündigung = einseitige, empfangsbedürftige Willenserklärung → wirksam mit <b>Zugang</b>.","Immer <b>schriftlich</b> mit Unterschrift – keine E-Mail, kein Fax, kein WhatsApp (§ 623 BGB).","Gibt es einen Betriebsrat: vor jeder Kündigung anhören, sonst unwirksam (§ 102 Abs. 1 BetrVG). Bedenken: ordentlich 1 Woche, außerordentlich 3 Tage."]},
  {h:"Fristen (§ 622 BGB)", tab:[["Fall","Frist"],["Arbeitnehmer kündigt / Arbeitgeber bei unter 2 Jahren","4 Wochen zum 15. oder Monatsende (Abs. 1)"],["Arbeitgeber, ab 2 / 5 / 8 / 10 Jahren","1 / 2 / 3 / 4 Monate zum Monatsende (Abs. 2)"],["Arbeitgeber, ab 12 / 15 / 20 Jahren","5 / 6 / 7 Monate zum Monatsende"],["Probezeit (max. 6 Monate)","2 Wochen, beliebiger Tag (Abs. 3)"],["fristlos (§ 626)","wichtiger Grund; innerhalb 2 Wochen ab Kenntnis"]]},
  {h:"Abmahnung – 3 Funktionen", li:["<b>Rügefunktion</b>: konkretes Fehlverhalten mit Datum benennen","<b>Aufforderungsfunktion</b>: künftig vertragsgemäß verhalten","<b>Warnfunktion</b>: Konsequenzen (Kündigung) androhen","Muss nicht schriftlich sein, aber zugehen. Meist nötig vor einer verhaltensbedingten Kündigung."]},
  {h:"Kündigungsschutzgesetz", tab:[["Punkt","Regel","Fundstelle"],["Betriebsgröße","mehr als 10 AN; Teilzeit bis 20 Std. = 0,5, bis 30 Std. = 0,75; Azubis zählen nicht","§ 23 Abs. 1"],["Wartezeit","mehr als 6 Monate im Betrieb","§ 1 Abs. 1"],["Gründe","personen-, verhaltens- oder betriebsbedingt","§ 1 Abs. 2 Satz 1"],["Sozialauswahl","Betriebszugehörigkeit, Lebensalter, Unterhaltspflichten, Schwerbehinderung","§ 1 Abs. 3 Satz 1"],["Klage","innerhalb von 3 Wochen nach Zugang","§ 4 Satz 1"],["Abfindung","betriebsbedingt + Hinweis + keine Klage: 0,5 Monatsverdienste je Jahr (über 6 Monate aufrunden)","§ 1a"]]},
  {h:"Kündigungsschutzgruppen", tab:[["Gruppe","Fundstelle"],["Azubis nach der Probezeit","§ 22 BBiG"],["Betriebsrat · JAV (auch 1 Jahr danach)","§ 15 Abs. 1 KSchG, § 103 BetrVG"],["Schwangere bis 4 Monate nach Entbindung","§ 17 MuSchG"],["Elternzeit","§ 18 Abs. 1 BEEG"],["Schwerbehinderte (Integrationsamt)","§ 168 SGB IX"]]},
  {warn:["§ 622 Abs. 2 gilt nur, wenn der <b>Arbeitgeber</b> kündigt.","Rückwärtsrechnen: spätester Zugang = Termin − 28 Tage.","Langjährig Beschäftigte haben nur längere Fristen, keinen besonderen Kündigungsschutz."]}
 ]
};

/* ====================== Ergänzungen aus Zajkas Unterlagen (19.11.) ====================== */
Q.push(
{id:"d23",t:"duales",type:"mc",q:"Wozu dient die Probezeit in der Ausbildung?",o:["Der Betrieb prüft die Eignung, der Azubi prüft, ob der Beruf zu ihm passt","Der Azubi bekommt in der Zeit weniger Vergütung","Die IHK prüft den Ausbildungsvertrag","Der Azubi lernt nur in der Berufsschule"],a:0,e:"Beide Seiten sollen prüfen können, ob die Ausbildung passt – deshalb darf in der Probezeit jederzeit ohne Frist gekündigt werden.",p:"§ 20, § 22 Abs. 1 BBiG"},
{id:"d24",t:"duales",type:"tf",q:"Marion ist in ihrer 3-monatigen Probezeit 5 Wochen krank. Steht es im Ausbildungsvertrag, verlängert sich ihre Probezeit um diese 5 Wochen.",a:true,e:"Ist die Probezeit um mehr als ein Drittel unterbrochen, darf eine Verlängerung um die Ausfallzeit vereinbart werden (so im IHK-Mustervertrag, vom BAG 2016 bestätigt). Ohne Vereinbarung verlängert sie sich nicht von allein. 5 Wochen sind mehr als ein Drittel von 3 Monaten."},
{id:"p21",t:"pflichten",type:"mc",q:"Warum muss das Berichtsheft nach dem Grundsatz „Klarheit und Wahrheit“ geführt werden?",o:["Es ist ein Dokument: Es weist die tatsächliche Ausbildung nach und ist Voraussetzung für die Prüfungszulassung","Damit der Azubi mehr Vergütung bekommt","Weil die Berufsschule es benotet","Weil es sonst die Probezeit verlängert"],a:0,e:"Der Ausbildungsnachweis belegt, was wirklich ausgebildet wurde – auch zur Absicherung, falls jemand durch die Prüfung fällt. Ohne ihn keine Zulassung (§ 43 Abs. 1 Nr. 2 BBiG).",p:"§ 13 Satz 2 Nr. 7 BBiG"},
{id:"p22",t:"pflichten",type:"mc",q:"Die 17-jährige Azubine will nach der Probezeit kündigen, weil sie die Ausbildung aufgibt. Was braucht sie zusätzlich?",o:["Die Zustimmung ihrer Eltern (gesetzliche Vertreter)","Die Zustimmung der IHK","Die Zustimmung der Berufsschule","Nichts weiter"],a:0,e:"Minderjährige brauchen für die Kündigung die Zustimmung der gesetzlichen Vertreter. Kündigt der Betrieb einer Minderjährigen, muss die Kündigung den Eltern zugehen.",p:"§ 22 Abs. 2 Nr. 2 BBiG"},
{id:"p23",t:"pflichten",type:"tf",q:"Kündigt der Betrieb einer 16-jährigen Azubine, reicht es, ihr die Kündigung persönlich zu übergeben.",a:false,e:"Bei Minderjährigen muss die Kündigung gegenüber dem gesetzlichen Vertreter (den Eltern) erklärt werden – erst dann geht sie zu."},
{id:"s15",t:"schule",type:"mc",q:"Der Betrieb stellt die Azubine nicht für die Berufsschule frei. Was gilt?",o:["Ordnungswidrigkeit mit Geldbuße – die Azubine darf trotzdem zum Unterricht gehen","Die Azubine muss im Betrieb bleiben","Das ist erlaubt, wenn viel Arbeit anfällt","Die Azubine muss dafür Urlaub nehmen"],a:0,e:"Geldbuße bis 5.000 €, bei Minderjährigen bis 15.000 €. Im Wiederholungsfall kann die IHK die Ausbildungsbefugnis entziehen.",p:"§ 101 Abs. 1 Nr. 4 BBiG / § 58 Abs. 5 Nr. 6 JArbSchG"},
{id:"s16",t:"schule",type:"tf",q:"Geht die Azubine trotz Verbot des Ausbilders zur Berufsschule, darf der Betrieb sie dafür abmahnen.",a:false,e:"Sie darf „eigenmächtig“ zum Unterricht gehen. Der Betrieb darf sie dafür weder abmahnen noch kündigen noch Urlaub abziehen."},
{id:"s17",t:"schule",type:"mc",q:"Wie hoch kann die Geldbuße sein, wenn ein Betrieb einen minderjährigen Azubi nicht für die Berufsschule freistellt?",o:["Bis 15.000 €","Bis 5.000 €","Bis 1.000 €","Es gibt keine Geldbuße"],a:0,e:"Bei Volljährigen bis 5.000 € (BBiG), bei Minderjährigen bis 15.000 € (JArbSchG).",p:"§ 58 Abs. 5 Nr. 6 JArbSchG"},
{id:"j22",t:"jarbschg",type:"mc",q:"Wozu dient die Erstuntersuchung vor Beginn der Ausbildung?",o:["Feststellen, ob der Jugendliche gesundheitlich für die Arbeit geeignet ist","Feststellen, ob er die Prüfung schafft","Sie ersetzt die Krankmeldung","Sie ist nur für Volljährige"],a:0,e:"So sollen gesundheitliche Schäden durch die Arbeit vermieden werden. Ohne Bescheinigung darf der Jugendliche nicht beschäftigt werden.",p:"§ 32 Abs. 1 JArbSchG"},
{id:"v23",t:"vertrag",type:"mc",q:"Welche Pflicht hat der ARBEITNEHMER?",o:["Krankheit unverzüglich melden","Gleichbehandlung aller Beschäftigten","Zeugnis ausstellen","Urlaub gewähren"],a:0,e:"Der Arbeitgeber muss die Arbeitsunfähigkeit und ihre voraussichtliche Dauer unverzüglich erfahren. Gleichbehandlung, Zeugnis und Urlaub sind Pflichten des Arbeitgebers.",p:"§ 5 Abs. 1 Satz 1 EntgFG"},
{id:"v24",t:"vertrag",type:"mc",q:"Ab wann entsteht aus Weihnachtsgeld eine betriebliche Übung?",o:["Nach dreimaliger vorbehaltloser Zahlung","Erst nach mehr als drei Zahlungen","Schon nach der ersten Zahlung","Nur wenn es im Tarifvertrag steht"],a:0,e:"Dreimal vorbehaltlos reicht (BAG). In der Mitschrift steht „mehr als 3x“ – das ist zu streng."},
{id:"v25",t:"vertrag",type:"tf",q:"Zahlt der Chef dreimal Weihnachtsgeld nur noch „freiwillig“ und keiner widerspricht, ist der alte Anspruch aus betrieblicher Übung weg.",a:false,e:"Zusatzwissen: Diese „gegenläufige betriebliche Übung“ hat das BAG 2009 aufgegeben. Ein Anspruch aus betrieblicher Übung geht nur per Vertragsänderung oder Kündigung weg. (Im Unterricht wurde noch die alte Ansicht genannt.)"},
{id:"k32",t:"kuendigung",type:"mc",q:"Was sollte in einer Abmahnung stehen?",o:["Datum und konkretes Fehlverhalten, Aufforderung zur Besserung, Androhung von Folgen","Nur das Wort „Abmahnung“","Eine Kündigungsfrist","Die Höhe einer Strafe"],a:0,e:"Dazu ggf. Zeugen oder Belege. Zum Beweis: vom Arbeitnehmer gegenzeichnen lassen."},
{id:"k33",t:"kuendigung",type:"mc",q:"Ein Kündigungsschreiben wird um 21 Uhr in den Briefkasten geworfen. Wann geht es zu?",o:["Am nächsten Tag, wenn der Briefkasten üblicherweise geleert wird","Sofort um 21 Uhr","Erst wenn der Empfänger den Brief liest","Drei Tage später"],a:0,e:"Zugang = so in den Machtbereich gelangt, dass man unter normalen Umständen davon Kenntnis nehmen kann. Abends rechnet niemand mehr mit Post."},
{id:"k34",t:"kuendigung",type:"tf",q:"Ein Übergabe-Einschreiben geht schon zu, wenn der Benachrichtigungszettel im Briefkasten liegt.",a:false,e:"Es geht erst mit der Aushändigung durch die Post zu. (Ein Einwurf-Einschreiben geht dagegen wie ein normaler Brief mit dem Einwurf zu.)"},
{id:"k35",t:"kuendigung",type:"tf",q:"Ist die Arbeitnehmerin im Urlaub, geht ihr eine eingeworfene Kündigung erst nach dem Urlaub zu.",a:false,e:"Urlaub verzögert den Zugang grundsätzlich nicht. Absichtliches Verhindern des Zugangs hilft auch nicht."}
);
CARDS.push(
["Zweck der Probezeit","Der Betrieb prüft die Eignung, der Azubi prüft, ob der Beruf zu ihm passt. Kündigung jederzeit ohne Frist (§ 22 Abs. 1 BBiG)."],
["Krank in der Probezeit","Mehr als ein Drittel unterbrochen → Verlängerung um die Ausfallzeit, aber nur wenn im Vertrag vereinbart (IHK-Mustervertrag)."],
["Berichtsheft","Klarheit und Wahrheit: Es ist ein Dokument und weist die tatsächliche Ausbildung nach. Ohne Nachweis keine Prüfungszulassung (§ 43 Abs. 1 Nr. 2 BBiG)."],
["Minderjährige & Kündigung","Azubi kündigt: Zustimmung der Eltern nötig. Betrieb kündigt: Kündigung muss den Eltern zugehen."],
["Keine Freistellung","Ordnungswidrigkeit: bis 5.000 € (bis 15.000 € bei Minderjährigen); Wiederholung → Entzug der Ausbildungsbefugnis. Azubi darf trotzdem zur Schule, keine Abmahnung."],
["Zugang der Kündigung","Anwesend: sofort. Briefkasten: wenn normalerweise geleert wird (abends → nächster Tag). Übergabe-Einschreiben: erst bei Aushändigung. Urlaub verzögert nicht."],
["Inhalt einer Abmahnung","Datum + konkretes Fehlverhalten, Aufforderung zur Besserung, Androhung von Folgen, ggf. Zeugen; gegenzeichnen lassen."]
);
(function () {
  function before(topic, block) { const a = NOTES[topic]; const i = a.findIndex((b) => b.warn); a.splice(i < 0 ? a.length : i, 0, block); }
  function warn(topic, items) { const b = NOTES[topic].find((x) => x.warn); if (b) b.warn.push(...items); else NOTES[topic].push({ warn: items }); }
  before("pflichten", { h: "Probezeit, Berichtsheft, Minderjährige", li: [
    "Probezeit: Betrieb prüft die <b>Eignung</b>, Azubi prüft die <b>Neigung</b>.",
    "Krank in der Probezeit: mehr als ein Drittel unterbrochen → Verlängerung um die Ausfallzeit, <b>nur wenn vereinbart</b>.",
    "Berichtsheft nach <b>Klarheit und Wahrheit</b> führen – es ist ein Dokument; ohne Nachweis keine Prüfungszulassung (§ 43 Abs. 1 Nr. 2).",
    "Minderjährige: Kündigung durch Azubi nur mit Zustimmung der Eltern; Kündigung durch den Betrieb an die Eltern."] });
  before("schule", { h: "Wenn der Betrieb nicht freistellt", li: [
    "Ordnungswidrigkeit: Geldbuße bis 5.000 € (§ 101 Abs. 1 Nr. 4 BBiG), bei Minderjährigen bis 15.000 € (§ 58 Abs. 5 Nr. 6 JArbSchG).",
    "Im Wiederholungsfall: IHK kann die Ausbildungsbefugnis entziehen (§ 33 BBiG).",
    "Azubi darf trotzdem zum Unterricht – keine Abmahnung, keine Kündigung, kein Urlaubsabzug."] });
  warn("schule", ["Wegezeit Schule → Betrieb immer mitzählen. Arbeitsblatt Linda: Dienstag 8,5 Std. → Woche <b>38 Std.</b> (nicht 37,5). Petra: Mittwoch 9 Std. 30 Min. → Woche <b>41 Std. 30 Min.</b> (nicht 40 Std. 45 Min.)."]);
  const pf = NOTES.vertrag.find((b) => b.h === "Pflichten");
  if (pf) pf.tab.push(["Gleichbehandlung", "Treuepflicht"], ["", "Krankheit unverzüglich melden (§ 5 EntgFG)"]);
  warn("vertrag", ["Betriebliche Übung: <b>dreimal</b> vorbehaltlos reicht (Mitschrift: „mehr als 3x“).",
    "Zusatzwissen: Eine „gegenläufige“ betriebliche Übung hebt den Anspruch nicht mehr auf (BAG 2009)."]);
  before("kuendigung", { h: "Zugang und Abmahnung im Detail", li: [
    "Zugang: anwesend sofort; Briefkasten, wenn normalerweise geleert wird (abends eingeworfen → nächster Tag); Übergabe-Einschreiben erst bei Aushändigung; Urlaub verzögert nicht.",
    "Abmahnung enthält: Datum + Fehlverhalten, Aufforderung, Androhung von Folgen, ggf. Zeugen; gegenzeichnen lassen."] });
  warn("kuendigung", ["Euer Infoblatt sagt „schriftliche Abmahnung“ – vorgeschrieben ist keine Form, schriftlich ist nur besser zum Beweis.",
    "JAV-Kündigungsschutz: § 15 KSchG. § 78a BetrVG (im Lernzettel der Klasse) regelt die Übernahme nach der Ausbildung."]);
})();

/* ====================== Blätter, Probeklausuren, Lernplan ====================== */
const SHEETS = [
 {id:"uebung1", title:"Übungsblätter Teil 1", sub:"6 Blätter · alle Themen · 7 Seiten"},
 {id:"uebung2", title:"Übungsblätter Teil 2", sub:"neue Fälle zu allen Themen · 3 Seiten"},
 {id:"ergaenzung", title:"Ergänzungsblatt", sub:"Kündigungsschutzgruppen, Abfindung, Betriebsrat, Abmahnung"}
];
const EXAMS = [
 {id:"probetest", title:"Probetest", level:"leicht", minutes:20, parts:[6,6,5,6,2]},
 {id:"klausur-a", title:"Probeklausur A", level:"mittel", minutes:60, parts:[5,8,8,8,6,6,9]},
 {id:"klausur-b", title:"Probeklausur B", level:"schwer", minutes:60, parts:[9,8,10,22,7,4], note:"Aufgabe 5 (Arbeitsgericht) kommt laut Themenliste wohl nicht dran – du kannst sie auslassen."}
];
const PLAN = ["uebung1","uebung2","ergaenzung","probetest","klausur-a","klausur-b"];

window.SUBJECTS = window.SUBJECTS || {};
window.SUBJECTS.lf1 = {
  id: "lf1", short: "LF1", name: "Arbeits- und Ausbildungsrecht",
  topics: TOPICS, questions: Q, cards: CARDS, gens: GENS,
  notes: NOTES, sheets: SHEETS, exams: EXAMS, plan: PLAN
};
})();
