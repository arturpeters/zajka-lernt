/**
 * app.js – Oberfläche von „Zajka lernt“ (Version 3).
 * Bereiche: Start · Üben (Quiz, Lernkarten, Spiele) · Lernen (Lernzettel, Blätter) · Klausuren.
 *
 * Fortschritt: Jede Frage gehört zu einem Lernpunkt. Ein Lernpunkt ist
 *   0 = neu · 0,5 = halb · 1 = sitzt.
 *   Richtig → sitzt. Halb → mindestens halb. Falsch → nur EINE halbe Stufe zurück.
 * Prozent = Anteil der Lernpunkte, die sitzen. So ist 100 % mit ~75 richtigen Antworten erreichbar.
 */
(function () {
  'use strict';
  const Z = window.ZStore;
  const SUBJECTS = window.SUBJECTS || {};
  const app = document.getElementById('app');
  const tabs = document.getElementById('tabs');
  let st = Z.load();
  let view = 'start';
  let sess = null;

  /* ---------- Hilfen ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const sub = () => SUBJECTS[st.settings.subject] || SUBJECTS[Object.keys(SUBJECTS)[0]];
  const prog = () => Z.subject(sub().id);
  function parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); }
  function dayDiff(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 864e5); }
  function addDays(s, n) { const d = parseDate(s); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  function nice(s) { const d = parseDate(s); return WD[d.getDay()] + ' ' + String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.'; }
  function toast(t, big) { const e = document.createElement('div'); e.className = 'toast' + (big ? ' big' : ''); e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), big ? 2600 : 2100); }
  function after(fn) { requestAnimationFrame(() => requestAnimationFrame(fn)); }
  function applyBars() { app.querySelectorAll('[data-w]').forEach((i) => { i.style.width = i.dataset.w + '%'; }); }
  function greet() { const h = new Date().getHours(); return h < 11 ? 'Guten Morgen, Zajka' : h < 18 ? 'Hallo Zajka' : 'Guten Abend, Zajka'; }
  function setFocus(on) { document.body.classList.toggle('focus', on); }
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Fragen & Lernpunkte ---------- */
  function qById(id) { return sub().questions.find((q) => q.id === id); }
  function conceptsOf(topic) { const s = sub(); return Object.keys(s.concepts).filter((k) => !topic || s.topicOf(k) === topic); }
  function cState(k) { return prog().k[k] || 0; }
  function pct(topic) { const ks = conceptsOf(topic); if (!ks.length) return 0; let sum = 0; ks.forEach((k) => { sum += cState(k); }); return Math.round(sum / ks.length * 100); }
  function solidCount(topic) { return conceptsOf(topic).filter((k) => cState(k) === 1).length; }
  function medal(p) { return p >= 100 ? 'gold' : p >= 70 ? 'silber' : p >= 40 ? 'bronze' : ''; }
  const MEDAL = { gold: 'Gold', silber: 'Silber', bronze: 'Bronze' };
  function snapshot() { const o = { all: pct() }; sub().topics.forEach((t) => { o[t.id] = pct(t.id); }); return o; }

  /** Alten Fortschritt (Version 1/2: Boxen pro Frage) einmalig umrechnen. */
  function migrate() {
    const s = sub(), p = prog(); let changed = false;
    Object.keys(p.q).forEach((id) => {
      const r = p.q[id];
      if (r && r.b !== undefined) {
        const q = s.questions.find((x) => x.id === id);
        if (q && r.b >= 1 && r.c > 0) p.k[q.k] = 1;
        if (q) p.q[id] = { n: (r.c || 0) + (r.w || 0), g: r.b >= 1 ? 1 : 0, l: r.l || 0 };
        else delete p.q[id];
        changed = true;
      }
    });
    if (changed) Z.save();
  }

  /** Bewertung: g = 1 (richtig), 0.5 (halb), 0 (falsch). */
  function grade(id, k, g) {
    const p = prog();
    if (k) {
      const cur = p.k[k] || 0;
      p.k[k] = g === 1 ? 1 : g === 0.5 ? (cur === 1 ? 1 : 0.5) : (cur === 1 ? 0.5 : 0);
    }
    if (id) { const r = p.q[id] || (p.q[id] = { n: 0, g: 0, l: 0 }); r.n++; r.g = g; r.l = Date.now(); }
    st.xp += g === 1 ? 10 : g === 0.5 ? 5 : 2;
    const t = Z.today(); st.days[t] = (st.days[t] || 0) + 1;
    Z.save();
  }
  function weakIds() {
    const s = sub(), p = prog();
    return Object.keys(p.q).filter((id) => p.q[id].n > 0 && p.q[id].g < 1 && s.questions.some((q) => q.id === id));
  }
  function genIds(topic) { const s = sub(); return Object.keys(s.gens).filter((g) => !topic || s.topicOf(s.gens[g].k) === topic).map((g) => 'g:' + g); }
  function itemConcept(id) { const s = sub(); return id.startsWith('g:') ? s.gens[id.slice(2)].k : (qById(id) || {}).k; }
  function weight(id) {
    const p = prog(), k = itemConcept(id), c = p.k[k] || 0;
    let w = c === 1 ? 1 : c === 0.5 ? 3.5 : 5;
    if (id.startsWith('g:')) return w * 0.9;
    const r = p.q[id];
    if (!r) w *= 1.6; else if (r.g < 1) w *= 1.4;
    return w;
  }
  /** Zufällig, aber gewichtet: neue/schwache Lernpunkte zuerst, möglichst verschiedene Lernpunkte pro Runde. */
  function sample(ids, n) {
    const pool = ids.slice(), out = [], usedK = {};
    while (out.length < n && pool.length) {
      let tot = 0; const ws = pool.map((id) => { let w = weight(id); if (usedK[itemConcept(id)]) w *= 0.12; tot += w; return w; });
      let x = Math.random() * tot, i = 0;
      for (; i < pool.length; i++) { x -= ws[i]; if (x <= 0) break; }
      const id = pool.splice(Math.min(i, pool.length - 1), 1)[0];
      out.push(id); usedK[itemConcept(id)] = 1;
    }
    return out;
  }

  /* ---------- Serie, Level, Abzeichen ---------- */
  const LEVELS = [[0, 'Neuling'], [120, 'Lernstarterin'], [300, 'Fleißbiene'], [550, 'Paragraphen-Kennerin'], [900, 'Fristen-Füchsin'], [1300, 'Kündigungs-Checkerin'], [1800, 'Azubi-Profi'], [2400, 'Prüfungsreif'], [3100, 'Arbeitsrecht-Ass'], [4000, 'LF1-Queen']];
  function level(xp) { let i = 0; while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][0]) i++; const next = LEVELS[i + 1]; return { n: i + 1, name: LEVELS[i][1], from: LEVELS[i][0], to: next ? next[0] : null }; }
  const BADGES = [
    ['erste', 'Erste Runde', 'eine Übungsrunde beendet'], ['ziel', 'Tagesziel', 'Tagesziel geschafft'], ['tage3', '3 Tage', '3 Tage in Folge gelernt'],
    ['tage7', '7 Tage', '7 Tage in Folge gelernt'], ['serie5', 'Serie 5', '5 richtig hintereinander'], ['serie10', 'Serie 10', '10 richtig hintereinander'],
    ['gold1', 'Erstes Gold', 'ein Thema zu 100 %'], ['gold6', 'Alles Gold', 'alle Themen zu 100 %'], ['halb', 'Halbzeit', '50 % aller Lernpunkte'],
    ['blitz15', 'Blitz 15', '15 Punkte in der Blitzrunde'], ['memory', 'Memory-Profi', 'Memory in höchstens 9 Zügen'], ['hundert', '100 Antworten', '100 Fragen beantwortet']
  ];
  function earn(id) {
    st.badges = st.badges || {};
    if (st.badges[id]) return false;
    st.badges[id] = Z.today(); Z.save();
    const b = BADGES.find((x) => x[0] === id);
    if (b) setTimeout(() => { toast('Abzeichen: ' + b[1] + '!', true); confetti(); }, 600);
    return true;
  }
  function checkBadges() {
    const goal = st.settings.dailyGoal || 20;
    if ((st.days[Z.today()] || 0) >= goal) earn('ziel');
    const s = streak(); if (s >= 3) earn('tage3'); if (s >= 7) earn('tage7');
    const tops = sub().topics.map((t) => pct(t.id));
    if (tops.some((x) => x >= 100)) earn('gold1'); if (tops.every((x) => x >= 100)) earn('gold6');
    if (pct() >= 50) earn('halb');
    const total = Object.values(st.days).reduce((a, b) => a + b, 0); if (total >= 100) earn('hundert');
  }
  function streak() {
    let n = 0; let d = Z.today();
    if (!st.days[d]) d = addDays(d, -1);
    while (st.days[d]) { n++; d = addDays(d, -1); }
    return n;
  }
  function weakestTopic() {
    const s = sub(); let best = null, val = 101;
    s.topics.forEach((t) => { const m = pct(t.id); if (m < val) { val = m; best = t; } });
    return val >= 100 ? null : best;
  }

  /* ---------- Termine & Lernplan ---------- */
  function nextExam() {
    const t = Z.today();
    return (st.settings.klausuren || []).filter((k) => k.subject === sub().id && k.date >= t).sort((a, b) => a.date.localeCompare(b.date))[0] || null;
  }
  function isDone(id) { const p = prog(); return !!(p.sheetsDone[id] || (p.exams[id] && p.exams[id].length)); }
  function planItem(id) {
    const s = sub();
    const sh = s.sheets.find((x) => x.id === id); if (sh) return { id, title: sh.title, href: 'blaetter/' + id + '.html' };
    const ex = s.exams.find((x) => x.id === id); if (ex) return { id, title: ex.title + ' (' + ex.minutes + ' Min.)', href: '#klausuren' };
    return { id, title: id, href: '#lernen' };
  }
  function buildPlan() {
    const s = sub(), t = Z.today(), ex = nextExam();
    const remaining = s.plan.filter((id) => !isDone(id));
    if (!ex) return { ex: null, days: [{ date: t, items: remaining.slice(0, 1), review: false }] };
    const left = dayDiff(t, ex.date);
    if (left <= 0) return { ex, left, days: [] };
    const avail = left >= 2 ? left - 1 : left;
    const per = remaining.length ? Math.ceil(remaining.length / avail) : 0;
    const days = [];
    for (let i = 0; i < left; i++) {
      const review = left >= 2 && i === left - 1;
      days.push({ date: addDays(t, i), items: review ? [] : remaining.slice(i * per, (i + 1) * per), review });
    }
    return { ex, left, days };
  }

  /* ---------- Kopf ---------- */
  function top(back) {
    const s = sub();
    return '<div class="top"><div class="brand">' +
      (back ? '<button class="iconbtn" data-act="back" aria-label="Zurück">←</button>' : '<div class="seal">§</div>') +
      '<div><h1>' + (back ? esc(back) : 'Zajka lernt') + '</h1><small>' + esc(s.short + ' · ' + s.name) + '</small></div></div>' +
      '<button class="iconbtn" data-act="settings" aria-label="Einstellungen">⚙︎</button></div>';
  }
  function setTab(name) { tabs.querySelectorAll('a').forEach((a) => a.classList.toggle('on', a.dataset.tab === name)); }
  function topicBars() {
    return '<div class="tbars">' + sub().topics.map((t) => { const p = pct(t.id), m = medal(p);
      return '<button class="tbar" data-act="topic" data-t="' + t.id + '"><span class="tname">' + esc(t.short) + '</span><span class="bar"><i data-w="' + p + '"></i></span><span class="tp">' + p + '%</span><span class="medal ' + (m || 'none') + '" title="' + (m ? MEDAL[m] : 'noch keine Medaille') + '">●</span></button>'; }).join('') + '</div>';
  }

  /* ---------- Was ist neu (einmal nach jedem Update) ---------- */
  const APP_VERSION = '3.1';
  const WHATSNEW = [
    ['Schreibfelder', 'In allen Übungsblättern und Probeklausuren direkt mit der Handytastatur schreiben – kein Papier nötig. Alles bleibt gespeichert.'],
    ['Lösung vergleichen', 'Unter jeder Aufgabe: Knopf antippen, die Lösung erscheint direkt unter deiner Antwort.'],
    ['Paragraphen antippen', 'Fundstellen-Fragen haben wieder vier Paragraphen zur Auswahl. In den Blättern gibt es Bausteine wie §, Abs., BBiG zum Antippen.'],
    ['Klausurthemen', 'Unter „Klausuren“ steht die Themenliste deiner Lehrerin – mit Fortschritt und „Üben“ pro Thema.'],
    ['Lernkarten', 'Neues Feld für deine eigene Erklärung, bevor du umdrehst.']
  ];
  function whatsNewCard() {
    return '<div class="card newcard"><span class="chip">Update installiert · Version ' + APP_VERSION + '</span><h2>Das ist neu</h2><ul>' +
      WHATSNEW.map((w) => '<li><b>' + esc(w[0]) + ':</b> ' + esc(w[1]) + '</li>').join('') + '</ul><button class="btn small" data-act="seennew">Alles klar</button></div>';
  }
  function showWhatsNew() {
    if (st.settings.seenVersion === APP_VERSION) return false;
    const used = st.xp > 0 || Object.keys(st.days).length > 0;
    if (!used) { st.settings.seenVersion = APP_VERSION; Z.save(); return false; }
    return true;
  }

  /* ---------- Start ---------- */
  function renderStart() {
    view = 'start'; setFocus(false); setTab('start'); checkBadges();
    const plan = buildPlan(), ex = plan.ex;
    const goal = st.settings.dailyGoal || 20, todayN = st.days[Z.today()] || 0;
    const C = 2 * Math.PI * 38, frac = Math.min(1, todayN / goal);
    const lv = level(st.xp), all = pct(), solid = solidCount(), totalK = conceptsOf().length;
    let h = top(false) + '<div class="screen">';
    if (isIOS() && !isStandalone() && !st.settings.installHintHidden) {
      h += '<div class="install"><b>Als App auf den Home-Bildschirm</b>In Safari unten auf <b>Teilen</b> (□↑) tippen → <b>„Zum Home-Bildschirm“</b>. Dann startet die App wie eine richtige App und funktioniert auch offline.<div class="row"><button class="btn small ghost" data-act="hideinstall">Verstanden</button></div></div>';
    }
    if (showWhatsNew()) h += whatsNewCard();
    if (!st.settings.guideSeen) {
      h += '<div class="install guidecard"><a href="#anleitung" class="grow"><b>Neu hier? So funktioniert die App →</b>Kurze Schritte mit Bildern.</a><button class="iconbtn small" data-act="hideguide" aria-label="Ausblenden">✕</button></div>';
    }
    if (ex) {
      const left = dayDiff(Z.today(), ex.date);
      h += '<div class="card count"><div class="days">' + (left === 0 ? '!' : left) + '<small>' + (left === 0 ? 'heute' : left === 1 ? 'Tag' : 'Tage') + '</small></div><div class="grow"><h2>' +
        esc(ex.title) + '</h2><p>' + (left === 0 ? 'Heute ist Klausur – du schaffst das! Gesetzessammlung nicht vergessen.' : nice(ex.date) + ' · noch ' + left + (left === 1 ? ' Tag' : ' Tage')) + '</p></div></div>';
    } else {
      h += '<button class="card count empty" data-act="settings"><div class="days">?</div><div class="grow"><h2>Klausurtermin eintragen</h2><p class="note">Dann zählt die App die Tage runter und plant, was du wann lernst.</p></div></button>';
    }
    h += '<div class="card prog"><div class="row"><div class="bigpct">' + all + '<span>%</span></div><div class="grow"><h2>Dein Fortschritt</h2><p class="note">' + solid + ' von ' + totalK + ' Lernpunkten sitzen' + (all >= 100 ? ' – alles drin!' : '') + '</p></div></div>' + topicBars() + '</div>';
    h += '<div class="card"><div class="row"><div class="ring"><svg width="92" height="92"><circle class="track" cx="46" cy="46" r="38" fill="none" stroke-width="9"/><circle class="val' + (frac ? '' : ' zero') + '" id="ringv" cx="46" cy="46" r="38" fill="none" stroke-width="9" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg><b>' + todayN + '<span>von ' + goal + '</span></b></div>' +
      '<div class="grow"><h2>' + greet() + '</h2><p class="note">' + (todayN >= goal ? 'Tagesziel geschafft – stark!' : 'Heute noch ' + (goal - todayN) + ' Fragen bis zum Tagesziel.') + '</p></div></div>';
    const today = plan.days[0];
    h += '<div class="todo">';
    h += '<a href="#" data-act="quick" class="' + (todayN >= goal ? 'ok' : '') + '"><span class="ck">' + (todayN >= goal ? '✓' : '') + '</span>Schnelltraining (10 Fragen)<span class="go">→</span></a>';
    if (ex && plan.left === 0) {
      h += '<div><span class="ck"></span>Nur noch Lernkarten und Lernzettel überfliegen – kein neuer Stoff.</div>';
    } else if (today) {
      if (today.review) h += '<a href="#" data-act="weak"><span class="ck"></span>Wiederholen: Fehler + Lernkarten<span class="go">→</span></a>';
      today.items.forEach((id) => { const it = planItem(id); h += '<a href="' + it.href + '"><span class="ck"></span>' + esc(it.title) + '<span class="go">→</span></a>'; });
    }
    const wt = weakestTopic();
    if (wt) h += '<a href="#" data-act="topic" data-t="' + wt.id + '"><span class="ck"></span>Als Nächstes: ' + esc(wt.short) + ' (' + pct(wt.id) + ' %)<span class="go">→</span></a>';
    h += '</div></div>';
    if (ex && plan.days.length > 1) {
      h += '<div class="card"><h2>Plan bis zur Klausur</h2><div class="timeline">';
      plan.days.slice(1, 7).forEach((d) => {
        const txt = d.review ? 'Wiederholen: Fehler, Lernkarten, Lernzettel' : d.items.length ? d.items.map((id) => planItem(id).title).join(' · ') : 'Quiz + Lernkarten';
        h += '<div class="tl"><b>' + nice(d.date) + '</b><span>' + esc(txt) + '</span></div>';
      });
      h += '</div></div>';
    }
    const lvp = lv.to ? Math.round((st.xp - lv.from) / (lv.to - lv.from) * 100) : 100;
    h += '<div class="card"><div class="row"><div class="lvl">' + lv.n + '</div><div class="grow"><b>' + esc(lv.name) + '</b><div class="bar"><i data-w="' + lvp + '"></i></div><span class="note">' + st.xp + ' Punkte' + (lv.to ? ' · noch ' + (lv.to - st.xp) + ' bis Level ' + (lv.n + 1) : '') + '</span></div><div class="flame"><b>' + streak() + '</b><span>Tage<br>in Folge</span></div></div>';
    const got = st.badges || {};
    h += '<div class="badges">' + BADGES.map((b) => '<span class="badge' + (got[b[0]] ? ' on' : '') + '" title="' + esc(b[2]) + '"><i>' + (got[b[0]] ? '★' : '☆') + '</i>' + esc(b[1]) + '</span>').join('') + '</div></div>';
    h += '</div>';
    app.innerHTML = h;
    after(() => { const r = document.getElementById('ringv'); if (r) r.style.strokeDashoffset = String(C * (1 - frac)); applyBars(); });
  }

  /* ---------- Üben ---------- */
  function renderUeben() {
    view = 'ueben'; setFocus(false); setTab('ueben');
    const s = sub(), weak = weakIds().length, best = st.best || {};
    let h = top(false) + '<div class="screen"><div class="label">Üben</div><div class="modes">';
    h += '<button class="mode primary" data-act="quick"><span class="ic">✦</span><b>Schnelltraining · 10 Fragen</b><span>Alle Themen gemischt – neue Lernpunkte zuerst</span></button>';
    h += '<button class="mode" data-act="weak"><span class="ic">↺</span><b>Fehler wiederholen</b><span>' + (weak ? '' : 'Gerade keine offenen Fehler') + '</span>' + (weak ? '<span class="pill">' + weak + ' offen</span>' : '') + '</button>';
    h += '<button class="mode" data-act="para"><span class="ic">§</span><b>Paragraphen-Jagd</b><span>Nur Fundstellen – wie bei „Begründen“</span></button>';
    h += '<button class="mode" data-act="calc"><span class="ic">⏱</span><b>Rechentraining</b><span>Pausen, Anrechnung, Fristen, Abfindung</span></button>';
    h += '<button class="mode" data-act="cards"><span class="ic">❖</span><b>Lernkarten</b><span>Umdrehen und selbst prüfen</span></button>';
    h += '</div><div class="label">Spiele</div><div class="modes">';
    h += '<button class="mode game" data-act="memory"><span class="ic">▦</span><b>Memory</b><span>Paragraph ↔ Inhalt' + (best.memory ? ' · Rekord ' + best.memory + ' Züge' : '') + '</span></button>';
    h += '<button class="mode game" data-act="blitz"><span class="ic">ϟ</span><b>Blitzrunde</b><span>60 Sek. richtig oder falsch' + (best.blitz ? ' · Rekord ' + best.blitz : '') + '</span></button>';
    h += '<button class="mode game wide" data-act="kino"><span class="ic">▶</span><b>Karten-Kino</b><span>Lernkarten laufen von selbst – zum Nebenbei-Anschauen</span></button>';
    h += '</div><div class="label">Nach Thema</div><div class="list">';
    s.topics.forEach((t) => {
      const p = pct(t.id), m = medal(p);
      h += '<button class="item" data-act="topic" data-t="' + t.id + '"><span class="n">' + t.n + '</span><span><b>' + esc(t.name) + '</b><span class="bar"><i data-w="' + p + '"></i></span></span><span class="pct">' + p + '%' + (m ? '<br><span class="medaltxt ' + m + '">' + MEDAL[m] + '</span>' : '') + '</span></button>';
    });
    h += '</div></div>';
    app.innerHTML = h; after(applyBars);
  }

  /* ---------- Lernen ---------- */
  function renderLernen() {
    view = 'lernen'; setFocus(false); setTab('lernen');
    const s = sub(), p = prog();
    let h = top(false) + '<div class="screen"><div class="label">Lernzettel</div><div class="list">';
    s.topics.forEach((t) => { h += '<a class="item" href="#zettel-' + t.id + '"><span class="n">' + t.n + '</span><span><b>' + esc(t.name) + '</b><small>Kurz erklärt · Fundstellen · Fallen</small></span><span class="pct">→</span></a>'; });
    h += '</div><div class="label">Übungsblätter</div>';
    s.sheets.forEach((sh) => {
      const done = p.sheetsDone[sh.id];
      h += '<div class="card sheetrow"><div class="head"><div class="grow"><b>' + esc(sh.title) + '</b><div class="note">' + esc(sh.sub) + '</div></div>' + (done ? '<span class="done-badge">✓ erledigt</span>' : '') + '</div>' +
        '<div class="row2"><a class="btn small" href="blaetter/' + sh.id + '.html">Aufgaben</a><a class="btn small ghost" href="blaetter/' + sh.id + '-loesung.html">Lösungen</a></div></div>';
    });
    h += '<p class="note">Tipp: Direkt in die Felder schreiben (wird gespeichert), Gesetzessammlung daneben. Unter jeder Aufgabe „Lösung vergleichen“. Oben auf dem Blatt kannst du es als erledigt markieren.</p></div>';
    app.innerHTML = h;
  }
  function renderZettel(topicId) {
    const s = sub(), t = s.topics.find((x) => x.id === topicId);
    if (!t) { location.hash = '#lernen'; return; }
    view = 'zettel'; setFocus(false); setTab('lernen');
    let h = top(t.short) + '<div class="screen"><h2>' + esc(t.name) + '</h2><div class="zettel">';
    (s.notes[topicId] || []).forEach((b) => {
      if (b.warn) { h += '<div class="warn"><b class="t">Fallen & Fehler in den Unterlagen</b><ul>' + b.warn.map((x) => '<li>' + x + '</li>').join('') + '</ul></div>'; return; }
      h += '<div class="card blk">' + (b.h ? '<h3>' + esc(b.h) + '</h3>' : '');
      if (b.li) h += '<ul>' + b.li.map((x) => '<li>' + x + '</li>').join('') + '</ul>';
      if (b.tab) h += '<div class="tw"><table><tr>' + b.tab[0].map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr>' + b.tab.slice(1).map((r) => '<tr>' + r.map((c) => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</table></div>';
      h += '</div>';
    });
    h += '</div><button class="btn" data-act="topic" data-t="' + t.id + '">Jetzt dazu üben</button></div>';
    app.innerHTML = h; window.scrollTo(0, 0);
  }

  /* ---------- Klausuren ---------- */
  function renderKlausuren() {
    view = 'klausuren'; setFocus(false); setTab('klausuren');
    const s = sub(), p = prog(), run = st.examRun;
    let h = top(false) + '<div class="screen">';
    if (run && run.subject === s.id) {
      const e = s.exams.find((x) => x.id === run.exam);
      if (e && !run.end) h += '<a class="card install" href="blaetter/' + e.id + '.html"><b>' + esc(e.title) + ' läuft</b>Tippen, um weiterzuschreiben – die Zeit läuft weiter.</a>';
      else if (e) h += '<a class="card install" href="blaetter/' + e.id + '-loesung.html?score=1"><b>' + esc(e.title) + ' abgegeben</b>Jetzt mit der Lösung vergleichen und Punkte eintragen.</a>';
    }
    if (s.themen && s.themen.length) {
      h += '<div class="label">Themen der Klausur</div><div class="card themen"><p class="note">Liste deiner Lehrerin (Arbeitsgericht ist gestrichen). Antippen zum Üben.</p>' +
        s.themen.map((t, i) => { const p = themaPct(t), m = medal(p); return '<button class="thema" data-act="thema" data-i="' + i + '"><span class="tname"><b>' + esc(t.name) + '</b>' + (t.sub ? '<span class="note">' + esc(t.sub) + '</span>' : '') + '</span><span class="bar"><i data-w="' + p + '"></i></span><span class="tp">' + p + '%</span><span class="medal ' + (m || 'none') + '">●</span></button>'; }).join('') + '</div>';
    }
    h += '<div class="label">Probeklausuren</div>';
    s.exams.forEach((e) => {
      const res = p.exams[e.id] || [];
      h += '<div class="card sheetrow"><div class="head"><div class="grow"><b>' + esc(e.title) + '</b><div class="note">' + e.minutes + ' Min. · ' + e.parts.reduce((a, b) => a + b, 0) + ' Punkte · Gesetzessammlung erlaubt</div></div><span class="chip lvl-' + e.level + '">' + e.level + '</span></div>';
      if (res.length) h += '<div class="results">' + res.slice(0, 3).map((r) => '<span>' + nice(r.date) + ': ' + String(r.points).replace('.', ',') + ' / ' + r.max + ' P. (' + r.pct + ' %) · Note ≈ ' + r.grade + (r.minutes ? ' · ' + r.minutes + ' Min.' : '') + '</span>').join('') + '</div>';
      h += '<div class="row2"><a class="btn small" href="blaetter/' + e.id + '.html?run=1">' + (res.length ? 'Nochmal mit Timer' : 'Mit Timer starten') + '</a><a class="btn small ghost" href="blaetter/' + e.id + '-loesung.html">Lösung</a></div></div>';
    });
    h += '<p class="note">Ablauf: Starten → in die Felder schreiben → „Abgeben“ → deine Antworten stehen über der Lösung → Punkte eintragen. Die Note ist eine Schätzung nach IHK-Schlüssel.</p>';
    h += '<div class="label">Klausurtermine</div><div class="card">' + klausurList() + '<button class="btn small ghost" data-act="settings">Termin eintragen</button></div>';
    h += '</div>';
    app.innerHTML = h; applyBars();
  }
  function themaPct(t) { if (!t.k.length) return 0; let sum = 0; t.k.forEach((k) => { sum += cState(k); }); return Math.round(sum / t.k.length * 100); }
  function klausurList() {
    const ks = (st.settings.klausuren || []).slice().sort((a, b) => a.date.localeCompare(b.date));
    if (!ks.length) return '<p class="note">Noch kein Termin eingetragen.</p>';
    return '<div class="list">' + ks.map((k) => '<div class="kl"><b>' + esc(k.title) + '</b><span class="note">' + nice(k.date) + (k.date < Z.today() ? ' · vorbei' : '') + '</span><button data-act="delk" data-id="' + esc(k.id) + '">Löschen</button></div>').join('') + '</div><div class="spacer"></div>';
  }

  /* ---------- Quiz ---------- */
  function startSession(mode, topic) {
    const s = sub(); let ids = [], title = '';
    const all = s.questions.map((q) => q.id);
    if (mode === 'quick') { title = 'Schnelltraining'; ids = sample(all.concat(genIds()), 10); }
    else if (mode === 'topic') {
      const t = s.topics.find((x) => x.id === topic); title = t ? t.short : 'Thema';
      ids = sample(s.questions.filter((q) => q.t === topic).map((q) => q.id).concat(genIds(topic)), 10);
    }
    else if (mode === 'thema') {
      const t = s.themen[topic]; if (!t) return; title = t.name;
      ids = sample(s.questions.filter((q) => t.k.includes(q.k)).map((q) => q.id).concat(Object.keys(s.gens).filter((g) => t.k.includes(s.gens[g].k)).map((g) => 'g:' + g)), 10);
    }
    else if (mode === 'weak') { title = 'Fehler wiederholen'; ids = shuffle(weakIds()).slice(0, 10); if (!ids.length) { toast('Super – gerade keine offenen Fehler!'); return; } }
    else if (mode === 'para') { title = 'Paragraphen-Jagd'; ids = sample(s.questions.filter((q) => q.type === 'para').map((q) => q.id), 10); }
    else if (mode === 'calc') { title = 'Rechentraining'; const g = Object.keys(s.gens).filter((x) => s.gens[x].calc); for (let i = 0; i < 8; i++) ids.push('g:' + g[i % g.length]); ids = shuffle(ids); }
    sess = { mode, topic, title, ids, i: 0, results: [], combo: 0, bestCombo: 0, before: snapshot(), lvBefore: level(st.xp).n };
    nextQuestion();
  }
  function buildQ(id) {
    const s = sub();
    if (id.startsWith('g:')) { const g = s.gens[id.slice(2)]; const q = g.make(); q.id = null; q.gid = id; q.k = q.k || g.k; q.t = s.topicOf(q.k); q.gen = g.label; q.calc = !!g.calc; return q; }
    return Object.assign({}, qById(id));
  }
  function nextQuestion() {
    if (sess.i >= sess.ids.length) { renderResult(); return; }
    sess.q = buildQ(sess.ids[sess.i]); sess.answered = false; sess.revealed = false; renderQuestion(); window.scrollTo(0, 0);
  }
  function selfMode(q) {
    if (st.settings.typeAnswers === false) return false;
    return !!(q.calc && q.inp);
  }
  function qMeta(q) {
    const t = sub().topics.find((x) => x.id === q.t);
    let c = '<span class="chip">' + esc(t ? t.short : '') + '</span>';
    if (q.type === 'para') c += '<span class="chip para">§ Fundstelle</span>';
    if (q.gen) c += '<span class="chip">⟳ ' + esc(q.gen) + '</span>';
    if (selfMode(q)) c += '<span class="chip">Selbst prüfen</span>';
    if (q.type === 'tf') c += '<span class="chip">Richtig / Falsch</span>';
    if (q.type === 'match') c += '<span class="chip">Zuordnen</span>';
    if (q.type === 'order') c += '<span class="chip">Reihenfolge</span>';
    return c;
  }
  function comboChip() { return sess.combo >= 2 ? '<span class="combo">✦ ' + sess.combo + ' in Folge</span>' : ''; }
  function renderQuestion() {
    view = 'quiz'; setFocus(true);
    const q = sess.q, n = sess.ids.length, i = sess.i;
    let h = top(sess.title) + '<div class="screen"><div class="qhead"><div class="prog"><i id="pbar" data-w="' + (i / n * 100) + '"></i></div><span class="cnt">' + (i + 1) + ' / ' + n + '</span></div><div id="combo">' + comboChip() + '</div>';
    h += '<div class="card qcard"><div class="meta">' + qMeta(q) + '</div><h3>' + esc(q.q) + '</h3>';
    if (q.type === 'match') h += '<p class="sub">Tippe links, dann das passende Feld rechts.</p>';
    if (q.type === 'order') h += '<p class="sub">Tippe die Teile in der richtigen Reihenfolge an.</p>';
    if (selfMode(q)) h += '<p class="sub">Rechne und schreib dein Ergebnis auf. Dann Lösung zeigen und selbst bewerten.</p>';
    else if (q.type === 'para') h += '<p class="sub">Tippe die richtige Fundstelle an.</p>';
    h += '</div><div id="ans"></div><div id="fb"></div><div class="spacer"></div><div id="next" class="sticky"></div></div>';
    app.innerHTML = h; applyBars();
    const A = document.getElementById('ans');
    if (selfMode(q)) renderSelf();
    else if (q.type === 'mc' || q.type === 'para') {
      const order = shuffle(q.o.map((_, k) => k));
      A.innerHTML = '<div class="opts">' + order.map((k, j) => '<button class="opt" data-act="pick" data-k="' + k + '"><span class="k">' + 'ABCDEF'[j] + '</span><span>' + esc(q.o[k]) + '</span></button>').join('') + '</div>';
    } else if (q.type === 'tf') {
      A.innerHTML = '<div class="tf"><button class="opt" data-act="tf" data-v="1">Richtig</button><button class="opt" data-act="tf" data-v="0">Falsch</button></div>';
    } else if (q.type === 'match') {
      sess.m = { sel: null, done: 0, err: 0, right: shuffle(q.pairs.map((_, k) => k)) };
      A.innerHTML = '<div class="match"><div class="col">' + q.pairs.map((p, k) => '<button class="mi" data-act="ml" data-k="' + k + '">' + esc(p[0]) + '</button>').join('') + '</div><div class="col">' + sess.m.right.map((k) => '<button class="mi" data-act="mr" data-k="' + k + '">' + esc(q.pairs[k][1]) + '</button>').join('') + '</div></div>';
    } else if (q.type === 'order') { sess.o = { placed: [], pool: shuffle(q.items.map((_, k) => k)) }; renderOrder(); }
  }
  function renderOrder() {
    const q = sess.q, o = sess.o;
    document.getElementById('ans').innerHTML = '<div class="slots">' + q.items.map((_, k) => { const v = o.placed[k]; return '<div class="slot' + (v !== undefined ? ' filled' : '') + '"><span class="no">' + (k + 1) + '</span>' + (v !== undefined ? esc(q.items[v]) : '') + '</div>'; }).join('') + '</div><div class="pool">' + o.pool.filter((k) => !o.placed.includes(k)).map((k) => '<button class="mi" data-act="op" data-k="' + k + '">' + esc(q.items[k]) + '</button>').join('') + '</div>' + (o.placed.length && !sess.answered ? '<button class="linkbtn" data-act="oundo">↶ Letzten zurücknehmen</button>' : '');
  }
  /* Selbst prüfen: aufschreiben (optional), Lösung zeigen, selbst bewerten */
  const CHIPS = ['§', 'Abs.', 'Satz', 'Nr.', 'BBiG', 'JArbSchG', 'BGB', 'KSchG'];
  function renderSelf() {
    const q = sess.q, A = document.getElementById('ans');
    const ph = q.calc ? (q.inp.kind === 'date' ? 'z. B. 30.06.2027' : q.inp.kind === 'hm' ? 'z. B. 3:45' : 'Ergebnis') : 'z. B. § 20 Satz 2 BBiG';
    A.innerHTML = '<div class="typebox"><input id="tin" class="tin" type="text" inputmode="' + (q.calc ? 'decimal' : 'text') + '" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="' + esc(ph) + ' (optional)" aria-label="Deine Antwort">' +
      (q.calc ? '' : '<div class="chips">' + CHIPS.map((c) => '<button type="button" class="chipbtn" data-chip="' + esc(c) + '">' + esc(c) + '</button>').join('') + '</div>') +
      '<button class="btn" data-act="reveal">Lösung zeigen</button></div>';
    const inp = document.getElementById('tin');
    A.querySelectorAll('[data-chip]').forEach((b) => b.addEventListener('pointerdown', (e) => {
      e.preventDefault(); if (inp.disabled) return;
      const c = b.dataset.chip, v = inp.value, a = inp.selectionStart == null ? v.length : inp.selectionStart, z = inp.selectionEnd == null ? v.length : inp.selectionEnd;
      inp.setRangeText((a > 0 && !/\s$/.test(v.slice(0, a)) ? ' ' : '') + c + ' ', a, z, 'end'); inp.focus();
    }));
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); reveal(); } });
  }
  function solText(q) {
    const i = q.inp;
    if (i && i.kind === 'hm') return Math.floor(i.v / 60) + ':' + String(i.v % 60).padStart(2, '0') + ' Std. → ' + q.o[q.a];
    return q.o[q.a];
  }
  function reveal() {
    if (sess.answered || sess.revealed) return; sess.revealed = true;
    const q = sess.q, inp = document.getElementById('tin'), mine = inp.value.trim(); inp.disabled = true;
    document.querySelectorAll('.typebox .chips, [data-act="reveal"]').forEach((x) => x.remove());
    document.getElementById('fb').innerHTML = '<div class="solbox"><span class="cap">Lösung</span><b>' + esc(solText(q)) + '</b>' + (mine ? '<span class="cap">Deine Antwort</span><span>' + esc(mine) + '</span>' : '') +
      '<p class="note">Vergleiche ehrlich' + (q.calc ? '' : ' – Paragraph, Absatz und Gesetz müssen stimmen') + '. Wie war es?</p>' +
      '<div class="grade3"><button class="g-ok" data-act="self" data-g="1">Richtig</button><button class="g-half" data-act="self" data-g="0.5">Halb</button><button class="g-no" data-act="self" data-g="0">Falsch</button></div></div>';
  }
  function answer(g, extra) {
    if (sess.answered) return; sess.answered = true;
    const q = sess.q; grade(q.id, q.k, g); sess.results.push({ q, g });
    if (g === 1) { sess.combo++; sess.bestCombo = Math.max(sess.bestCombo, sess.combo); } else sess.combo = 0;
    if (sess.combo === 5) earn('serie5'); if (sess.combo === 10) earn('serie10');
    if (sess.combo === 3 || sess.combo === 5 || sess.combo === 10) toast(sess.combo + ' richtig in Folge!', true);
    const cb = document.getElementById('combo'); if (cb) cb.innerHTML = comboChip();
    const ref = q.p ? '<span class="ref">' + esc(q.p) + '</span>' : '';
    const sol = g < 1 && extra ? '<p><b>Lösung:</b> ' + esc(extra) + '</p>' : '';
    const head = g === 1 ? pick(['Richtig!', 'Genau so!', 'Sitzt!', 'Stark, Zajka!', 'Läuft!']) : g === 0.5 ? pick(['Halb – fast!', 'Teilweise.', 'Fast da!']) : pick(['Nicht ganz.', 'Knapp daneben.', 'Das kommt nochmal.']);
    const fb = document.getElementById('fb');
    const html = '<div class="fb ' + (g === 1 ? 'ok' : g === 0.5 ? 'half' : 'no') + '"><h4>' + head + '</h4>' + sol + (q.e ? '<p>' + esc(q.e) + '</p>' : '') + ref + '</div>';
    const box = fb.querySelector('.solbox');
    if (box) { const g3 = box.querySelector('.grade3'); if (g3) g3.remove(); fb.insertAdjacentHTML('beforeend', html); } else fb.innerHTML = html;
    document.getElementById('next').innerHTML = '<button class="btn" data-act="next">' + (sess.i + 1 < sess.ids.length ? 'Weiter →' : 'Auswertung ansehen') + '</button>';
    const pb = document.getElementById('pbar'); if (pb) pb.style.width = ((sess.i + 1) / sess.ids.length * 100) + '%';
    setTimeout(() => { const b = document.querySelector('[data-act="next"]'); if (b && b.scrollIntoView) b.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'end' }); }, 250);
  }
  function renderResult() {
    view = 'result'; setFocus(true);
    const n = sess.results.length, sum = sess.results.reduce((a, r) => a + r.g, 0), score = n ? Math.round(sum / n * 100) : 0;
    const p = prog(); p.sessions.unshift({ d: Z.today(), m: sess.title, ok: sum, n }); p.sessions = p.sessions.slice(0, 40); Z.save();
    earn('erste'); checkBadges();
    const now = snapshot(), lvNow = level(st.xp);
    const deltas = sub().topics.map((t) => [t, now[t.id] - sess.before[t.id]]).filter((x) => x[1] !== 0);
    const msg = score >= 90 ? 'Klausurreif!' : score >= 75 ? 'Richtig gut!' : score >= 50 ? 'Auf dem Weg.' : 'Dranbleiben – Fehler kommen wieder.';
    const d = now.all - sess.before.all;
    let h = top(sess.title) + '<div class="screen result"><div class="big" id="bignum">0%</div><h2>' + msg + '</h2><p class="note">' + String(sum).replace('.', ',') + ' von ' + n + ' richtig' + (sess.bestCombo >= 3 ? ' · beste Serie ' + sess.bestCombo : '') + '</p>';
    h += '<div class="card gain"><div class="row"><div class="grow"><b>Fortschritt gesamt</b><div class="bar"><i data-w="' + now.all + '"></i></div></div><div class="gpct">' + now.all + ' %' + (d ? '<small>' + (d > 0 ? '+' : '') + d + '</small>' : '') + '</div></div>' +
      (deltas.length ? '<div class="deltas">' + deltas.map((x) => '<span class="' + (x[1] > 0 ? 'up' : 'down') + '">' + (x[1] > 0 ? '+' : '') + x[1] + ' % ' + esc(x[0].short) + '</span>').join('') + '</div>' : '') +
      (lvNow.n > sess.lvBefore ? '<p class="lvup">Level ' + lvNow.n + ': ' + esc(lvNow.name) + '!</p>' : '') + '</div><div class="reslist">';
    sess.results.forEach((r) => { const t = r.q.q.length > 90 ? r.q.q.slice(0, 88) + '…' : r.q.q; h += '<div class="' + (r.g === 1 ? 'ok' : r.g === 0.5 ? 'half' : 'no') + '"><i>' + (r.g === 1 ? '✓' : r.g === 0.5 ? '½' : '✗') + '</i><span>' + esc(t) + '</span></div>'; });
    h += '</div><div class="spacer"></div><div class="row2"><button class="btn ghost" data-act="home">Fertig</button><button class="btn" data-act="again">Nächste 10</button></div></div>';
    app.innerHTML = h; after(applyBars);
    const el = document.getElementById('bignum');
    if (reduced()) el.textContent = score + '%';
    else { let c = 0; const step = () => { c = Math.min(score, c + 3); el.textContent = c + '%'; if (c < score) requestAnimationFrame(step); }; requestAnimationFrame(step); }
    if (score >= 80 || lvNow.n > sess.lvBefore) confetti();
  }

  /* ---------- Lernkarten (selbst prüfen) ---------- */
  let cardIdx = 0, cardOrder = [], cardBefore = null;
  function startCards() {
    const s = sub();
    const w = (i) => { const c = cState(s.cards[i].k); return (c === 1 ? 1 : c === 0.5 ? 3 : 5) * (0.6 + Math.random()); };
    cardOrder = s.cards.map((c, i) => i).sort((a, b) => w(b) - w(a)).slice(0, 15); cardIdx = 0; cardBefore = snapshot();
    renderCard();
  }
  function renderCard() {
    view = 'cards'; setFocus(true);
    if (cardIdx >= cardOrder.length) { const a = snapshot().all - cardBefore.all; toast('Runde geschafft!' + (a > 0 ? ' +' + a + ' % Fortschritt' : ''), true); earn('erste'); checkBadges(); go('#ueben'); return; }
    const s = sub(), c = s.cards[cardOrder[cardIdx]];
    app.innerHTML = top('Lernkarten') + '<div class="screen"><div class="qhead"><div class="prog"><i data-w="' + (cardIdx / cardOrder.length * 100) + '"></i></div><span class="cnt">' + (cardIdx + 1) + ' / ' + cardOrder.length + '</span></div>' +
      '<div class="flip qcard" id="flip" data-act="flip" role="button" tabindex="0" aria-label="Karte umdrehen"><div class="inner"><div class="face"><span class="chip">' + esc(s.topics.find((t) => t.id === c.t).short) + '</span><h3>' + esc(c.f) + '</h3><p class="hint">Erst selbst erklären – dann umdrehen</p></div><div class="face back"><span class="chip">Lösung</span><p>' + esc(c.b) + '</p></div></div></div>' +
      '<label class="cardlbl" for="cardin">Deine Erklärung (optional)</label><textarea id="cardin" class="tin cardin" rows="3" placeholder="Schreib auf, was du weißt …" autocapitalize="sentences"></textarea>' +
      '<div class="spacer"></div><div id="cardbtns"><button class="btn" data-act="flip">Umdrehen</button></div></div>';
    applyBars();
  }
  function cardFlipped() {
    const f = document.getElementById('flip'); if (!f) return; f.classList.add('on');
    const ci = document.getElementById('cardin');
    if (ci) { if (ci.value.trim()) { ci.readOnly = true; ci.classList.add('done'); const l = document.querySelector('.cardlbl'); if (l) l.textContent = 'Deine Erklärung – vergleiche mit der Karte'; } else { ci.remove(); const l = document.querySelector('.cardlbl'); if (l) l.remove(); } }
    const b = document.getElementById('cardbtns');
    if (b && !b.querySelector('.grade3')) b.innerHTML = '<div class="grade3"><button class="g-ok" data-act="card" data-g="1">Wusste ich</button><button class="g-half" data-act="card" data-g="0.5">Halb</button><button class="g-no" data-act="card" data-g="0">Nochmal</button></div>';
  }

  /* ---------- Spiel: Memory ---------- */
  let mem = null;
  function startMemory() {
    const pairs = shuffle(sub().pairs).slice(0, 6);
    const tiles = shuffle([].concat(...pairs.map((p, i) => [{ i, t: p[0], side: 'a' }, { i, t: p[1], side: 'b' }])));
    mem = { tiles, open: [], done: 0, moves: 0, start: Date.now(), lock: false };
    view = 'memory'; setFocus(true);
    app.innerHTML = top('Memory') + '<div class="screen"><div class="gamebar"><span>Züge: <b id="mmoves">0</b></span><span>Paare: <b id="mpairs">0</b> / 6</span></div>' +
      '<p class="note">Finde die Paare: Paragraph ↔ Inhalt. Perfekt wären 6 Züge.</p><div class="memgrid">' + mem.tiles.map((t, k) => '<button class="mtile ' + t.side + '" data-act="mtile" data-k="' + k + '"><span class="mback">§</span><span class="mfront">' + esc(t.t) + '</span></button>').join('') + '</div></div>';
  }
  function memTile(k) { return app.querySelector('.mtile[data-k="' + k + '"]'); }
  function memTap(k) {
    if (!mem || mem.lock) return; const el = memTile(k);
    if (!el || el.classList.contains('open') || el.classList.contains('done')) return;
    el.classList.add('open'); mem.open.push(k);
    if (mem.open.length < 2) return;
    mem.moves++; document.getElementById('mmoves').textContent = mem.moves;
    const [a, b] = mem.open, A = mem.tiles[a], B = mem.tiles[b];
    if (A.i === B.i) {
      mem.open = []; mem.done++; document.getElementById('mpairs').textContent = mem.done;
      [a, b].forEach((x) => memTile(x).classList.add('done'));
      if (mem.done === 6) setTimeout(memoryDone, 500);
    } else {
      mem.lock = true;
      setTimeout(() => { [a, b].forEach((x) => { const e = memTile(x); if (e) e.classList.remove('open'); }); mem.open = []; mem.lock = false; }, 950);
    }
  }
  function memoryDone() {
    if (view !== 'memory') return;
    const secs = Math.round((Date.now() - mem.start) / 1000); st.best = st.best || {};
    const rec = !st.best.memory || mem.moves < st.best.memory; if (rec) st.best.memory = mem.moves;
    st.xp += 20; Z.save(); if (mem.moves <= 9) earn('memory');
    app.innerHTML = top('Memory') + '<div class="screen result"><div class="big">' + mem.moves + '</div><h2>Züge' + (rec ? ' – neuer Rekord!' : '') + '</h2><p class="note">' + secs + ' Sekunden · +20 Punkte · Rekord: ' + st.best.memory + ' Züge</p><div class="spacer"></div><div class="row2"><button class="btn ghost" data-act="tab-ueben">Fertig</button><button class="btn" data-act="memory">Nochmal</button></div></div>';
    confetti();
  }

  /* ---------- Spiel: Blitzrunde ---------- */
  let blitz = null;
  function blitzItem() {
    const s = sub();
    if (Math.random() < 0.55) {
      const q = pick(s.questions.filter((x) => x.type === 'tf'));
      return { text: q.q, a: q.a, k: q.k, id: q.id, fix: q.e || '' };
    }
    const P = s.pairs, p = pick(P), truth = Math.random() < 0.5;
    const other = truth ? p : pick(P.filter((x) => x !== p));
    return { text: p[0] + ' regelt: „' + other[1] + '“', a: truth, k: null, id: null, fix: p[0] + ' = ' + p[1] };
  }
  function startBlitz() {
    stopGames();
    blitz = { score: 0, wrong: [], end: Date.now() + 60000, item: blitzItem(), lock: false, timer: null };
    view = 'blitz'; setFocus(true);
    app.innerHTML = top('Blitzrunde') + '<div class="screen"><div class="gamebar"><span>Zeit: <b id="btime">60</b> s</span><span>Punkte: <b id="bscore">0</b></span></div><div class="bbar"><i id="bbar"></i></div>' +
      '<div class="card blitzcard" id="bcard"><p id="btext"></p></div><div class="tf big2"><button class="opt" data-act="bans" data-v="1">Richtig</button><button class="opt" data-act="bans" data-v="0">Falsch</button></div><p class="note">Nur richtige Antworten zählen für den Fortschritt – Fehler kosten hier nichts.</p></div>';
    document.getElementById('btext').textContent = blitz.item.text;
    blitz.timer = setInterval(blitzTick, 200); blitzTick();
  }
  function blitzTick() {
    if (!blitz) return;
    if (view !== 'blitz') { clearInterval(blitz.timer); return; }
    const left = Math.max(0, blitz.end - Date.now());
    const t = document.getElementById('btime'), b = document.getElementById('bbar');
    if (t) t.textContent = Math.ceil(left / 1000); if (b) b.style.width = (left / 600) + '%';
    if (left <= 0) { clearInterval(blitz.timer); blitzDone(); }
  }
  function blitzAnswer(v) {
    if (!blitz || blitz.lock || view !== 'blitz') return; const it = blitz.item, ok = v === it.a; blitz.lock = true;
    const c = document.getElementById('bcard'); c.classList.remove('good', 'bad'); void c.offsetWidth; c.classList.add(ok ? 'good' : 'bad');
    if (ok) { blitz.score++; if (it.k) grade(it.id, it.k, 1); else { const t = Z.today(); st.days[t] = (st.days[t] || 0) + 1; st.xp += 3; Z.save(); } }
    else blitz.wrong.push(it);
    document.getElementById('bscore').textContent = blitz.score;
    setTimeout(() => { if (!blitz || view !== 'blitz') return; blitz.item = blitzItem(); const e = document.getElementById('btext'); if (e) e.textContent = blitz.item.text; blitz.lock = false; }, 280);
  }
  function blitzDone() {
    view = 'blitzdone';
    st.best = st.best || {}; const rec = blitz.score > (st.best.blitz || 0); if (rec) st.best.blitz = blitz.score; Z.save();
    if (blitz.score >= 15) earn('blitz15'); checkBadges();
    let h = top('Blitzrunde') + '<div class="screen result"><div class="big">' + blitz.score + '</div><h2>Punkte' + (rec ? ' – neuer Rekord!' : '') + '</h2><p class="note">Rekord: ' + (st.best.blitz || 0) + '</p>';
    if (blitz.wrong.length) h += '<div class="reslist">' + blitz.wrong.slice(0, 8).map((w) => '<div class="no"><i>✗</i><span><b>' + esc(w.text) + '</b><br>' + (w.a ? 'Richtig. ' : 'Falsch. ') + esc(w.fix) + '</span></div>').join('') + '</div>';
    h += '<div class="spacer"></div><div class="row2"><button class="btn ghost" data-act="tab-ueben">Fertig</button><button class="btn" data-act="blitz">Nochmal</button></div></div>';
    app.innerHTML = h; if (rec && blitz.score > 0) confetti();
  }

  /* ---------- Karten-Kino (passiv) ---------- */
  let kino = null;
  function startKino() {
    stopGames();
    kino = { order: shuffle(sub().cards.map((c, i) => i)), i: 0, back: false, playing: true, t: null };
    view = 'kino'; setFocus(true); renderKino(); kinoSchedule();
  }
  function renderKino() {
    const s = sub(), c = s.cards[kino.order[kino.i % kino.order.length]];
    app.innerHTML = top('Karten-Kino') + '<div class="screen"><div class="flip kino' + (kino.back ? ' on' : '') + '" id="kflip"><div class="inner"><div class="face"><span class="chip">' + esc(s.topics.find((t) => t.id === c.t).short) + '</span><h3>' + esc(c.f) + '</h3><p class="hint">Überleg kurz …</p></div><div class="face back"><span class="chip">Lösung</span><p>' + esc(c.b) + '</p></div></div></div>' +
      '<div class="kbar"><i id="kbar"></i></div><div class="row2"><button class="btn ghost" data-act="kplay">' + (kino.playing ? 'Pause' : 'Abspielen') + '</button><button class="btn" data-act="knext">Nächste →</button></div><p class="note">Vorderseite 5 Sek., Lösung 8 Sek. Zählt nicht für den Fortschritt – einfach anschauen.</p></div>';
    const bar = document.getElementById('kbar');
    if (bar && kino.playing && !reduced()) { bar.style.transition = 'none'; bar.style.width = '0%'; after(() => { bar.style.transition = 'width ' + (kino.back ? 8 : 5) + 's linear'; bar.style.width = '100%'; }); }
  }
  function kinoSchedule() {
    clearTimeout(kino.t); if (!kino.playing) return;
    kino.t = setTimeout(() => {
      if (view !== 'kino') return;
      if (!kino.back) kino.back = true; else { kino.back = false; kino.i++; }
      renderKino(); kinoSchedule();
    }, kino.back ? 8000 : 5000);
  }

  /* ---------- Anleitung ---------- */
  const GUIDE = [
    ['1-installieren', 'App aufs iPhone holen', 'In Safari auf Teilen (□↑) → „Zum Home-Bildschirm“. Dann läuft sie wie eine echte App, auch offline.'],
    ['2-termin', 'Klausurtermin eintragen', 'Oben rechts ⚙︎ → Datum wählen → speichern. Die App zählt runter und plant die Tage bis dahin.'],
    ['3-start', 'Jeden Tag: Start', 'Fortschritt in Prozent, Tagesziel und was heute dran ist – einfach antippen.'],
    ['4-ueben', 'Üben und Spiele', 'Schnelltraining, Fehler, Paragraphen, Rechnen, Lernkarten – dazu Memory, Blitzrunde und Karten-Kino.'],
    ['5-tippen', 'Selbst prüfen', 'Bei Rechenaufgaben: Ergebnis aufschreiben, „Lösung zeigen“, dann ehrlich Richtig, Halb oder Falsch tippen. Fundstellen tippst du einfach an.'],
    ['6-lernkarten', 'Lernkarten', 'Erst selbst erklären (gern ins Feld schreiben), dann umdrehen und bewerten.'],
    ['7-lernen', 'Lernzettel und Blätter', 'Unter „Lernen“: Lernzettel zu jedem Thema und die Übungsblätter. In den Blättern schreibst du direkt in die Felder und tippst „Lösung vergleichen“.'],
    ['8-klausur', 'Probeklausur mit Timer', 'Starten, in die Felder schreiben, „Abgeben“. Deine Antworten stehen dann über der Lösung – vergleichen und Punkte eintragen. Unter „Klausuren“ steht auch die Themenliste.']
  ];
  function renderGuide() {
    view = 'guide'; setFocus(false); setTab('');
    if (!st.settings.guideSeen) { st.settings.guideSeen = true; Z.save(); }
    let h = top('So geht’s') + '<div class="screen"><p class="note">Alles bleibt nur auf deinem iPhone. Sichern kannst du unter ⚙︎ → „Code kopieren“.</p><div class="guide">';
    GUIDE.forEach((g, i) => {
      h += '<div class="card gstep"><div class="ghead"><span class="n">' + (i + 1) + '</span><div><b>' + esc(g[1]) + '</b><p>' + esc(g[2]) + '</p></div></div>' +
        '<div class="shot"><img src="assets/anleitung/' + g[0] + '.jpg" alt="' + esc(g[1]) + '" loading="lazy" decoding="async" width="450" height="975"></div></div>';
    });
    h += '</div><button class="btn" data-act="home">Los geht’s</button></div>';
    app.innerHTML = h; window.scrollTo(0, 0);
  }

  /* ---------- Einstellungen ---------- */
  function renderSettings() {
    view = 'settings'; setFocus(false); setTab('');
    const g = st.settings.dailyGoal || 20, s = sub(), ty = st.settings.typeAnswers !== false;
    let h = top('Einstellungen') + '<div class="screen">';
    h += '<div class="card"><h2>Klausurtermine</h2><p class="note">Die App zählt die Tage runter und verteilt Blätter und Probeklausuren auf die Tage davor.</p>' + klausurList() +
      '<div class="field"><label for="ktitle">Bezeichnung</label><input id="ktitle" type="text" value="' + esc(s.short) + '-Klausur" autocomplete="off"></div>' +
      '<div class="field"><label for="kdate">Datum</label><input id="kdate" type="date" min="' + Z.today() + '"></div><button class="btn small" data-act="addk">Termin speichern</button></div>';
    h += '<div class="card"><h2>Rechenaufgaben</h2><p class="note">Selbst prüfen: Ergebnis aufschreiben, Lösung zeigen, selbst bewerten. Auswahl: Ergebnis aus vier Möglichkeiten antippen. Fundstellen-Fragen sind immer zum Antippen.</p><div class="seg two"><button data-act="typeon" data-v="1" class="' + (ty ? 'on' : '') + '">Selbst prüfen</button><button data-act="typeon" data-v="0" class="' + (ty ? '' : 'on') + '">Auswahl</button></div></div>';
    h += '<div class="card"><h2>Tagesziel</h2><p class="note">Fragen pro Tag</p><div class="seg">' + [10, 20, 30, 50].map((v) => '<button data-act="goal" data-v="' + v + '" class="' + (v === g ? 'on' : '') + '">' + v + '</button>').join('') + '</div></div>';
    h += '<div class="card"><h2>Sicherung</h2><p class="note">Alles bleibt nur auf diesem iPhone. Mit dem Code kannst du den Stand sichern (z. B. in Notizen) oder auf ein anderes Gerät bringen. Auch der Code aus dem alten LF1-Trainer funktioniert. Deine Texte in den Übungsblättern sind nicht im Code, sie bleiben nur auf dem Handy.</p>' +
      '<div class="row2"><button class="btn small ghost" data-act="copy">Code kopieren</button><button class="btn small ghost" data-act="import">Code einlesen</button></div><textarea id="imp" placeholder="Sicherungscode hier einfügen …" aria-label="Sicherungscode"></textarea></div>';
    h += '<a class="btn ghost" href="#anleitung">Anleitung ansehen</a>';
    h += '<div class="card"><h2>Als App installieren</h2><p class="note">Safari → Teilen (□↑) → „Zum Home-Bildschirm“. Danach funktioniert die App auch offline. Updates erscheinen oben als Hinweis.</p></div>';
    h += '<button class="btn ghost danger" data-act="reset">Fortschritt zurücksetzen</button><p class="note">Zajka lernt · Version 3 · ' + s.questions.length + ' Fragen + ' + Object.keys(s.gens).length + ' Fall-Generatoren · ohne Konto, ohne Tracking</p></div>';
    app.innerHTML = h; window.scrollTo(0, 0);
  }

  /* ---------- Konfetti ---------- */
  function confetti() {
    if (reduced()) return;
    const cv = document.getElementById('confetti'), cx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1;
    const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
    const cs = getComputedStyle(document.documentElement);
    const cols = [cs.getPropertyValue('--rose'), cs.getPropertyValue('--gold'), '#e9c8c4', '#f1dfb8'];
    const P = []; for (let i = 0; i < 120; i++) P.push({ x: W / 2, y: H * 0.35, vx: (Math.random() - 0.5) * 16 * dpr, vy: (-Math.random() * 14 - 4) * dpr, r: Math.random() * 6 + 4, c: pick(cols), a: Math.random() * 6, s: (Math.random() - 0.5) * 0.3 });
    let f = 0;
    (function loop() { cx.clearRect(0, 0, W, H); P.forEach((p) => { p.vy += 0.45 * dpr; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.a += p.s; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); cx.restore(); }); if (++f < 150) requestAnimationFrame(loop); else cx.clearRect(0, 0, W, H); })();
  }

  /* ---------- Plattform ---------- */
  function isIOS() { return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function isStandalone() { return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches; }

  /* ---------- Navigation ---------- */
  function stopGames() { if (blitz && blitz.timer) clearInterval(blitz.timer); if (kino) clearTimeout(kino.t); }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function route() {
    stopGames();
    st = Z.reload(); migrate();
    const h = (location.hash || '#start').slice(1);
    if (h === 'ueben') renderUeben();
    else if (h === 'lernen') renderLernen();
    else if (h === 'klausuren') renderKlausuren();
    else if (h === 'einstellungen') renderSettings();
    else if (h === 'anleitung') renderGuide();
    else if (h.indexOf('zettel-') === 0) renderZettel(h.slice(7));
    else renderStart();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('pageshow', (e) => { if (e.persisted) route(); });
  tabs.addEventListener('click', (e) => { const a = e.target.closest('a'); if (a && a.getAttribute('href') === location.hash) { e.preventDefault(); route(); } });

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act;
    if (b.tagName === 'A') e.preventDefault();
    if (a === 'settings') go('#einstellungen');
    else if (a === 'back') { stopGames(); if (view === 'zettel') go('#lernen'); else if (view === 'guide' || view === 'settings') go('#start'); else go('#ueben'); }
    else if (a === 'home') go('#start');
    else if (a === 'tab-ueben') go('#ueben');
    else if (a === 'seennew') { st.settings.seenVersion = APP_VERSION; Z.save(); renderStart(); }
    else if (a === 'hideguide') { st.settings.guideSeen = true; Z.save(); renderStart(); }
    else if (a === 'hideinstall') { st.settings.installHintHidden = true; Z.save(); renderStart(); }
    else if (a === 'quick' || a === 'weak' || a === 'para' || a === 'calc') startSession(a);
    else if (a === 'topic') startSession('topic', b.dataset.t);
    else if (a === 'thema') startSession('thema', +b.dataset.i);
    else if (a === 'cards') startCards();
    else if (a === 'again') startSession(sess.mode, sess.topic);
    else if (a === 'next') { sess.i++; nextQuestion(); }
    else if (a === 'reveal') reveal();
    else if (a === 'self') { if (sess && sess.revealed) answer(+b.dataset.g); }
    else if (a === 'pick') {
      if (sess.answered) return; const k = +b.dataset.k, q = sess.q;
      document.querySelectorAll('.opt').forEach((o) => { o.disabled = true; const kk = +o.dataset.k; if (kk === q.a) o.classList.add('correct'); else o.classList.add(o === b ? 'wrong' : 'dim'); });
      answer(k === q.a ? 1 : 0);
    }
    else if (a === 'tf') {
      if (sess.answered) return; const v = b.dataset.v === '1';
      document.querySelectorAll('.opt').forEach((o) => { o.disabled = true; const vv = o.dataset.v === '1'; if (vv === sess.q.a) o.classList.add('correct'); else o.classList.add(o === b ? 'wrong' : 'dim'); });
      answer(v === sess.q.a ? 1 : 0, 'Die Aussage ist ' + (sess.q.a ? 'richtig.' : 'falsch.'));
    }
    else if (a === 'ml') { if (b.classList.contains('done') || sess.answered) return; document.querySelectorAll('[data-act="ml"]').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); sess.m.sel = +b.dataset.k; }
    else if (a === 'mr') {
      if (b.classList.contains('done') || sess.answered || sess.m.sel === null) return;
      const k = +b.dataset.k, L = document.querySelector('[data-act="ml"][data-k="' + sess.m.sel + '"]');
      if (k === sess.m.sel) { L.classList.remove('sel'); L.classList.add('done'); b.classList.add('done'); sess.m.done++; sess.m.sel = null; if (sess.m.done === sess.q.pairs.length) answer(sess.m.err === 0 ? 1 : sess.m.err === 1 ? 0.5 : 0, sess.q.pairs.map((p) => p[0] + ' = ' + p[1]).join(' · ')); }
      else { sess.m.err++; [b, L].forEach((x) => { x.classList.remove('err'); void x.offsetWidth; x.classList.add('err'); }); }
    }
    else if (a === 'op') {
      if (sess.answered) return; const o = sess.o; o.placed.push(+b.dataset.k);
      if (o.placed.length === sess.q.items.length) {
        const right = o.placed.filter((v, k) => v === k).length, n = sess.q.items.length;
        renderOrderFinal(); answer(right === n ? 1 : right >= n / 2 ? 0.5 : 0, sess.q.items.join(' → '));
      } else renderOrder();
    }
    else if (a === 'oundo') { if (sess.answered) return; sess.o.placed.pop(); renderOrder(); }
    else if (a === 'flip') cardFlipped();
    else if (a === 'card') { const c = sub().cards[cardOrder[cardIdx]]; const g = +b.dataset.g; grade(null, c.k, g); if (g < 1) cardOrder.push(cardOrder[cardIdx]); cardIdx++; renderCard(); }
    else if (a === 'memory') startMemory();
    else if (a === 'mtile') memTap(+b.dataset.k);
    else if (a === 'blitz') startBlitz();
    else if (a === 'bans') blitzAnswer(b.dataset.v === '1');
    else if (a === 'kino') startKino();
    else if (a === 'kplay') { kino.playing = !kino.playing; renderKino(); kinoSchedule(); }
    else if (a === 'knext') { kino.back = false; kino.i++; renderKino(); kinoSchedule(); }
    else if (a === 'typeon') { st.settings.typeAnswers = b.dataset.v === '1'; Z.save(); renderSettings(); toast(st.settings.typeAnswers ? 'Selbst prüfen: an' : 'Auswahl: an'); }
    else if (a === 'goal') { st.settings.dailyGoal = +b.dataset.v; Z.save(); renderSettings(); toast('Tagesziel: ' + b.dataset.v + ' Fragen'); }
    else if (a === 'addk') {
      const d = document.getElementById('kdate').value, t = document.getElementById('ktitle').value.trim() || (sub().short + '-Klausur');
      if (!d) { toast('Bitte ein Datum wählen'); return; }
      st.settings.klausuren = st.settings.klausuren || [];
      st.settings.klausuren.push({ id: 'k' + Date.now(), subject: sub().id, title: t, date: d }); Z.save(); toast('Termin gespeichert'); renderSettings();
    }
    else if (a === 'delk') { st.settings.klausuren = (st.settings.klausuren || []).filter((k) => k.id !== b.dataset.id); Z.save(); route(); }
    else if (a === 'copy') {
      const code = Z.exportCode(); const ta = document.getElementById('imp');
      const fallback = () => { ta.value = code; ta.focus(); ta.select(); toast('Code markiert – jetzt kopieren'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(() => toast('Code kopiert'), fallback); else fallback();
    }
    else if (a === 'import') {
      try { const r = Z.importCode(document.getElementById('imp').value); st = Z.load(); migrate(); toast(r === 'lf1' ? 'Fortschritt aus dem LF1-Trainer übernommen' : 'Sicherung eingelesen'); go('#start'); }
      catch (err) { toast('Der Code ist ungültig'); }
    }
    else if (a === 'reset') { if (b.dataset.sure) { Z.reset(); st = Z.load(); toast('Zurückgesetzt'); go('#start'); } else { b.dataset.sure = '1'; b.textContent = 'Wirklich alles löschen? Nochmal tippen'; } }
  });
  function renderOrderFinal() {
    const q = sess.q, o = sess.o;
    document.getElementById('ans').innerHTML = '<div class="slots">' + q.items.map((_, k) => '<div class="slot filled ' + (o.placed[k] === k ? 'good' : 'bad') + '"><span class="no">' + (k + 1) + '</span>' + esc(q.items[o.placed[k]]) + '</div>').join('') + '</div>';
  }
  document.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.id === 'flip') { e.preventDefault(); cardFlipped(); } });

  const ub = document.getElementById('updateBanner');
  window.addEventListener('zajka:update', () => ub.classList.remove('is-hidden'));
  ub.addEventListener('click', () => { if (typeof window.__zajkaApplyUpdate === 'function') window.__zajkaApplyUpdate(); });
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  // Nur für lokale Tests: aktuelle Frage auslesen.
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__zajkaDbg = { q: () => sess && sess.q, blitz: () => blitz, endBlitz: () => { if (blitz) blitz.end = Date.now(); }, mem: () => mem };

  route();
})();
