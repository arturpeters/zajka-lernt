/**
 * sheet.js – macht aus einem Übungsblatt / einer Probeklausur eine App-Seite:
 * Leiste oben (zurück, Aufgaben/Lösungen, erledigt), Timer bei Probeklausuren
 * und Punkte-Eingabe auf der Lösungsseite.
 */
(function () {
  'use strict';
  const S = window.ZStore;
  const SUB = window.SUBJECTS && window.SUBJECTS.lf1;
  if (!S || !SUB) return;
  const id = document.documentElement.dataset.sheet || '';
  const isSol = /-loesung$/.test(id);
  const base = id.replace(/-loesung$/, '');
  const exam = SUB.exams.find((e) => e.id === base);
  const sheet = SUB.sheets.find((e) => e.id === base);
  const P = S.subject(SUB.id);
  const st = S.load();
  const params = new URLSearchParams(location.search);

  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  const back = '../index.html#' + (exam ? 'klausuren' : 'lernen');
  const title = (exam ? exam.title : sheet ? sheet.title : 'Blatt') + (isSol ? ' · Lösungen' : '');

  // ---------- Leiste oben ----------
  const bar = el('div', 'zbar');
  const a = el('a', null, '← App'); a.href = back; bar.appendChild(a);
  bar.appendChild(el('span', 'zt', title));
  const run = st.examRun && st.examRun.exam === base && !st.examRun.end ? st.examRun : null;
  if (!run) {
    const sw = el('a', null, isSol ? 'Aufgaben' : 'Lösungen');
    sw.href = (isSol ? base : base + '-loesung') + '.html';
    bar.appendChild(sw);
  }
  if (sheet && !isSol) {
    const done = el('button', null, P.sheetsDone[base] ? 'Erledigt ✓' : 'Erledigt?');
    if (P.sheetsDone[base]) done.classList.add('done');
    done.type = 'button';
    done.addEventListener('click', () => {
      if (P.sheetsDone[base]) delete P.sheetsDone[base]; else P.sheetsDone[base] = S.today();
      S.save();
      done.textContent = P.sheetsDone[base] ? 'Erledigt ✓' : 'Erledigt?';
      done.classList.toggle('done', !!P.sheetsDone[base]);
    });
    bar.appendChild(done);
  }
  document.body.prepend(bar);

  if (exam && exam.note) {
    const n = el('div', 'znote', exam.note);
    const first = document.querySelector('.cover');
    if (first) first.after(n); else document.body.prepend(n);
  }

  // ---------- Probeklausur: Timer ----------
  if (exam && !isSol) {
    let r = run;
    if (!r && params.get('run') === '1') {
      r = st.examRun = { subject: SUB.id, exam: base, start: Date.now() };
      S.save();
    }
    if (r) {
      const box = el('div', 'ztimer');
      const tm = el('span', 'tm', '');
      const lbl = el('span', 'lbl', 'Restzeit · auf Papier schreiben, Gesetzessammlung erlaubt');
      const btn = el('button', null, 'Abgeben');
      btn.type = 'button';
      box.append(tm, lbl, btn);
      document.body.appendChild(box);
      const total = exam.minutes * 60;
      const tick = () => {
        const left = total - Math.floor((Date.now() - r.start) / 1000);
        const abs = Math.abs(left);
        tm.textContent = (left < 0 ? '+' : '') + Math.floor(abs / 60) + ':' + String(abs % 60).padStart(2, '0');
        if (left < 0) { box.classList.add('over'); lbl.textContent = 'Zeit ist um – Stift weg und abgeben!'; }
      };
      tick(); setInterval(tick, 1000);
      let armed = false;
      btn.addEventListener('click', () => {
        if (!armed) { armed = true; btn.textContent = 'Wirklich abgeben?'; setTimeout(() => { armed = false; btn.textContent = 'Abgeben'; }, 3000); return; }
        r.end = Date.now(); st.examRun = r; S.save();
        location.href = base + '-loesung.html?score=1';
      });
    } else {
      const n = el('div', 'znote', 'Tipp: Starte die Probeklausur in der App unter „Klausuren“ – dann läuft die Zeit mit und du kannst danach deine Punkte eintragen.');
      const first = document.querySelector('.cover');
      if (first) first.after(n);
    }
  }

  // ---------- Probeklausur: Punkte eintragen ----------
  if (exam && isSol) {
    const r = st.examRun && st.examRun.exam === base ? st.examRun : null;
    const minutes = r && r.end ? Math.round((r.end - r.start) / 60000) : null;
    if (params.get('score') === '1') {
      const n = el('div', 'znote', 'Vergleiche Aufgabe für Aufgabe ehrlich mit der Lösung und trage ganz unten deine Punkte ein. Nur fast richtig = nicht volle Punkte.');
      const first = document.querySelector('.cover');
      if (first) first.after(n);
    }
    const box = el('div', 'zscore');
    box.appendChild(el('h3', null, 'Deine Punkte'));
    const rows = exam.parts.map((max, i) => {
      const row = el('div', 'row');
      row.appendChild(el('span', null, 'Aufgabe ' + (i + 1) + ' (max. ' + max + ')'));
      const inp = document.createElement('input');
      inp.type = 'number'; inp.min = '0'; inp.max = String(max); inp.step = '0.5'; inp.inputMode = 'decimal';
      inp.setAttribute('aria-label', 'Punkte Aufgabe ' + (i + 1));
      row.appendChild(inp);
      const lab = el('label');
      const cb = document.createElement('input'); cb.type = 'checkbox';
      lab.append(cb, document.createTextNode('auslassen'));
      row.appendChild(lab);
      box.appendChild(row);
      return { inp, cb, max };
    });
    const sum = el('div', 'sum', '');
    box.appendChild(sum);
    const save = el('button', null, 'Ergebnis speichern');
    save.type = 'button';
    box.appendChild(save);
    document.body.appendChild(box);
    const calc = () => {
      let pts = 0, max = 0;
      rows.forEach((r) => {
        if (r.cb.checked) { r.inp.disabled = true; return; }
        r.inp.disabled = false;
        max += r.max;
        const v = parseFloat(String(r.inp.value).replace(',', '.'));
        if (!isNaN(v)) pts += Math.max(0, Math.min(r.max, v));
      });
      const pct = max ? Math.round(pts / max * 100) : 0;
      sum.textContent = pts.toLocaleString('de-DE') + ' / ' + max + ' P. · ' + pct + ' % · Note ≈ ' + S.grade(pct) + ' (IHK-Schlüssel)';
      return { pts, max, pct };
    };
    rows.forEach((r) => { r.inp.addEventListener('input', calc); r.cb.addEventListener('change', calc); });
    calc();
    save.addEventListener('click', () => {
      const c = calc();
      if (!rows.some((r) => !r.cb.checked && r.inp.value !== '')) { sum.textContent = 'Bitte zuerst Punkte eintragen.'; return; }
      P.exams[base] = P.exams[base] || [];
      P.exams[base].unshift({ date: S.today(), points: c.pts, max: c.max, pct: c.pct, grade: S.grade(c.pct), minutes });
      if (st.examRun && st.examRun.exam === base) st.examRun = null;
      S.save();
      location.href = '../index.html#klausuren';
    });
  }
})();
