/**
 * app.js – Oberfläche von „Zajka lernt“.
 * Bereiche: Start (Countdown, Tagesplan) · Üben (Quiz, Lernkarten) ·
 * Lernen (Lernzettel, Übungsblätter) · Klausuren (Probeklausuren, Termine).
 * Fächer kommen aus window.SUBJECTS – weitere Lernfelder lassen sich ergänzen.
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
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function sub() { return SUBJECTS[st.settings.subject] || SUBJECTS[Object.keys(SUBJECTS)[0]]; }
  function prog() { return Z.subject(sub().id); }
  function parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); }
  function dayDiff(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 864e5); }
  function addDays(s, n) { const d = parseDate(s); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  function nice(s) { const d = parseDate(s); return WD[d.getDay()] + ' ' + String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.'; }
  function toast(t) { const e = document.createElement('div'); e.className = 'toast'; e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), 2300); }
  function after(fn) { requestAnimationFrame(() => requestAnimationFrame(fn)); }
  // Breiten über CSSOM setzen (Inline-Styles sind per Sicherheitsregel gesperrt).
  function applyBars() { app.querySelectorAll('[data-w]').forEach((i) => { i.style.width = i.dataset.w + '%'; }); }
  function greet() { const h = new Date().getHours(); return h < 11 ? 'Guten Morgen, Zajka' : h < 18 ? 'Hallo Zajka' : 'Guten Abend, Zajka'; }
  function setFocus(on) { document.body.classList.toggle('focus', on); }

  /* ---------- Lernstand ---------- */
  function itemsOf(s, topic) {
    const ids = s.questions.filter((q) => !topic || q.t === topic).map((q) => q.id);
    Object.keys(s.gens).forEach((g) => { if (!topic || s.gens[g].t === topic) ids.push('g:' + g); });
    return ids;
  }
  function mastery(topic) {
    const s = sub(), p = prog(), ids = itemsOf(s, topic);
    let sum = 0; ids.forEach((id) => { const r = p.q[id]; sum += r ? Math.min(r.b, 3) / 3 : 0; });
    return ids.length ? sum / ids.length : 0;
  }
  function weakIds() {
    const s = sub(), p = prog();
    return Object.keys(p.q).filter((id) => p.q[id].w > 0 && p.q[id].b <= 2 && (id.startsWith('g:') ? !!s.gens[id.slice(2)] : s.questions.some((q) => q.id === id)));
  }
  function weight(id) { const r = prog().q[id]; if (!r) return 5; return [7, 5, 3.5, 2, 1.2, 0.6][r.b] + (r.w > r.c ? 2 : 0); }
  function weightedSample(ids, n) {
    const pool = ids.slice(), out = [];
    while (out.length < n && pool.length) {
      let tot = 0; const ws = pool.map((id) => { const w = weight(id); tot += w; return w; });
      let x = Math.random() * tot, i = 0;
      for (; i < pool.length; i++) { x -= ws[i]; if (x <= 0) break; }
      out.push(pool.splice(Math.min(i, pool.length - 1), 1)[0]);
    }
    return out;
  }
  function mark(id, ok) {
    const p = prog(); const r = p.q[id] || (p.q[id] = { b: 0, c: 0, w: 0 });
    if (ok) { r.c++; r.b = Math.min(5, r.b + 1); } else { r.w++; r.b = Math.max(0, r.b - 2); }
    r.l = Date.now();
    st.xp += ok ? 10 : 2;
    const t = Z.today(); st.days[t] = (st.days[t] || 0) + 1;
    Z.save();
  }
  function streak() {
    let n = 0; let d = Z.today();
    if (!st.days[d]) d = addDays(d, -1);
    while (st.days[d]) { n++; d = addDays(d, -1); }
    return n;
  }
  function weakestTopic() {
    const s = sub(); let best = null, val = 2;
    s.topics.forEach((t) => { const m = mastery(t.id); if (m < val) { val = m; best = t; } });
    return best;
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
    const days = [];
    if (!ex) return { ex: null, days: [{ date: t, items: remaining.slice(0, 1), review: false }] };
    const left = dayDiff(t, ex.date);
    if (left <= 0) return { ex, left, days: [] };
    const avail = left >= 2 ? left - 1 : left;
    const per = remaining.length ? Math.ceil(remaining.length / avail) : 0;
    for (let i = 0; i < left; i++) {
      const date = addDays(t, i);
      const review = left >= 2 && i === left - 1;
      days.push({ date, items: review ? [] : remaining.slice(i * per, (i + 1) * per), review });
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
  function setTab(name) {
    tabs.querySelectorAll('a').forEach((a) => a.classList.toggle('on', a.dataset.tab === name));
  }

  /* ---------- Start ---------- */
  function renderStart() {
    view = 'start'; setFocus(false); setTab('start');
    const s = sub(), plan = buildPlan(), ex = plan.ex;
    const goal = st.settings.dailyGoal || 20, todayN = st.days[Z.today()] || 0;
    const C = 2 * Math.PI * 38, frac = Math.min(1, todayN / goal);
    let h = top(false) + '<div class="screen">';
    if (isIOS() && !isStandalone() && !st.settings.installHintHidden) {
      h += '<div class="install"><b>Als App auf den Home-Bildschirm</b>In Safari unten auf <b>Teilen</b> (□↑) tippen → <b>„Zum Home-Bildschirm“</b>. Dann startet die App wie eine richtige App und funktioniert auch offline.<div class="row"><button class="btn small ghost" data-act="hideinstall">Verstanden</button></div></div>';
    }
    if (!st.settings.guideSeen) {
      h += '<div class="install guidecard"><a href="#anleitung" class="grow"><b>Neu hier? So funktioniert die App →</b>8 kurze Schritte mit Bildern.</a><button class="iconbtn small" data-act="hideguide" aria-label="Ausblenden">✕</button></div>';
    }
    // Countdown
    if (ex) {
      const left = dayDiff(Z.today(), ex.date);
      h += '<div class="card count"><div class="days">' + (left === 0 ? '!' : left) + '<small>' + (left === 0 ? 'heute' : left === 1 ? 'Tag' : 'Tage') + '</small></div><div class="grow"><h2>' +
        esc(ex.title) + '</h2><p>' + (left === 0 ? 'Heute ist Klausur – du schaffst das! Gesetzessammlung nicht vergessen.' : nice(ex.date) + ' · noch ' + left + (left === 1 ? ' Tag' : ' Tage')) + '</p></div></div>';
    } else {
      h += '<button class="card count empty" data-act="settings"><div class="days">?</div><div class="grow"><h2>Klausurtermin eintragen</h2><p class="note">Dann zählt die App die Tage runter und plant, was du wann lernst.</p></div></button>';
    }
    // Heute
    h += '<div class="card"><div class="row"><div class="ring"><svg width="92" height="92"><circle class="track" cx="46" cy="46" r="38" fill="none" stroke-width="9"/><circle class="val' + (frac ? '' : ' zero') + '" id="ringv" cx="46" cy="46" r="38" fill="none" stroke-width="9" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg><b>' + todayN + '<span>von ' + goal + '</span></b></div>' +
      '<div class="grow"><h2>' + greet() + '</h2><p class="note">' + (todayN >= goal ? 'Tagesziel geschafft – stark!' : 'Heute noch ' + (goal - todayN) + ' Fragen bis zum Tagesziel.') + '</p></div></div>';
    const today = plan.days[0];
    h += '<div class="todo">';
    h += '<a href="#" data-act="quick" class="' + (todayN >= goal ? 'ok' : '') + '"><span class="ck">' + (todayN >= goal ? '✓' : '') + '</span>Quiz: ' + goal + ' Fragen<span class="go">→</span></a>';
    if (ex && plan.left === 0) {
      h += '<div><span class="ck"></span>Nur noch Lernkarten und Lernzettel überfliegen – kein neuer Stoff.</div>';
    } else if (today) {
      if (today.review) h += '<a href="#" data-act="weak"><span class="ck"></span>Wiederholen: Fehler + Lernkarten<span class="go">→</span></a>';
      today.items.forEach((id) => { const it = planItem(id); h += '<a href="' + it.href + '"><span class="ck"></span>' + esc(it.title) + '<span class="go">→</span></a>'; });
    }
    const wt = weakestTopic();
    if (wt) h += '<a href="#" data-act="topic" data-t="' + wt.id + '"><span class="ck"></span>Schwächstes Thema: ' + esc(wt.short) + '<span class="go">→</span></a>';
    h += '</div></div>';
    // Plan bis zur Klausur
    if (ex && plan.days.length > 1) {
      h += '<div class="card"><h2>Plan bis zur Klausur</h2><div class="timeline">';
      plan.days.slice(1, 7).forEach((d) => {
        const txt = d.review ? 'Wiederholen: Fehler, Lernkarten, Lernzettel' : d.items.length ? d.items.map((id) => planItem(id).title).join(' · ') : 'Quiz + Lernkarten';
        h += '<div class="tl"><b>' + nice(d.date) + '</b><span>' + esc(txt) + '</span></div>';
      });
      h += '</div></div>';
    }
    const m = Math.round(mastery() * 100);
    h += '<div class="stats"><div class="stat"><b>' + streak() + '</b><span>Tage in Folge</span></div><div class="stat"><b>' + m + '%</b><span>gemeistert</span></div><div class="stat"><b>' + st.xp + '</b><span>Punkte</span></div></div>';
    h += '</div>';
    app.innerHTML = h;
    after(() => { const r = document.getElementById('ringv'); if (r) r.style.strokeDashoffset = String(C * (1 - frac)); });
  }

  /* ---------- Üben ---------- */
  function renderUeben() {
    view = 'ueben'; setFocus(false); setTab('ueben');
    const s = sub(), weak = weakIds().length;
    let h = top(false) + '<div class="screen"><div class="label">Üben</div><div class="modes">';
    h += '<button class="mode primary" data-act="quick"><span class="ic">✦</span><b>Schnelltraining · 10 Fragen</b><span>Alle Themen gemischt – Schwächen kommen öfter</span></button>';
    h += '<button class="mode" data-act="weak"><span class="ic">↺</span><b>Fehler wiederholen</b><span>' + (weak ? '' : 'Gerade keine offenen Fehler') + '</span>' + (weak ? '<span class="pill">' + weak + ' offen</span>' : '') + '</button>';
    h += '<button class="mode" data-act="para"><span class="ic">§</span><b>Paragraphen-Jagd</b><span>Nur Fundstellen – wie bei „Begründen“</span></button>';
    h += '<button class="mode" data-act="calc"><span class="ic">⏱</span><b>Rechentraining</b><span>Fristen, Urlaub, Pausen, Abfindung – immer neu</span></button>';
    h += '<button class="mode" data-act="cards"><span class="ic">❖</span><b>Lernkarten</b><span>' + s.cards.length + ' Begriffe zum Umdrehen</span></button>';
    h += '</div><div class="label">Nach Thema</div><div class="list">';
    s.topics.forEach((t) => {
      const p = Math.round(mastery(t.id) * 100);
      h += '<button class="item" data-act="topic" data-t="' + t.id + '"><span class="n">' + t.n + '</span><span><b>' + esc(t.name) + '</b><span class="bar"><i data-w="' + p + '"></i></span></span><span class="pct">' + p + '%</span></button>';
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
    h += '<p class="note">Tipp: Antworten auf Papier schreiben, Gesetzessammlung daneben. Oben auf dem Blatt kannst du es als erledigt markieren.</p></div>';
    app.innerHTML = h;
  }
  function renderZettel(topicId) {
    const s = sub(), t = s.topics.find((x) => x.id === topicId);
    if (!t) { location.hash = '#lernen'; return; }
    view = 'zettel'; setFocus(false); setTab('lernen');
    let h = top(t.short) + '<div class="screen"><h2>' + esc(t.name) + '</h2><div class="zettel">';
    (s.notes[topicId] || []).forEach((b) => {
      if (b.warn) { h += '<div class="warn"><b class="t">Typische Fallen</b><ul>' + b.warn.map((x) => '<li>' + x + '</li>').join('') + '</ul></div>'; return; }
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
    h += '<div class="label">Probeklausuren</div>';
    s.exams.forEach((e) => {
      const res = p.exams[e.id] || [];
      const best = res.reduce((m, r) => (r.pct > (m ? m.pct : -1) ? r : m), null);
      h += '<div class="card sheetrow"><div class="head"><div class="grow"><b>' + esc(e.title) + '</b><div class="note">' + e.minutes + ' Min. · ' + e.parts.reduce((a, b) => a + b, 0) + ' Punkte · Gesetzessammlung erlaubt</div></div><span class="chip lvl-' + e.level + '">' + e.level + '</span></div>';
      if (res.length) h += '<div class="results">' + res.slice(0, 3).map((r) => '<span>' + nice(r.date) + ': ' + String(r.points).replace('.', ',') + ' / ' + r.max + ' P. (' + r.pct + ' %) · Note ≈ ' + r.grade + (r.minutes ? ' · ' + r.minutes + ' Min.' : '') + '</span>').join('') + '</div>';
      h += '<div class="row2"><a class="btn small" href="blaetter/' + e.id + '.html?run=1">' + (best ? 'Nochmal mit Timer' : 'Mit Timer starten') + '</a><a class="btn small ghost" href="blaetter/' + e.id + '-loesung.html">Lösung</a></div></div>';
    });
    h += '<p class="note">Ablauf: Starten → auf Papier schreiben → „Abgeben“ → mit der Lösung vergleichen → Punkte eintragen. Die Note ist eine Schätzung nach IHK-Schlüssel.</p>';
    h += '<div class="label">Klausurtermine</div><div class="card">' + klausurList() + '<button class="btn small ghost" data-act="settings">Termin eintragen</button></div>';
    h += '</div>';
    app.innerHTML = h;
  }
  function klausurList() {
    const ks = (st.settings.klausuren || []).slice().sort((a, b) => a.date.localeCompare(b.date));
    if (!ks.length) return '<p class="note">Noch kein Termin eingetragen.</p>';
    return '<div class="list">' + ks.map((k) => '<div class="kl"><b>' + esc(k.title) + '</b><span class="note">' + nice(k.date) + (k.date < Z.today() ? ' · vorbei' : '') + '</span><button data-act="delk" data-id="' + esc(k.id) + '">Löschen</button></div>').join('') + '</div><div class="spacer"></div>';
  }

  /* ---------- Quiz ---------- */
  function startSession(mode, topic) {
    const s = sub(); let ids = [], title = '';
    const gens = Object.keys(s.gens).map((g) => 'g:' + g);
    if (mode === 'quick') { title = 'Schnelltraining'; ids = shuffle(weightedSample(s.questions.map((q) => q.id), 8).concat(shuffle(gens).slice(0, 2))); }
    else if (mode === 'topic') {
      const t = s.topics.find((x) => x.id === topic); title = t ? t.short : 'Thema';
      const st8 = weightedSample(s.questions.filter((q) => q.t === topic).map((q) => q.id), 8);
      const tg = Object.keys(s.gens).filter((g) => s.gens[g].t === topic).map((g) => 'g:' + g).slice(0, 2);
      ids = st8.concat(tg);
      if (ids.length < 10) ids = ids.concat(weightedSample(s.questions.filter((q) => q.t === topic && !ids.includes(q.id)).map((q) => q.id), 10 - ids.length));
      ids = shuffle(ids);
    }
    else if (mode === 'weak') { title = 'Fehler wiederholen'; ids = shuffle(weakIds()).slice(0, 10); if (!ids.length) { toast('Super – gerade keine offenen Fehler!'); return; } }
    else if (mode === 'para') { title = 'Paragraphen-Jagd'; ids = weightedSample(s.questions.filter((q) => q.type === 'para').map((q) => q.id), 10); }
    else if (mode === 'calc') { title = 'Rechentraining'; const g = Object.keys(s.gens); for (let i = 0; i < 8; i++) ids.push('g:' + g[i % g.length]); ids = shuffle(ids); }
    sess = { mode, topic, title, ids, i: 0, results: [] };
    nextQuestion();
  }
  function buildQ(id) {
    const s = sub();
    if (id.startsWith('g:')) { const g = s.gens[id.slice(2)]; const q = g.make(); q.id = id; q.t = g.t; q.gen = g.label; return q; }
    return Object.assign({}, s.questions.find((q) => q.id === id));
  }
  function nextQuestion() {
    if (sess.i >= sess.ids.length) { renderResult(); return; }
    sess.q = buildQ(sess.ids[sess.i]); sess.answered = false; renderQuestion(); window.scrollTo(0, 0);
  }
  function qMeta(q) {
    const t = sub().topics.find((x) => x.id === q.t);
    let c = '<span class="chip">' + esc(t ? t.short : '') + '</span>';
    if (q.type === 'para') c += '<span class="chip para">§ Fundstelle</span>';
    if (typeMode(q)) c += '<span class="chip">⌨︎ Tippen</span>';
    if (q.gen) c += '<span class="chip">⏱ ' + esc(q.gen) + '</span>';
    if (q.type === 'tf') c += '<span class="chip">Richtig / Falsch</span>';
    if (q.type === 'match') c += '<span class="chip">Zuordnen</span>';
    if (q.type === 'order') c += '<span class="chip">Reihenfolge</span>';
    return c;
  }
  function renderQuestion() {
    view = 'quiz'; setFocus(true);
    const q = sess.q, n = sess.ids.length, i = sess.i;
    let h = top(sess.title) + '<div class="screen"><div class="qhead"><div class="prog"><i id="pbar" data-w="' + (i / n * 100) + '"></i></div><span class="cnt">' + (i + 1) + ' / ' + n + '</span></div>';
    h += '<div class="card qcard"><div class="meta">' + qMeta(q) + '</div><h3>' + esc(q.q) + '</h3>';
    if (q.type === 'match') h += '<p class="sub">Tippe links, dann das passende Feld rechts.</p>';
    if (typeMode(q) === 'cite') h += '<p class="sub">Tippe die Fundstelle: Paragraph, Absatz und Gesetz (Satz/Nr. wenn du sie weißt).</p>';
    else if (typeMode(q) === 'value') h += '<p class="sub">Rechne und tippe das Ergebnis ein.</p>';
    if (q.type === 'order') h += '<p class="sub">Tippe die Begriffe in der richtigen Reihenfolge an.</p>';
    h += '</div><div id="ans"></div><div id="fb"></div><div class="spacer"></div><div id="next" class="sticky"></div></div>';
    app.innerHTML = h; applyBars();
    const A = document.getElementById('ans');
    const tm = typeMode(q);
    if (tm) renderTyping(tm);
    else if (q.type === 'mc' || q.type === 'para') {
      const order = shuffle(q.o.map((_, k) => k));
      A.innerHTML = '<div class="opts">' + order.map((k, j) => '<button class="opt" data-act="pick" data-k="' + k + '"><span class="k">' + 'ABCD'[j] + '</span><span>' + esc(q.o[k]) + '</span></button>').join('') + '</div>';
    } else if (q.type === 'tf') {
      A.innerHTML = '<div class="tf"><button class="opt" data-act="tf" data-v="1">Richtig</button><button class="opt" data-act="tf" data-v="0">Falsch</button></div>';
    } else if (q.type === 'match') {
      sess.m = { sel: null, done: 0, err: 0, right: shuffle(q.pairs.map((_, k) => k)) };
      A.innerHTML = '<div class="match"><div class="col">' + q.pairs.map((p, k) => '<button class="mi" data-act="ml" data-k="' + k + '">' + esc(p[0]) + '</button>').join('') + '</div><div class="col">' + sess.m.right.map((k) => '<button class="mi" data-act="mr" data-k="' + k + '">' + esc(q.pairs[k][1]) + '</button>').join('') + '</div></div>';
    } else if (q.type === 'order') { sess.o = { placed: [], pool: shuffle(q.items.map((_, k) => k)) }; renderOrder(); }
  }
  /* ---------- Antworten tippen ---------- */
  const CHIPS = ['§', 'Abs.', 'Satz', 'Nr.', 'BBiG', 'JArbSchG', 'BGB', 'KSchG'];
  function typeMode(q) {
    if (st.settings.typeAnswers === false || !window.ZCheck) return null;
    if (q.inp) return 'value';
    if (q.type === 'para' && String(q.o[q.a]).trim().indexOf('§') === 0) return 'cite';
    return null;
  }
  function renderTyping(mode) {
    const q = sess.q, A = document.getElementById('ans');
    const ph = mode === 'cite' ? 'z. B. § 20 Satz 2 BBiG' : q.inp.kind === 'date' ? 'TT.MM.JJJJ' : q.inp.kind === 'hm' ? 'Std:Min, z. B. 3:45' : 'Zahl' + (q.inp.unit ? ' (' + q.inp.unit + ')' : '');
    const im = mode === 'cite' ? 'text' : 'decimal';
    A.innerHTML = '<div class="typebox"><input id="tin" class="tin" type="text" inputmode="' + im + '" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="' + esc(ph) + '" aria-label="Deine Antwort">' +
      (mode === 'cite' ? '<div class="chips">' + CHIPS.map((c) => '<button type="button" class="chipbtn" data-chip="' + esc(c) + '">' + esc(c) + '</button>').join('') + '</div>' : '') +
      '<p id="thint" class="thint"></p><div class="row2"><button class="btn ghost" data-act="tskip">Weiß ich nicht</button><button class="btn" data-act="tcheck">Prüfen</button></div></div>';
    const inp = document.getElementById('tin');
    A.querySelectorAll('[data-chip]').forEach((b) => b.addEventListener('pointerdown', (e) => {
      e.preventDefault(); if (inp.disabled) return;
      const c = b.dataset.chip, v = inp.value, a = inp.selectionStart == null ? v.length : inp.selectionStart, z = inp.selectionEnd == null ? v.length : inp.selectionEnd;
      const pre = a > 0 && !/\s$/.test(v.slice(0, a)) ? ' ' : '';
      inp.setRangeText(pre + c + ' ', a, z, 'end'); inp.focus();
    }));
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); checkTyped(false); } });
    setTimeout(() => { try { inp.focus({ preventScroll: true }); } catch (e) { /* egal */ } }, 350);
  }
  function checkTyped(skip) {
    if (sess.answered) return;
    const q = sess.q, mode = typeMode(q), inp = document.getElementById('tin'), val = inp.value.trim();
    const sol = q.o[q.a];
    const done = () => { inp.disabled = true; document.getElementById('thint').textContent = ''; document.querySelectorAll('.typebox .row2, .typebox .chips').forEach((x) => x.remove()); };
    if (skip) { done(); answer(false, sol, 'Kein Problem – schau dir die Lösung an.'); return; }
    if (!val) { document.getElementById('thint').textContent = 'Bitte erst etwas eintippen.'; return; }
    const r = mode === 'cite' ? ZCheck.checkCite(val, ZCheck.citeText(sol)) : ZCheck.checkValue(val, q.inp);
    if (r.invalid) { document.getElementById('thint').textContent = r.msg; return; }
    done(); inp.classList.add(r.ok ? 'good' : 'bad');
    const note = 'Deine Antwort: ' + val + (r.ok ? (r.finer ? ' · ' + r.finer : '') : (r.msg ? ' · ' + r.msg : ''));
    answer(r.ok, sol, note);
  }
  function renderOrder() {
    const q = sess.q, o = sess.o;
    document.getElementById('ans').innerHTML = '<div class="slots">' + q.items.map((_, k) => { const v = o.placed[k]; return '<div class="slot' + (v !== undefined ? ' filled' : '') + '"><span class="no">' + (k + 1) + '</span>' + (v !== undefined ? esc(q.items[v]) : '') + '</div>'; }).join('') + '</div><div class="pool">' + o.pool.filter((k) => !o.placed.includes(k)).map((k) => '<button class="mi" data-act="op" data-k="' + k + '">' + esc(q.items[k]) + '</button>').join('') + '</div>';
  }
  function answer(ok, extra, note) {
    if (sess.answered) return; sess.answered = true;
    const q = sess.q; mark(q.id, ok); sess.results.push({ q, ok });
    const ref = q.p ? '<span class="ref">' + esc(q.p) + '</span>' : '';
    const sol = (note ? '<p class="mine">' + esc(note) + '</p>' : '') + ((!ok || note) && extra ? '<p><b>Lösung:</b> ' + esc(extra) + '</p>' : '');
    document.getElementById('fb').innerHTML = '<div class="fb ' + (ok ? 'ok' : 'no') + '"><h4>' + (ok ? pick(['Richtig!', 'Genau so!', 'Sitzt!', 'Stark, Zajka!']) : pick(['Nicht ganz.', 'Knapp daneben.', 'Das merken wir uns.'])) + '</h4>' + sol + '<p>' + esc(q.e || '') + '</p>' + ref + '</div>';
    document.getElementById('next').innerHTML = '<button class="btn" data-act="next">' + (sess.i + 1 < sess.ids.length ? 'Weiter →' : 'Auswertung ansehen') + '</button>';
    const pb = document.getElementById('pbar'); if (pb) pb.style.width = ((sess.i + 1) / sess.ids.length * 100) + '%';
    setTimeout(() => { const b = document.querySelector('[data-act="next"]'); if (b && b.scrollIntoView) b.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 250);
  }
  function renderResult() {
    view = 'result'; setFocus(true);
    const n = sess.results.length, ok = sess.results.filter((r) => r.ok).length, pct = n ? Math.round(ok / n * 100) : 0;
    const p = prog(); p.sessions.unshift({ d: Z.today(), m: sess.title, ok, n }); p.sessions = p.sessions.slice(0, 40); Z.save();
    const msg = pct >= 90 ? 'Klausurreif!' : pct >= 75 ? 'Richtig gut!' : pct >= 50 ? 'Auf dem Weg.' : 'Dranbleiben – Fehler kommen wieder.';
    let h = top(sess.title) + '<div class="screen result"><div class="big" id="bignum">0%</div><h2>' + msg + '</h2><p class="note">' + ok + ' von ' + n + ' richtig · +' + (ok * 10 + (n - ok) * 2) + ' Punkte</p><div class="reslist">';
    sess.results.forEach((r) => { const t = r.q.q.length > 90 ? r.q.q.slice(0, 88) + '…' : r.q.q; h += '<div class="' + (r.ok ? 'ok' : 'no') + '"><i>' + (r.ok ? '✓' : '✗') + '</i><span>' + esc(t) + '</span></div>'; });
    h += '</div><div class="spacer"></div><div class="row2"><button class="btn ghost" data-act="home">Fertig</button><button class="btn" data-act="again">Nochmal</button></div></div>';
    app.innerHTML = h;
    const el = document.getElementById('bignum');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) el.textContent = pct + '%';
    else { let c = 0; const step = () => { c = Math.min(pct, c + 3); el.textContent = c + '%'; if (c < pct) requestAnimationFrame(step); }; requestAnimationFrame(step); }
    if (pct >= 80) confetti();
  }

  /* ---------- Lernkarten ---------- */
  let cardIdx = 0, cardOrder = [];
  function startCards() { const s = sub(); cardOrder = shuffle(s.cards.map((_, k) => k)).sort((a, b) => weight('c' + b) - weight('c' + a)); cardIdx = 0; renderCard(); }
  function renderCard() {
    view = 'cards'; setFocus(true);
    if (cardIdx >= cardOrder.length) { toast('Alle Karten durch!'); go('#ueben'); return; }
    const c = sub().cards[cardOrder[cardIdx]];
    app.innerHTML = top('Lernkarten') + '<div class="screen"><div class="qhead"><div class="prog"><i data-w="' + (cardIdx / cardOrder.length * 100) + '"></i></div><span class="cnt">' + (cardIdx + 1) + ' / ' + cardOrder.length + '</span></div>' +
      '<div class="flip qcard" id="flip" data-act="flip" role="button" tabindex="0" aria-label="Karte umdrehen"><div class="inner"><div class="face"><span class="chip">Begriff</span><h3>' + esc(c[0]) + '</h3><p class="hint">Antippen zum Umdrehen</p></div><div class="face back"><span class="chip">Erklärung</span><p>' + esc(c[1]) + '</p></div></div></div>' +
      '<div class="spacer"></div><div class="row2"><button class="btn ghost" data-act="cardno">Nochmal üben</button><button class="btn" data-act="cardyes">Wusste ich ✓</button></div></div>';
    applyBars();
  }

  /* ---------- Anleitung ---------- */
  const GUIDE = [
    ['1-installieren', 'App aufs iPhone holen', 'In Safari auf Teilen (□↑) → „Zum Home-Bildschirm“. Dann läuft sie wie eine echte App, auch offline.'],
    ['2-termin', 'Klausurtermin eintragen', 'Oben rechts ⚙︎ → Datum wählen → speichern. Die App zählt runter und plant die Tage bis dahin.'],
    ['3-start', 'Jeden Tag: Start', 'Der Ring zeigt dein Tagesziel. Darunter steht, was heute dran ist – einfach antippen.'],
    ['4-ueben', 'Üben', 'Schnelltraining, Fehler wiederholen, Paragraphen-Jagd, Rechentraining, Lernkarten oder ein Thema.'],
    ['5-tippen', 'Antworten tippen', 'Fundstellen und Rechenaufgaben tippst du selbst. Die Knöpfe helfen bei § und Abs. Dann „Prüfen“.'],
    ['6-lernkarten', 'Lernkarten: selbst prüfen', 'Karte antippen zum Umdrehen. Ehrlich sein: „Wusste ich“ oder „Nochmal üben“.'],
    ['7-lernen', 'Lernzettel und Blätter', 'Unter „Lernen“: Lernzettel zu jedem Thema und die Übungsblätter mit Lösungen.'],
    ['8-klausur', 'Probeklausur mit Timer', 'Starten, auf Papier schreiben, „Abgeben“. Dann mit der Lösung vergleichen und Punkte eintragen.']
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
    const g = st.settings.dailyGoal || 20, s = sub();
    let h = top('Einstellungen') + '<div class="screen">';
    h += '<div class="card"><h2>Klausurtermine</h2><p class="note">Die App zählt die Tage runter und verteilt Blätter und Probeklausuren auf die Tage davor.</p>' + klausurList() +
      '<div class="field"><label for="ktitle">Bezeichnung</label><input id="ktitle" type="text" value="' + esc(s.short) + '-Klausur" autocomplete="off"></div>' +
      '<div class="field"><label for="kdate">Datum</label><input id="kdate" type="date" min="' + Z.today() + '"></div><button class="btn small" data-act="addk">Termin speichern</button></div>';
    const ty = st.settings.typeAnswers !== false;
    h += '<div class="card"><h2>Antworten tippen</h2><p class="note">Bei Fundstellen und Rechenaufgaben tippst du die Antwort selbst ein, die App prüft sie. Aus = Antwort auswählen.</p><div class="seg two"><button data-act="typeon" data-v="1" class="' + (ty ? 'on' : '') + '">An</button><button data-act="typeon" data-v="0" class="' + (ty ? '' : 'on') + '">Aus</button></div></div>';
    h += '<div class="card"><h2>Tagesziel</h2><p class="note">Fragen pro Tag</p><div class="seg">' + [10, 20, 30, 50].map((v) => '<button data-act="goal" data-v="' + v + '" class="' + (v === g ? 'on' : '') + '">' + v + '</button>').join('') + '</div></div>';
    h += '<div class="card"><h2>Sicherung</h2><p class="note">Alles bleibt nur auf diesem iPhone. Mit dem Code kannst du den Stand sichern (z. B. in Notizen) oder auf ein anderes Gerät bringen. Auch der Code aus dem alten LF1-Trainer funktioniert.</p>' +
      '<div class="row2"><button class="btn small ghost" data-act="copy">Code kopieren</button><button class="btn small ghost" data-act="import">Code einlesen</button></div><textarea id="imp" placeholder="Sicherungscode hier einfügen …" aria-label="Sicherungscode"></textarea></div>';
    h += '<a class="btn ghost" href="#anleitung">Anleitung ansehen</a>';
    h += '<div class="card"><h2>Als App installieren</h2><p class="note">Safari → Teilen (□↑) → „Zum Home-Bildschirm“. Danach funktioniert die App auch offline. Updates erscheinen oben als Hinweis.</p></div>';
    h += '<button class="btn ghost danger" data-act="reset">Fortschritt zurücksetzen</button><p class="note">Zajka lernt · Version 1 · ohne Konto, ohne Tracking</p></div>';
    app.innerHTML = h; window.scrollTo(0, 0);
  }

  /* ---------- Konfetti ---------- */
  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function route() {
    st = Z.reload();
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
  // Tab erneut antippen (gleicher Hash) → Bereich trotzdem neu zeigen, z. B. nach einem Quiz.
  tabs.addEventListener('click', (e) => { const a = e.target.closest('a'); if (a && a.getAttribute('href') === location.hash) { e.preventDefault(); route(); } });
  window.addEventListener('pageshow', (e) => { if (e.persisted) route(); });

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act;
    if (b.tagName === 'A') e.preventDefault();
    if (a === 'settings') go('#einstellungen');
    else if (a === 'back') { if (view === 'zettel') go('#lernen'); else if (view === 'guide') go('#start'); else if (view === 'settings') history.length > 1 ? history.back() : go('#start'); else if (sess && (view === 'quiz' || view === 'result')) go('#ueben'); else go('#ueben'); }
    else if (a === 'home') go('#start');
    else if (a === 'hideguide') { st.settings.guideSeen = true; Z.save(); renderStart(); }
    else if (a === 'hideinstall') { st.settings.installHintHidden = true; Z.save(); renderStart(); }
    else if (a === 'quick' || a === 'weak' || a === 'para' || a === 'calc') startSession(a);
    else if (a === 'topic') startSession('topic', b.dataset.t);
    else if (a === 'cards') startCards();
    else if (a === 'again') startSession(sess.mode, sess.topic);
    else if (a === 'next') { sess.i++; nextQuestion(); }
    else if (a === 'tcheck') checkTyped(false);
    else if (a === 'tskip') checkTyped(true);
    else if (a === 'typeon') { st.settings.typeAnswers = b.dataset.v === '1'; Z.save(); renderSettings(); toast(st.settings.typeAnswers ? 'Antworten tippen: an' : 'Antworten tippen: aus'); }
    else if (a === 'pick') {
      if (sess.answered) return; const k = +b.dataset.k, q = sess.q;
      document.querySelectorAll('.opt').forEach((o) => { o.disabled = true; const kk = +o.dataset.k; if (kk === q.a) o.classList.add('correct'); else o.classList.add(o === b ? 'wrong' : 'dim'); });
      answer(k === q.a);
    }
    else if (a === 'tf') {
      if (sess.answered) return; const v = b.dataset.v === '1';
      document.querySelectorAll('.opt').forEach((o) => { o.disabled = true; const vv = o.dataset.v === '1'; if (vv === sess.q.a) o.classList.add('correct'); else o.classList.add(o === b ? 'wrong' : 'dim'); });
      answer(v === sess.q.a, 'Die Aussage ist ' + (sess.q.a ? 'richtig.' : 'falsch.'));
    }
    else if (a === 'ml') { if (b.classList.contains('done') || sess.answered) return; document.querySelectorAll('[data-act="ml"]').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); sess.m.sel = +b.dataset.k; }
    else if (a === 'mr') {
      if (b.classList.contains('done') || sess.answered || sess.m.sel === null) return;
      const k = +b.dataset.k, L = document.querySelector('[data-act="ml"][data-k="' + sess.m.sel + '"]');
      if (k === sess.m.sel) { L.classList.remove('sel'); L.classList.add('done'); b.classList.add('done'); sess.m.done++; sess.m.sel = null; if (sess.m.done === sess.q.pairs.length) answer(sess.m.err === 0); }
      else { sess.m.err++; [b, L].forEach((x) => { x.classList.remove('err'); void x.offsetWidth; x.classList.add('err'); }); }
    }
    else if (a === 'op') {
      if (sess.answered) return; const o = sess.o; o.placed.push(+b.dataset.k); renderOrder();
      if (o.placed.length === sess.q.items.length) { const ok = o.placed.every((v, k) => v === k); answer(ok, sess.q.items.join(' → ')); document.querySelectorAll('.slot').forEach((s, k) => s.classList.add(o.placed[k] === k ? 'good' : 'bad')); }
    }
    else if (a === 'flip') document.getElementById('flip').classList.toggle('on');
    else if (a === 'cardyes' || a === 'cardno') { mark('c' + cardOrder[cardIdx], a === 'cardyes'); if (a === 'cardno') cardOrder.push(cardOrder[cardIdx]); cardIdx++; renderCard(); }
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
      try { const r = Z.importCode(document.getElementById('imp').value); st = Z.load(); toast(r === 'lf1' ? 'Fortschritt aus dem LF1-Trainer übernommen' : 'Sicherung eingelesen'); go('#start'); }
      catch (err) { toast('Der Code ist ungültig'); }
    }
    else if (a === 'reset') { if (b.dataset.sure) { Z.reset(); st = Z.load(); toast('Zurückgesetzt'); go('#start'); } else { b.dataset.sure = '1'; b.textContent = 'Wirklich alles löschen? Nochmal tippen'; } }
  });
  document.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.id === 'flip') { e.preventDefault(); e.target.classList.toggle('on'); } });

  // Update-Hinweis (pwa.js)
  const ub = document.getElementById('updateBanner');
  window.addEventListener('zajka:update', () => ub.classList.remove('is-hidden'));
  ub.addEventListener('click', () => { if (typeof window.__zajkaApplyUpdate === 'function') window.__zajkaApplyUpdate(); });

  // Daten möglichst dauerhaft halten (iOS: Home-Bildschirm-Apps sind ohnehin geschützt).
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  // Nur für lokale Tests: aktuelle Frage auslesen.
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__zajkaQ = () => sess && sess.q;

  route();
})();
