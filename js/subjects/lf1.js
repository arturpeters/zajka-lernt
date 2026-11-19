/* LF1 – Arbeits- und Ausbildungsrecht.
 * Themen, Lernpunkte, Fall-Generatoren, Lernzettel, Blätter, Probeklausuren.
 * Fragen, Lernkarten und Memory-Paare stehen in lf1-fragen.js (window.LF1_DATA).
 * Inhalte NUR aus dem Unterricht (Arbeitsblätter, Mitschriften, Lernzettel der Klasse, Lernsituation Anita).
 */
(function () {
"use strict";
const DATA = window.LF1_DATA || { Q: [], CARDS: [], PAIRS: [] };

const TOPICS=[
 {id:"duales",n:"1",name:"Duales System & Ausbildungsvertrag",short:"Vertrag",pre:"du-"},
 {id:"pflichten",n:"2",name:"Pflichten & Kündigung in der Ausbildung",short:"Pflichten",pre:"pf-"},
 {id:"jarbschg",n:"3",name:"Jugendarbeitsschutz",short:"JArbSchG",pre:"ja-"},
 {id:"schule",n:"4",name:"Berufsschule: Freistellung & Anrechnung",short:"Berufsschule",pre:"sc-"},
 {id:"vertrag",n:"5",name:"Arbeitsvertrag, Rechte & Pflichten",short:"Arbeitsvertrag",pre:"av-"},
 {id:"kuendigung",n:"6",name:"Kündigung & Kündigungsschutz",short:"Kündigung",pre:"ku-"}
];
/* Lernpunkte: der Fortschritt zählt, wie viele davon sitzen. */
const CONCEPTS={
 "du-lernorte":"Duales System: zwei Lernorte","du-zeiten":"Betrieb 3–4 Tage, Schule 8–12 Std.","du-abschluss":"Abschluss der Ausbildung","du-ihk":"Aufgaben der IHK","du-ao":"Ausbildungsordnung","du-bbig":"Was regelt das BBiG?","du-gesetz":"Gesetzestexte lesen","du-zustande":"Vertrag entsteht mit der Zusage","du-form":"Vertrag festhalten und unterschreiben","du-probezeit":"Probezeit 1–4 Monate","du-probezweck":"Zweck der Probezeit","du-probekrank":"Krank in der Probezeit","du-verkuerzung":"Verkürzung der Ausbildung","du-ende":"Ende der Ausbildung","du-anita":"Vertrag prüfen (Anita)",
 "pf-azubi":"Pflichten des Azubis (§ 13)","pf-pfleglich":"Arbeitsmittel pfleglich behandeln","pf-zweck":"Nur Aufgaben zum Ausbildungszweck","pf-betrieb":"Pflichten des Betriebs (§ 14)","pf-berichtsheft":"Berichtsheft","pf-zulassung":"Berichtsheft und Prüfungszulassung","pf-kuend-probe":"Kündigung in der Probezeit","pf-kuend-grund":"Kündigung aus wichtigem Grund","pf-kuend-azubi":"Azubi gibt auf / wechselt den Beruf","pf-minderjaehrig":"Minderjährige und Kündigung",
 "ja-zweck":"Zweck und Geltung des JArbSchG","ja-arbeitszeit":"8 Std. täglich, 40 Std. wöchentlich","ja-85":"8,5 Std. bei kürzeren Tagen","ja-5tage":"Fünf-Tage-Woche","ja-pausen":"Pausen für Jugendliche","ja-nacht":"Nachtruhe 20–6 Uhr","ja-wochenende":"Samstag, Sonntag, Feiertag","ja-gefahr":"Gefährliche Arbeiten","ja-erst":"Erstuntersuchung","ja-nach":"Nachuntersuchung",
 "sc-freistellung":"Freistellung für die Berufsschule","sc-virtuell":"Virtueller Unterricht","sc-ausfall":"Unterrichtsausfall","sc-sanktion":"Folgen bei Nichtfreistellung","sc-pruefung":"Freistellung für Prüfungen","sc-anrechnung":"Anrechnung der Schulzeit","sc-langertag":"Langer Berufsschultag","sc-zweilange":"Zwei lange Schultage","sc-rechnen":"Arbeitszeit berechnen",
 "av-begriff":"Was ist ein Arbeitsvertrag?","av-formen":"Formen des Arbeitsvertrags","av-freiheit":"Vertragsfreiheit und Grenzen","av-nachwg":"Nachweisgesetz","av-ag-pfl":"Pflichten des Arbeitgebers","av-an-pfl":"Pflichten des Arbeitnehmers","av-weisung":"Weisungsrecht (Bertram, Wehrmann)","av-schweigen":"Schweigepflicht (Cornelius)","av-lohn":"Lohn trotz Ausfall (Kuno)","av-uebung":"Betriebliche Übung (Hansen)",
 "ku-enden":"Wie ein Arbeitsverhältnis endet","ku-begriff":"Was ist eine Kündigung?","ku-form":"Form der Kündigung","ku-zugang":"Zugang der Kündigung","ku-inhalt":"Inhalt der Kündigung","ku-br":"Betriebsrat anhören","ku-arten":"Ordentlich und außerordentlich","ku-grundfrist":"Grundkündigungsfrist","ku-lang":"Längere Fristen (Arbeitgeber)","ku-probe":"Probezeit im Arbeitsvertrag","ku-fristlos":"Außerordentliche Kündigung","ku-abmahnung":"Abmahnung","ku-abm-noetig":"Wann eine Abmahnung nötig ist","ku-kschg-gilt":"Wann das KSchG gilt","ku-gruende":"Personen-, verhaltens-, betriebsbedingt","ku-sozial":"Sozialauswahl","ku-klage":"Kündigungsschutzklage","ku-abfindung":"Abfindung","ku-schutzgruppen":"Kündigungsschutzgruppen"
};
const topicOf = (k) => (TOPICS.find((t) => k.indexOf(t.pre) === 0) || TOPICS[0]).id;
const Q = DATA.Q.map((q) => Object.assign({ t: topicOf(q.k) }, q));
const CARDS = DATA.CARDS.map((c) => ({ k: c[0], t: topicOf(c[0]), f: c[1], b: c[2] }));

/* ====================== Generatoren (immer neue Fälle) ====================== */
const MONTHS=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const WD=["So","Mo","Di","Mi","Do","Fr","Sa"];
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
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
const YOUNG=["Sophie","Finn","Lea","Emil","Mia","Ben","Nele","Jonas","Lina","Tom"];
const ADULT=["Frau Kraus","Herr Lenz","Frau Yilmaz","Herr Brandt","Frau Albers","Herr Weber"];

const GENS={
 pause:{k:"ja-pausen",label:"Pausenrechner",calc:true,make(){
  const mins=pick([240,270,285,300,330,360,375,390,420,450,480]);const name=pick(YOUNG)+" ("+rnd(15,17)+")";
  let ans,ref;if(mins<=270){ans="Keine Pause vorgeschrieben";ref="§ 11 Abs. 1 Satz 2 JArbSchG (erst ab mehr als 4,5 Std.)";}else if(mins<=360){ans="30 Minuten";ref="§ 11 Abs. 1 Satz 2 Nr. 1 JArbSchG";}else{ans="60 Minuten";ref="§ 11 Abs. 1 Satz 2 Nr. 2 JArbSchG";}
  return {inp:{kind:"num",v:mins<=270?0:mins<=360?30:60,unit:"Minuten",zero:true},type:"mc",q:name+" arbeitet heute "+hm(mins)+" (reine Arbeitszeit ohne Pausen). Wie lang müssen die Pausen mindestens sein?",o:finishOpts(ans,["Keine Pause vorgeschrieben","30 Minuten","45 Minuten","60 Minuten"].filter(s=>s!==ans)),a:0,
   e:"Mehr als 4,5 bis 6 Std. → 30 Min.; mehr als 6 Std. → 60 Min. Genau 4,5 oder genau 6 Std. zählen noch zur unteren Stufe.",p:ref};}},
 anrechnung:{k:"sc-anrechnung",label:"Berufsschul-Anrechnung",calc:true,make(){
  const minor=Math.random()<.5;const name=pick(YOUNG)+" ("+(minor?rnd(16,17):rnd(18,22))+")";
  const avg=pick([450,480]);const k=pick([4,5,5,6,6,7]);const start=pick([465,480]);const pause=k<=4?15:30;const end=start+k*45+pause;const weg=pick([15,20,30,45]);
  const unt=end-start;let ans,ref,why,kk;
  const refLong=minor?"§ 9 Abs. 2 Nr. 1 JArbSchG":"§ 15 Abs. 2 Nr. 2 BBiG";
  const refShort=minor?"§ 9 Abs. 2 Nr. 3 JArbSchG":"§ 15 Abs. 2 Nr. 1 BBiG";
  const optLong=hm(avg)+" – frei, keine Rückkehr in den Betrieb";const optFull=hm(unt+weg)+" – danach zurück in den Betrieb";
  if(k>5){ans=optLong;ref=refLong;kk="sc-langertag";why=k+" Unterrichtsstunden sind mehr als 5 → angerechnet mit der durchschnittlichen täglichen Arbeitszeit ("+hm(avg)+").";}
  else{ans=optFull;ref=refShort;kk="sc-anrechnung";why=(k===5?"Genau 5 Stunden sind nicht MEHR als 5! ":"")+"Unterricht inkl. Pausen "+hm(unt)+" + Weg zum Betrieb "+weg+" Min. = "+hm(unt+weg)+".";}
  const o=finishOpts(ans,[k>5?optFull:optLong,hm(unt)+" – danach zurück in den Betrieb",hm(k*45+weg)+" – danach zurück in den Betrieb",hm(k*45)+" – danach zurück in den Betrieb"]);
  return {k:kk,inp:{kind:"hm",v:k>5?avg:unt+weg,unit:"Std:Min"},type:"mc",q:name+", durchschnittliche tägliche Arbeitszeit "+hm(avg)+". Berufsschule "+clock(start)+"–"+clock(end)+" Uhr: "+k+" Unterrichtsstunden à 45 Min. + "+pause+" Min. Pausen. Weg zum Betrieb: "+weg+" Min. Einziger Schultag der Woche. Was wird angerechnet?",o,a:0,e:why,p:ref};}},
 kuendigung:{k:"ku-grundfrist",label:"Kündigungstermin",calc:true,make(){
  const z=randWeekday(2027);const who=pick(["AG","AG","AG","AN"]);const years=pick([1,3,6,9,11,13,16,21]);
  const name=pick(ADULT);const row=AGTAB.find(r=>years>=r[0]);
  const fw=fourWeeksTermin(z);let ans,ref,why,kk="ku-grundfrist";
  let agEnd=null;if(row){const t=addMonthsClamp(z,row[1]);agEnd=lastOfMonth(t.getUTCFullYear(),t.getUTCMonth());}
  if(who==="AG"&&row){ans=agEnd;kk="ku-lang";ref="§ 622 Abs. 2 Satz 1 Nr. "+row[2]+" BGB";const t=addMonthsClamp(z,row[1]);why=years+" Jahre → "+row[1]+" Monat"+(row[1]>1?"e":"")+" zum Monatsende: "+fmt(z)+" + "+row[1]+" = "+fmt(t)+" → "+fmt(agEnd)+".";}
  else{ans=fw;ref="§ 622 Abs. 1 BGB";why=(who==="AN"?"Die Arbeitnehmerseite kündigt → 4 Wochen, egal wie lange sie dabei ist (die längeren Fristen gelten nur für den Arbeitgeber). ":"Unter 2 Jahren → Grundfrist. ")+fmt(z)+" + 28 Tage = "+fmt(addDays(z,28))+" → nächster Termin (15. oder Monatsende): "+fmt(fw)+".";}
  const t1=addMonthsClamp(z,1);
  const dis=[agEnd&&fmt(agEnd),fmt(fw),fmt(addDays(z,28)),fmt(lastOfMonth(ans.getUTCFullYear(),ans.getUTCMonth()+1)),fmt(lastOfMonth(t1.getUTCFullYear(),t1.getUTCMonth()))];
  const o=finishOpts(fmt(ans),dis.filter(x=>x!==fmt(ans)),[fmt(lastOfMonth(ans.getUTCFullYear(),ans.getUTCMonth()-1)),fmt(D(ans.getUTCFullYear(),ans.getUTCMonth(),15)),fmt(lastOfMonth(ans.getUTCFullYear(),ans.getUTCMonth()+2))]);
  return {k:kk,inp:{kind:"date",v:fmt(ans)},type:"mc",q:(who==="AG"?"Der Arbeitgeber kündigt "+name.replace(/^Herr /,"Herrn "):name+" kündigt selbst")+" ("+years+" Jahr"+(years>1?"e":"")+" im Betrieb, keine Vereinbarung über Fristen). Zugang: "+fmtW(z)+". Zu welchem Tag endet das Arbeitsverhältnis?",o,a:0,e:why,p:ref};}},
 zugang:{k:"ku-grundfrist",label:"Spätester Zugang",calc:true,make(){
  const m=rnd(1,11);const y=2027;const target=Math.random()<.5?D(y,m,15):lastOfMonth(y,m);const latest=addDays(target,-28);
  const name=pick(ADULT);const yrs=pick([3,8,14,22]);
  const o=finishOpts(fmt(latest),[fmt(addDays(target,-30)),fmt(addMonthsClamp(target,-1)),fmt(addDays(target,-21)),fmt(addDays(target,-27))]);
  return {inp:{kind:"date",v:fmt(latest)},type:"mc",q:name+" (seit "+yrs+" Jahren im Betrieb) will selbst kündigen und zum "+fmt(target)+" aufhören. Wann muss die Kündigung spätestens zugehen?",o,a:0,
   e:"Arbeitnehmerseite kündigt → 4 Wochen (die längeren Fristen gelten nur für den Arbeitgeber). "+fmt(target)+" − 28 Tage = "+fmtW(latest)+".",p:"§ 622 Abs. 1 BGB"};}},
 abfindung:{k:"ku-abfindung",label:"Abfindungsrechner",calc:true,make(){
  const sal=rnd(20,45)*100;const y=rnd(1,15);const ans=.5*sal*y;
  const name=pick(ADULT);const eur=x=>x.toLocaleString("de-DE",{maximumFractionDigits:0})+" €";
  const o=finishOpts(eur(ans),[eur(sal*y),eur(.5*sal*(y+1)),eur(.5*sal*Math.max(1,y-1)),eur(.25*sal*y)],[eur(sal*(y+1)),eur(1.5*sal*y)]);
  return {inp:{kind:"num",v:ans,unit:"€"},type:"mc",q:name+" erhält eine betriebsbedingte Kündigung mit Hinweis auf die Abfindung und klagt nicht. "+y+" Jahr"+(y>1?"e":"")+" im Betrieb, Monatsgehalt "+eur(sal)+". Wie hoch ist die Abfindung?",o,a:0,
   e:"0,5 Monatsgehälter pro Beschäftigungsjahr: 0,5 × "+eur(sal)+" × "+y+" = "+eur(ans)+".",p:"§ 1a KSchG"};}},
 kschg:{k:"ku-kschg-gilt",label:"KSchG-Zähler",calc:true,make(){
  const vz=rnd(5,10),t20=rnd(0,5),t30=rnd(0,4),az=rnd(1,4);const T=vz+t20*.5+t30*.75;
  const s=x=>num(x)+" AN → KSchG "+(x>10?"gilt":"gilt nicht");
  const o=finishOpts(s(T),[s(T+az),s(vz+t20+t30),s(vz+(t20+t30)*.5),s(T+.5),s(T-.5)]);
  return {inp:{kind:"num",v:T,unit:"Arbeitnehmer"},type:"mc",q:"Betrieb: "+vz+" Vollzeitkräfte, "+t20+" Teilzeitkräfte mit 18 Std., "+t30+" Teilzeitkräfte mit 25 Std., "+az+" Azubis. Wie viele Arbeitnehmer zählen – gilt das KSchG?",o,a:0,
   e:vz+" + "+t20+" × 0,5 + "+t30+" × 0,75 = "+num(T)+". Azubis zählen nicht. Das KSchG gilt erst bei MEHR als 10.",p:"§ 23 Abs. 1 KSchG"};}},
 jafall:{k:"ja-arbeitszeit",label:"JArbSchG-Fall",make(){
  const name=pick(YOUNG);const age=rnd(15,17);const sit=pick(["tag","tag","pause","pause","nacht","samstag","samstag","alt"]);
  const V=(ok,ref)=>(ok?"Kein Verstoß – ":"Verstoß – ")+ref;
  let q,ans,dis,e,k;
  if(sit==="tag"){const h=pick([7.5,8,8.5,8.5,9]);const fri=h===8.5&&Math.random()<.5;k=h===8.5?"ja-85":"ja-arbeitszeit";
   q=name+" ("+age+") arbeitet "+(fri?"Montag bis Donnerstag je 8,5 Std., freitags nur 6 Std.":"an allen 5 Tagen je "+num(h)+" Std.")+" Verstoß gegen das JArbSchG?";
   if(fri){ans=V(true,"§ 8 Abs. 2a JArbSchG");e="4 × 8,5 + 6 = 40 Std. – an einem Tag ist es kürzer, deshalb sind 8,5 Std. erlaubt.";}
   else if(h<=8){ans=V(true,"§ 8 Abs. 1 JArbSchG");e=num(h)+" Std. täglich, "+num(h*5)+" Std. pro Woche – innerhalb von 8 / 40 Std.";}
   else{ans=V(false,"§ 8 Abs. 1 JArbSchG");e="Höchstens 8 Std. täglich und 40 Std. wöchentlich. "+num(h)+" × 5 = "+num(h*5)+" Std.";}
   dis=[V(true,"§ 8 Abs. 1 JArbSchG"),V(false,"§ 8 Abs. 1 JArbSchG"),V(true,"§ 8 Abs. 2a JArbSchG"),V(false,"§ 11 Abs. 1 JArbSchG")];}
  else if(sit==="pause"){k="ja-pausen";const start=pick([420,450,480,510]);const work=pick([300,330,360,390,420,450,480]);const p=pick([15,30,30,45,60,60]);const end=start+work+p;
   const need=work>360?60:work>270?30:0;const ok=p>=need;
   q=name+" ("+age+") arbeitet von "+clock(start)+" bis "+clock(end)+" Uhr mit "+p+" Min. Pause. Verstoß gegen das JArbSchG?";
   ans=V(ok,"§ 11 Abs. 1 JArbSchG");e="Anwesenheit "+hm(work+p)+" − "+p+" Min. Pause = "+hm(work)+" Arbeitszeit → mindestens "+need+" Min. Pause nötig.";
   dis=[V(true,"§ 11 Abs. 1 JArbSchG"),V(false,"§ 11 Abs. 1 JArbSchG"),V(false,"§ 8 Abs. 1 JArbSchG"),V(true,"§ 8 Abs. 2a JArbSchG")];}
  else if(sit==="nacht"){k="ja-nacht";const end=pick([1140,1170,1200,1230,1260,1320]);const ok=end<=1200;
   q=name+" ("+age+") hilft in der Versicherungsagentur bei einem Kundenabend bis "+clock(end)+" Uhr. Verstoß gegen das JArbSchG?";
   ans=V(ok,"§ 14 Abs. 1 JArbSchG");e="Jugendliche dürfen grundsätzlich nur zwischen 6 und 20 Uhr beschäftigt werden. Eine Versicherungsagentur ist keine Ausnahme.";
   dis=[V(true,"§ 14 Abs. 1 JArbSchG"),V(false,"§ 14 Abs. 1 JArbSchG"),V(false,"§ 16 Abs. 1 JArbSchG"),V(true,"§ 8 Abs. 1 JArbSchG")];}
  else if(sit==="samstag"){k="ja-wochenende";const b=pick([["in der Versicherungsagentur",false],["in der Maschinenfabrik",false],["im Büro einer Bank",false],["in einer Bäckerei",true],["in einem Supermarkt",true],["in einem Krankenhaus",true]]);
   q=name+" ("+age+") soll samstags "+b[0]+" arbeiten. Was gilt?";
   ans=b[1]?"Erlaubt – aber ein anderer berufsschulfreier Tag der Woche muss frei sein":"Verstoß – § 16 Abs. 1 JArbSchG";
   e=b[1]?"Ausnahme nach § 16 Abs. 2 JArbSchG – Ausgleich durch einen anderen freien Tag (§ 16 Abs. 3).":"Jugendliche dürfen samstags nicht beschäftigt werden – diese Branche ist keine Ausnahme.";
   dis=["Verstoß – § 16 Abs. 1 JArbSchG","Erlaubt – aber ein anderer berufsschulfreier Tag der Woche muss frei sein","Erlaubt ohne Ausgleich","Verstoß – § 14 Abs. 1 JArbSchG"];}
  else{k="ja-zweck";const a=rnd(18,21);q=name+" ("+a+"), im 1. Ausbildungsjahr, arbeitet an allen 5 Tagen je 8,5 Std. Verstoß gegen das JArbSchG?";
   ans="Das JArbSchG gilt nicht – volljährig";e="Das JArbSchG gilt nur für Jugendliche unter 18.";
   dis=["Das JArbSchG gilt nicht – volljährig","Verstoß – § 8 Abs. 1 JArbSchG","Kein Verstoß – § 8 Abs. 2a JArbSchG","Verstoß – § 11 Abs. 1 JArbSchG"];}
  return {k,type:"mc",q,o:finishOpts(ans,dis.filter(x=>x!==ans)),a:0,e};}},
 azubikuend:{k:"pf-kuend-grund",label:"Azubi-Kündigung",make(){
  const name=pick(YOUNG);const age=rnd(16,20);
  const A1="Jederzeit ohne Frist, schriftlich",A2="Fristlos aus wichtigem Grund, schriftlich mit Grund",A3="Mit 4 Wochen Frist, schriftlich mit Grund",A4="Gar nicht – nur aus wichtigem Grund möglich";
  const s=pick([
   ["Im 2. Monat der Probezeit will der Betrieb "+name+" kündigen.",A1,"§ 22 Abs. 1 BBiG","pf-kuend-probe"],
   ["In der Probezeit merkt "+name+", dass der Beruf nicht passt, und will kündigen.",A1,"§ 22 Abs. 1 BBiG","pf-kuend-probe"],
   ["Nach der Probezeit stiehlt "+name+" Geld aus der Kasse. Der Betrieb will kündigen.",A2,"§ 22 Abs. 2 Nr. 1 BBiG","pf-kuend-grund"],
   ["Nach der Probezeit will "+name+" die Ausbildung aufgeben.",A3,"§ 22 Abs. 2 Nr. 2 BBiG","pf-kuend-azubi"],
   ["Nach der Probezeit will "+name+" lieber eine Ausbildung zur Erzieherin machen.",A3,"§ 22 Abs. 2 Nr. 2 BBiG","pf-kuend-azubi"],
   ["Nach der Probezeit will der Betrieb "+name+" kündigen, weil gerade wenig Arbeit da ist.",A4,"§ 22 Abs. 2 Nr. 1 BBiG","pf-kuend-grund"]]);
  return {k:s[3],type:"mc",q:s[0]+" ("+name+" ist "+age+".) Wie geht das?",o:finishOpts(s[1],[A1,A2,A3,A4].filter(x=>x!==s[1])),a:0,
   e:"Fundstelle: "+s[2]+"."+(age<18?" Da "+name+" minderjährig ist: "+(s[0].indexOf("Betrieb")>=0?"Die Kündigung muss gegenüber den Eltern ausgesprochen werden.":"Die Eltern müssen zustimmen."):""),p:s[2]};}},
 frist:{k:"ku-lang",label:"Kündigungsfrist",make(){
  const who=pick(["AG","AG","AN"]);const years=pick([1,2,4,5,7,8,10,12,15,20,25]);const name=pick(ADULT);const row=AGTAB.find(r=>years>=r[0]);
  const F=(r)=>r?r[1]+" Monat"+(r[1]>1?"e":"")+" zum Monatsende":"4 Wochen zum 15. oder Monatsende";
  const ans=who==="AG"?F(row):F(null);const k=who==="AG"&&row?"ku-lang":"ku-grundfrist";
  const dis=[F(null),F(AGTAB[6]),F(AGTAB[5]),F(AGTAB[4]),F(AGTAB[3]),F(AGTAB[2]),"2 Wochen"].filter(x=>x!==ans);
  return {k,type:"mc",q:(who==="AG"?"Der Arbeitgeber kündigt "+name.replace(/^Herr /,"Herrn "):name+" kündigt selbst")+". "+years+" Jahr"+(years>1?"e":"")+" im Betrieb, keine Vereinbarung. Welche Frist gilt?",o:finishOpts(ans,shuffle(dis)),a:0,
   e:who==="AN"?"Die Arbeitnehmerseite hat immer die Grundfrist – die längeren Fristen gelten nur, wenn der Arbeitgeber kündigt.":(row?years+" Jahre → "+F(row)+".":"Unter 2 Jahren → Grundfrist."),p:who==="AG"&&row?"§ 622 Abs. 2 BGB":"§ 622 Abs. 1 BGB"};}},
 kuendart:{k:"ku-gruende",label:"Kündigungsgrund",make(){
  const L=[["personenbedingt",["Ein Außendienstler verliert seinen Führerschein","Lang andauernde Arbeitsunfähigkeit","Häufige Kurzerkrankungen, die dem Betrieb nicht mehr zuzumuten sind","Die Arbeitserlaubnis fehlt","Fehlende körperliche Eignung für die Arbeit"]],
   ["verhaltensbedingt",["Wiederholte Unpünktlichkeit trotz Abmahnung","Arbeitsverweigerung","Beleidigung von Kollegen","Eigenmächtiger Urlaubsantritt","Unentschuldigtes Fehlen","Abwerbung anderer Arbeitnehmer","Krankmeldung wiederholt nicht abgegeben"]],
   ["betriebsbedingt",["Umsatzrückgang – Stelle fällt weg","Auftragsmangel","Die Filiale wird geschlossen","Eine Abteilung wird aufgelöst","Umstrukturierung des Betriebs","Änderung der Produktionsmethoden"]]];
  const g=pick(L);const ex=pick(g[1]);
  return {type:"mc",q:"„"+ex+"“ – welche Art von Kündigungsgrund ist das?",o:[g[0]].concat(L.filter(x=>x!==g).map(x=>x[0])),a:0,
   e:g[0]==="personenbedingt"?"Der Arbeitnehmer kann nichts dafür – es liegt an seiner Person (Gesundheit, Eignung, Erlaubnis).":g[0]==="verhaltensbedingt"?"Der Arbeitnehmer verstößt selbst gegen seine Pflichten – meist ist vorher eine Abmahnung nötig.":"Der Arbeitsplatz fällt aus betrieblichen Gründen weg – Sozialauswahl nötig.",p:"§ 1 Abs. 2 Satz 1 KSchG"};}},
 schutz:{k:"ku-schutzgruppen",label:"Kündigungsschutz",make(){
  const L=[["Eine Mitarbeiterin ist schwanger.","§ 17 MuSchG"],["Eine Mutter, 3 Monate nach der Entbindung.","§ 17 MuSchG"],["Ein Vater ist in Elternzeit.","§ 18 BEEG"],["Ein Mitarbeiter mit einem Grad der Behinderung von 60.","§ 168 SGB IX"],
   ["Ein Mitglied des Betriebsrats.","§ 15 KSchG"],["Ein Mitglied der Jugend- und Auszubildendenvertretung.","§ 15 KSchG"],["Eine Azubine nach der Probezeit.","§ 22 BBiG"],["Eine Mitarbeiterin, seit 25 Jahren im Betrieb.","Kein besonderer Schutz – nur längere Fristen (§ 622 Abs. 2 BGB)"]];
  const s=pick(L);const others=shuffle([...new Set(L.map(x=>x[1]).filter(x=>x!==s[1]))]);
  return {type:"mc",q:s[0]+" Welche Vorschrift schützt besonders vor einer Kündigung?",o:[s[1]].concat(others.slice(0,3)),a:0,
   e:"Kündigungsschutzgruppen: Schwangere (§ 17 MuSchG), Elternzeit (§ 18 BEEG), Schwerbehinderte (§ 168 SGB IX), Betriebsrat & JAV (§ 15 KSchG), Azubis (§ 22 BBiG)."};}},
 pflicht:{k:"av-ag-pfl",label:"Wessen Pflicht?",make(){
  const AG=["Vergütung zahlen","Urlaub gewähren","Arbeitssicherheit","Fürsorgepflicht","Zeugnispflicht","Arbeitsmittel stellen","Gleichbehandlung"];
  const AN=["Arbeitspflicht","Arbeitszeit einhalten","Krankheit rechtzeitig melden","Schweigepflicht","Sorgfaltspflicht","Treuepflicht","Wettbewerbsverbot"];
  const ag=Math.random()<.5;const x=pick(ag?AG:AN);
  return {k:ag?"av-ag-pfl":"av-an-pfl",type:"mc",q:"„"+x+"“ – wessen Pflicht ist das?",o:[ag?"Arbeitgeber":"Arbeitnehmer",ag?"Arbeitnehmer":"Arbeitgeber"],a:0,e:"Aus der Mindmap „Rechte und Pflichten aus einem Arbeitsvertrag“."};}}
};

/* ====================== Lernzettel ====================== */
// h = Überschrift, li = Stichpunkte, tab = Tabelle (1. Zeile = Kopf), warn = Fallen und Fehler in den Unterlagen
const NOTES = {
 duales: [
  {h:"Duales System", li:["Ausbildung an <b>zwei Lernorten</b>: Ausbildungsbetrieb (Praxis) und Berufsschule (Fachtheorie + Allgemeinbildung wie Deutsch, Politik, Religion, Sport).","Betrieb 3–4 Tage pro Woche, Berufsschule 8–12 Unterrichtsstunden pro Woche.","Abschluss: Prüfung bei der IHK + Zeugnis der Berufsschule."]},
  {h:"IHK = zuständige Stelle (§ 71 Abs. 2 BBiG)", li:["berät Betriebe und Azubis · prüft, ob ein Betrieb ausbilden darf","trägt die Verträge ins Verzeichnis ein · überwacht die Ausbildung","organisiert die Prüfungen · hilft bei Konflikten","Merksatz: Die IHK <b>überwacht, unterstützt und organisiert</b> die betriebliche Ausbildung."]},
  {h:"Ausbildungsordnung (§ 5 BBiG)", li:["Bezeichnung des Berufs · Dauer · Ausbildungsberufsbild (Kenntnisse, Fähigkeiten, Fertigkeiten) · Ausbildungsrahmenplan (sachliche + zeitliche Gliederung) · Prüfungsanforderungen"]},
  {h:"BBiG – was steht wo?", tab:[["Thema","Fundstelle"],["Ausbildungsvertrag","§§ 10, 11"],["Pflichten des Azubis","§ 13"],["Pflichten des Betriebs","§ 14"],["Freistellung, Anrechnung Schulzeit","§ 15"],["Vergütung","§§ 17–19"],["Probezeit","§ 20"],["Ende","§ 21"],["Kündigung","§ 22"],["Prüfungen","§§ 37–38"]]},
  {h:"Marion – Lösungen aus dem Arbeitsblatt", tab:[["Frage","Antwort","Fundstelle"],["Wann entstanden?","mit der Zusage (05.07.)",""],["Vertrag","festhalten; unterschreiben: Ausbildende, Azubi, gesetzlicher Vertreter","§ 11"],["Probezeit","mind. 1, höchstens 4 Monate","§ 20 Satz 2"],["Zweck Probezeit","Betrieb prüft Eignung, Azubi prüft Neigung",""],["Krank in der Probezeit","mehr als ⅓ unterbrochen → um diesen Zeitraum verlängern",""],["Verkürzung","gemeinsamer Antrag, IHK entscheidet","§ 8 Abs. 1"],["Ende","wenn das Bestehen mitgeteilt wird","§ 21 Abs. 2"]]},
  {h:"Anita prüft nach – Fehler im Vertrag", li:["Beruf heißt Kauffrau für Versicherungen und <b>Finanzanlagen</b>","36 Monate ab 01.09.2022 → Ende <b>31.08.2025</b>","Probezeit 6 Monate → höchstens 4","Vergütung 500 € in allen Jahren → muss jährlich steigen (§ 17 Abs. 1)","Unterschriften fehlen · „männlich“ angekreuzt"]},
  {warn:["§ 11 BBiG: Seit 01.08.2024 genügt laut Gesetz die <b>Textform</b>. Euer Arbeitsblatt nennt noch „schriftlich + Unterschriften“ – schau in deiner Gesetzessammlung nach.","„Notendurchschnitt besser als 2,5“ (Mitschrift) ist eine IHK-Richtlinie, nicht das Gesetz.","6 Monate Probezeit gibt es nur im Arbeitsvertrag (§ 622 Abs. 3 BGB) – in der Ausbildung höchstens 4."]}
 ],
 pflichten: [
  {h:"Pflichten des Azubis (§ 13 Satz 2 BBiG)", tab:[["Nr.","Pflicht"],["1","Aufgaben sorgfältig ausführen"],["2","an Ausbildungsmaßnahmen teilnehmen"],["3","Weisungen befolgen"],["4","Ordnung beachten"],["5","Werkzeug und Einrichtungen pfleglich behandeln"],["6","Betriebs- und Geschäftsgeheimnisse wahren"],["7","Ausbildungsnachweis führen"]]},
  {h:"Pflichten des Betriebs (§ 14 BBiG)", li:["Abs. 1 Nr. 2: selbst ausbilden oder einen Ausbilder beauftragen (Marion: Ausbildende = Herr Nadler/Frau Gundlach, Ausbilderin = Frau Wertmann)","Abs. 1 Nr. 3: Ausbildungsmittel <b>kostenlos</b>","Abs. 2 Satz 2: Berichtsheft am Arbeitsplatz führen lassen","Abs. 3: nur Aufgaben, die dem <b>Ausbildungszweck</b> dienen"]},
  {h:"Marion – Lösungen", li:["Computer entstauben: <b>ja</b> – Arbeitsmittel pfleglich behandeln (§ 13 Satz 2 Nr. 5)","Kunden im Beratungsgespräch Kaffee reichen: <b>ja</b> – Service am Kunden (§ 14 Abs. 3)","Berichtsheft: Klarheit und Wahrheit – Dokument, Nachweis + Absicherung bei Durchfallen","Ohne Berichtsheft: keine Zulassung zur Prüfung (§ 43 Abs. 1 Nr. 2); nachreichen → nächster Prüfungsdurchgang"]},
  {h:"Kündigung während der Ausbildung (§ 22 BBiG)", tab:[["Situation","Regel","Fundstelle"],["Probezeit","jederzeit, beide Seiten, ohne Frist, schriftlich","Abs. 1"],["nach Probezeit – wichtiger Grund","fristlos, schriftlich","Abs. 2 Nr. 1"],["nach Probezeit – Azubi gibt auf / anderer Beruf","4 Wochen Frist, schriftlich mit Grund","Abs. 2 Nr. 2"],["Form","schriftlich, nach der Probezeit mit Gründen","Abs. 3"]]},
  {h:"Minderjährige Azubis", li:["Azubi kündigt → Zustimmung des gesetzlichen Vertreters nötig.","Betrieb kündigt → Kündigung gegenüber dem gesetzlichen Vertreter."]},
  {warn:["Arbeitsblatt: „Zu 1. schriftlich und fristlos“ – laut § 22 Abs. 3 BBiG müssen nach der Probezeit auch hier die Gründe angegeben werden."]}
 ],
 jarbschg: [
  {h:"Jugendarbeitsschutz – für Jugendliche unter 18", tab:[["Thema","Regel","Fundstelle"],["Arbeitszeit","8 Std. täglich, 40 Std. wöchentlich","§ 8 Abs. 1"],["8,5 Std.","nur wenn andere Tage derselben Woche kürzer sind","§ 8 Abs. 2a"],["Arbeitstage","grundsätzlich 5 pro Woche","§ 15"],["Pausen","> 4,5–6 Std.: 30 Min.; > 6 Std.: 60 Min.; ab 15 Min.; max. 4,5 Std. am Stück; im Voraus festgelegt","§ 11"],["Nachtruhe","nur 6–20 Uhr (Ausnahmen, z. B. Gastronomie, Mehrschichtbetrieb)","§ 14"],["Wochenende","Samstag, Sonntag, Feiertag frei; Ausnahmen → anderer Tag frei","§§ 16–18"],["Gefährliche Arbeiten","verboten, z. B. über die Leistungsfähigkeit","§ 22 Abs. 1 Nr. 1"],["Erstuntersuchung","vor Beginn – gesundheitlich geeignet?","§ 32"],["Nachuntersuchung","1 Jahr nach Beginn","§ 33 Abs. 1"]]},
  {h:"Anita (17) – Lösungen aus der Mitschrift", tab:[["Fall","Ergebnis"],["täglich 9 Std.","Verstoß – § 8 Abs. 1"],["7:30–16:00 Uhr, 45 Min. Pause","Verstoß – mehr als 6 Std. Arbeit → 60 Min. (§ 11 Abs. 1)"],["Samstagsarbeit","Verstoß – § 16 Abs. 1"],["Inventur bis 23 Uhr","grundsätzlich Verstoß (§ 14 Abs. 1) – nur im Mehrschichtbetrieb erlaubt (§ 14 Abs. 2)"],["schwere Pakete schleppen","Verstoß – § 22 Abs. 1 Nr. 1"]]},
  {warn:["Pausenfall Anita: In der Mitschrift steht „arbeitet 8,5 h“ – das ist die Anwesenheit. Arbeitszeit = 8,5 Std. − 45 Min. = 7 Std. 45 Min. Der Verstoß bleibt.","Genau 4,5 Std. → keine Pause; genau 6 Std. → 30 Min.","Die 5-Tage-Woche steht im Gesetz in § 15 (im Lernzettel der Klasse bei § 8)."]}
 ],
 schule: [
  {h:"Freistellung (§ 15 BBiG, für Jugendliche zusätzlich § 9 JArbSchG)", li:["Für den Unterricht freistellen – Vergütung läuft weiter, egal wie viel Arbeit im Betrieb ist.","Gilt auch für <b>virtuellen Unterricht</b> (Videokonferenz).","Unterricht fällt aus → zurück in den Betrieb.","Prüfungen und der Arbeitstag vor der schriftlichen Abschlussprüfung: frei (§ 15 Abs. 1 Satz 2 Nr. 5 BBiG)."]},
  {h:"Wenn der Betrieb nicht freistellt", li:["Ordnungswidrigkeit: bis 5.000 € (§ 101 Abs. 1 Nr. 4 BBiG), bei Minderjährigen bis 15.000 € (§ 58 Abs. 5 Nr. 6 JArbSchG).","Wiederholung: IHK kann die Ausbildungsbefugnis entziehen (§ 33 BBiG).","Azubi darf „eigenmächtig“ zur Schule – keine Abmahnung, Kündigung oder Urlaubsabzug."]},
  {h:"Anrechnung (für Jugendliche und Erwachsene gleich)", tab:[["Fall","Was zählt","Fundstelle"],["normaler Schultag","Unterricht + Pausen + notwendige Wegezeit Schule → Betrieb","§ 15 Abs. 2 Nr. 1 BBiG / § 9 Abs. 2 Nr. 3 JArbSchG"],["mehr als 5 Unterrichtsstunden à 45 Min. (1× pro Woche)","durchschnittliche tägliche Arbeitszeit","§ 15 Abs. 2 Nr. 2 BBiG / § 9 Abs. 2 Nr. 1 JArbSchG"],["zwei lange Tage","an einem zurück in den Betrieb – der Betrieb bestimmt",""],["Prüfung","auch Fahrtzeit Prüfungsort ↔ Betrieb",""]]},
  {h:"Rechnen", li:["Arbeitstag: Arbeitsende − Arbeitsbeginn − Pausen.","Schultag: Unterricht + Pausen + Wegezeit + betriebliche Arbeitszeit danach."]},
  {warn:["Wegezeit Schule → Betrieb immer mitzählen. Linda: Dienstag 8,5 Std. → Woche <b>38 Std.</b> (Mitschrift: 37,5). Petra: Mittwoch 9 Std. 30 Min. → Woche <b>41 Std. 30 Min.</b> (Mitschrift: 40 Std. 45 Min.).","Genau 5 Unterrichtsstunden sind <b>nicht</b> „mehr als 5“.","Der Weg von zu Hause zur Schule zählt nicht."]}
 ],
 vertrag: [
  {h:"Arbeitsvertrag (§ 611a BGB)", li:["AN leistet die vereinbarte Arbeit, AG zahlt die vereinbarte Vergütung.","Formen: schriftlich, mündlich, konkludent (schlüssiges Verhalten).","Vertragsfreiheit – begrenzt durch Gesetze (ArbZG, MiLoG, BUrlG, KSchG), Tarifverträge und Betriebsvereinbarungen.","Nachweisgesetz: Der AG hält die wesentlichen Bedingungen fest – Parteien, Beginn, Ort, Tätigkeit, Arbeitszeit, Vergütung, Urlaub, Kündigungsfristen."]},
  {h:"Pflichten (Mindmap)", tab:[["Arbeitgeber","Arbeitnehmer"],["Vergütung zahlen","Arbeitspflicht"],["Urlaub gewähren","Arbeitszeit einhalten"],["Arbeitssicherheit","Krankheit rechtzeitig melden"],["Fürsorgepflicht","Schweigepflicht"],["Arbeitsmittel","Sorgfaltspflicht"],["Zeugnispflicht (§ 109 GewO)","Treuepflicht"],["Gleichbehandlung","Wettbewerbsverbot (§ 60 HGB)"]]},
  {h:"Fälle aus dem Unterricht", tab:[["Fall","Ergebnis"],["Bertram: Baustelle 20 km entfernt","zumutbar – kein fester Arbeitsplatz (Weisungsrecht, § 106 GewO)"],["Cornelius: Gewinne in der Sauna erzählt","Verstoß gegen die Schweigepflicht"],["Wehrmann: soll Eingang fegen","Gehorsamspflicht (Mitschrift)"],["Kuno: Chef verschläft, schickt heim","Lohn – § 615 Satz 1 BGB"],["Hansen: 10 Jahre Weihnachtsgeld","betriebliche Übung → Anspruch"]]},
  {warn:["Betriebliche Übung: In der Mitschrift steht „mehr als 3x“ – nach der Rechtsprechung reicht <b>dreimal</b> vorbehaltlos.","Mitschrift: „durch eine geänderte betriebliche Übung kann diese wieder aufgehoben werden“ – das gilt so nicht mehr. Der Arbeitgeber kann sie nur durch Vertragsänderung oder Kündigung beseitigen.","Arbeitsgericht kommt laut Themenliste nicht dran."]}
 ],
 kuendigung: [
  {h:"Grundlagen", li:["Ende durch Kündigung, Aufhebungsvertrag, Ablauf der Befristung (max. 2 Jahre) oder Erreichen des Zwecks.","Kündigung = einseitige, empfangsbedürftige Willenserklärung → wirksam mit <b>Zugang</b>.","Form: schriftlich, eigenhändig unterschrieben – keine E-Mail, kein Fax, kein WhatsApp (§ 623 BGB).","Inhalt: klar und eindeutig – Unklarheiten gehen zu Lasten des Kündigenden.","Betriebsrat vor jeder Kündigung anhören, sonst unwirksam (§ 102 BetrVG): ordentlich 1 Woche, außerordentlich 3 Tage."]},
  {h:"Zugang", li:["Anwesend: sobald er sie vernehmen kann und versteht.","Briefkasten: wenn unter normalen Umständen Kenntnis möglich ist – abends eingeworfen → nächster Tag.","Einschreiben: erst mit Aushändigung durch die Post.","Absichtliche Verzögerung und Urlaub verhindern den Zugang nicht.","Beweis: Empfang quittieren lassen oder Bote + Zeuge."]},
  {h:"Fristen (§ 622 BGB)", tab:[["Fall","Frist"],["Arbeitnehmer kündigt / Arbeitgeber unter 2 Jahren","4 Wochen (28 Tage) zum 15. oder Monatsende (Abs. 1)"],["Arbeitgeber ab 2/5/8/10/12/15/20 Jahren","1/2/3/4/5/6/7 Monate zum Monatsende (Abs. 2)"],["Probezeit (max. 6 Monate)","2 Wochen, zu jedem Tag (Abs. 3)"],["fristlos (§ 626)","wichtiger Grund; innerhalb 2 Wochen ab Kenntnis; Gründe auf Verlangen"]]},
  {h:"Abmahnung", li:["Offizielle Warnung wegen eines Pflichtverstoßes.","3 Funktionen: <b>Rüge</b> (Fehlverhalten benennen) – <b>Aufforderung</b> (künftig vertragsgemäß) – <b>Warnung</b> (Konsequenzen androhen).","Inhalt: Datum, Aufforderung, Androhung von Folgen, ggf. Urkunden/Zeugen; gegenzeichnen lassen.","Vor einer verhaltensbedingten Kündigung nötig (Anna Schäfer!) – bei schweren Verstößen wie Diebstahl entbehrlich."]},
  {h:"Kündigungsschutzgesetz", tab:[["Punkt","Regel","Fundstelle"],["Wartezeit","länger als 6 Monate","§ 1 Abs. 1"],["Betriebsgröße","mehr als 10 AN; Teilzeit bis 20 Std. = 0,5, bis 30 Std. = 0,75; Azubis zählen nicht","§ 23 Abs. 1"],["Gründe","personen-, verhaltens- oder betriebsbedingt","§ 1 Abs. 2"],["Sozialauswahl","Betriebszugehörigkeit, Lebensalter, Unterhaltspflichten, Schwerbehinderung","§ 1 Abs. 3"],["Klage","innerhalb von 3 Wochen nach Zugang","§ 4"],["Abfindung","betriebsbedingt + Hinweis + keine Klage: 0,5 Monatsgehälter je Jahr","§ 1a"]]},
  {h:"Kündigungsschutzgruppen", tab:[["Gruppe","Fundstelle"],["Azubis","§ 22 BBiG"],["Betriebsrat (ordentlich ausgeschlossen, außerordentlich nur mit Zustimmung)","§ 15 KSchG, § 103 BetrVG"],["JAV (Amtszeit + 1 Jahr)","§ 15 KSchG"],["Schwangere bis 4 Monate nach Entbindung","§ 17 MuSchG"],["Elternzeit","§ 18 BEEG"],["Schwerbehinderte (GdB ab 50, Integrationsamt)","§ 168 SGB IX"],["Langjährig Beschäftigte: nur längere Fristen","§ 622 Abs. 2 BGB"]]},
  {warn:["§ 622 Abs. 2 gilt nur, wenn der <b>Arbeitgeber</b> kündigt.","Euer Infoblatt sagt „schriftliche Abmahnung“ – laut Lernzettel muss sie nicht zwingend schriftlich sein (schriftlich ist zum Beweis sinnvoll).","Lernzettel der Klasse: JAV „§ 78a BetrVG“ – § 78a regelt die Übernahme nach der Ausbildung. Für den Kündigungsschutz: § 15 KSchG."]}
 ]
};

/* ====================== Blätter, Probeklausuren, Lernplan ====================== */
const SHEETS = [
 {id:"uebung1", title:"Übungsblätter Teil 1", sub:"6 Blätter · alle Themen · 7 Seiten"},
 {id:"uebung2", title:"Übungsblätter Teil 2", sub:"neue Fälle zu allen Themen · 3 Seiten"},
 {id:"ergaenzung", title:"Ergänzungsblatt", sub:"Kündigungsschutzgruppen, Abfindung, Betriebsrat, Abmahnung"}
];
const EXAMS = [
 {id:"probetest", title:"Probetest", level:"leicht", minutes:20, parts:[6,6,5,6,2]},
 {id:"klausur-a", title:"Probeklausur A", level:"mittel", minutes:60, parts:[5,8,8,8,6,6,9]},
 {id:"klausur-b", title:"Probeklausur B", level:"schwer", minutes:60, parts:[9,8,10,22,7,4], note:"Aufgabe 5 (Arbeitsgericht) kommt laut Themenliste nicht dran – lass sie aus."}
];
const PLAN = ["uebung1","uebung2","ergaenzung","probetest","klausur-a","klausur-b"];

window.SUBJECTS = window.SUBJECTS || {};
window.SUBJECTS.lf1 = {
  id: "lf1", short: "LF1", name: "Arbeits- und Ausbildungsrecht",
  topics: TOPICS, concepts: CONCEPTS, topicOf, questions: Q, cards: CARDS, pairs: DATA.PAIRS, gens: GENS,
  notes: NOTES, sheets: SHEETS, exams: EXAMS, plan: PLAN
};
})();
