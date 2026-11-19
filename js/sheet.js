/**
 * sheet.js – macht aus einem Übungsblatt / einer Probeklausur eine App-Seite:
 * Leiste oben (zurück, Aufgaben/Lösungen, erledigt), Timer bei Probeklausuren
 * Punkte-Eingabe auf der Lösungsseite und Schreibfelder in jeder Aufgabe
 * (gespeichert auf dem Gerät, mit „Lösung vergleichen“).
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
  // ---------- Schreibfelder ----------
  const KEY = 'zajka-lernt:blaetter';
  const CHIPS = ['§', 'Abs.', 'Satz', 'Nr.', 'BBiG', 'JArbSchG', 'BGB', 'KSchG', 'BUrlG'];
  function loadAll() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function saveAll(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* voll oder gesperrt */ } }
  const SKIP = (exam && exam.skip) || (sheet && sheet.skip) || {};
  const examRunning = !!(exam && st.examRun && st.examRun.exam === base && !st.examRun.end);

  /** Antworten einer Aufgabe als Text (für die Lösungsseite). */
  function answerLines(vals) { return (vals || []).map((v) => String(v || '').trim()).filter(Boolean); }

  if (!isSol) {
    const all = loadAll();
    const mine = all[base] = all[base] || {};
    const tasks = Array.prototype.slice.call(document.querySelectorAll('.task'));
    const taskOf = (node) => { let t = -1; tasks.forEach((x, i) => { if (x === node || x.contains(node) || (x.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING)) t = i; }); return t; };
    const fields = tasks.map(() => []);   // je Aufgabe: Liste von {get, set, el, para}
    let timer = null;
    const persist = () => { clearTimeout(timer); timer = setTimeout(() => { tasks.forEach((_, i) => { const v = fields[i].map((f) => f.get()); if (v.some((x) => x)) mine[i] = v; else delete mine[i]; }); saveAll(all); }, 300); };
    const grow = (ta) => { ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight + 2) + 'px'; };
    function makeTA(rows, ph, para) {
      const ta = document.createElement('textarea');
      ta.className = 'zta'; ta.rows = rows; ta.placeholder = ph || 'Deine Antwort';
      ta.setAttribute('autocapitalize', 'sentences'); ta.setAttribute('spellcheck', 'true');
      ta.addEventListener('input', () => { grow(ta); persist(); });
      ta.addEventListener('focus', () => showChips(ta));
      ta.dataset.para = para ? '1' : '';
      return ta;
    }
    function addField(node, f) { const t = taskOf(node); if (t < 0) return; fields[t].push(f); }
    const isPara = (node) => { const t = taskOf(node); return t >= 0 && !!tasks[t].querySelector('.c-b'); };

    // 1) Linien → mehrzeiliges Feld
    document.querySelectorAll('.lines').forEach((ln) => {
      const m = /\bl(\d)\b/.exec(ln.className); const rows = Math.max(2, m ? +m[1] : 2);
      const ta = makeTA(rows, 'Deine Antwort', isPara(ln)); ln.replaceWith(ta);
      addField(ta, { get: () => ta.value, set: (v) => { ta.value = v; }, el: ta });
    });
    // 2) „Antwort: ___ Fundstelle: ___“
    document.querySelectorAll('.fund').forEach((fd) => {
      fd.classList.add('zon');
      fd.querySelectorAll('span.u').forEach((u, k) => {
        const lab = u.previousElementSibling ? u.previousElementSibling.textContent : '';
        const fund = /fundstelle|gesetz/i.test(lab);
        const ta = makeTA(1, fund ? 'z. B. § 20 Satz 2 BBiG' : 'Antwort', fund || isPara(fd)); ta.classList.add('zline'); u.replaceWith(ta);
        addField(ta, { get: () => ta.value, set: (v) => { ta.value = v; }, el: ta });
      });
    });
    // 3) Tabellen: leere Zellen → Feld; Spalten „R“/„F“ → Ankreuzen
    document.querySelectorAll('table').forEach((tb) => {
      if (tb.closest('.vertrag')) return;
      const head = tb.querySelector('tr'); const hs = head ? Array.prototype.map.call(head.children, (c) => c.textContent.trim()) : [];
      const rCol = hs.indexOf('R'), fCol = hs.indexOf('F');
      Array.prototype.slice.call(tb.querySelectorAll('tr')).forEach((tr) => {
        const cells = Array.prototype.slice.call(tr.children);
        if (rCol >= 0 && fCol >= 0 && cells[rCol] && cells[rCol].tagName === 'TD' && !cells[rCol].textContent.trim()) {
          let val = '';
          const mk = (cell, v) => { const b = el('button', 'ztick', ''); b.type = 'button'; b.setAttribute('aria-label', v === 'R' ? 'richtig' : 'falsch'); cell.textContent = ''; cell.appendChild(b); return b; };
          const bR = mk(cells[rCol], 'R'), bF = mk(cells[fCol], 'F');
          const paint = () => { bR.classList.toggle('on', val === 'R'); bF.classList.toggle('on', val === 'F'); bR.textContent = val === 'R' ? '✕' : ''; bF.textContent = val === 'F' ? '✕' : ''; };
          bR.addEventListener('click', () => { val = val === 'R' ? '' : 'R'; paint(); persist(); });
          bF.addEventListener('click', () => { val = val === 'F' ? '' : 'F'; paint(); persist(); });
          addField(tr, { get: () => (val ? (cells[0].textContent.trim().slice(0, 40) + ' → ' + (val === 'R' ? 'richtig' : 'falsch')) : ''), set: (v) => { val = /richtig$/.test(v) ? 'R' : /falsch$/.test(v) ? 'F' : ''; paint(); }, el: bR });
        }
        cells.forEach((c, ci) => {
          if (c.tagName !== 'TD' || c.textContent.trim() || c.children.length) return;
          const fund = /fundstelle|gesetz/i.test(hs[ci] || '');
          const ta = makeTA(1, hs[ci] || 'Antwort', fund || isPara(c)); ta.classList.add('zcell'); c.appendChild(ta); c.classList.add('zc');
          addField(ta, { get: () => ta.value, set: (v) => { ta.value = v; }, el: ta });
        });
      });
    });
    // 4) Ankreuzen (Probetest)
    document.querySelectorAll('.mcq').forEach((mq) => {
      const opts = Array.prototype.slice.call(mq.children);
      let val = -1;
      const paint = () => opts.forEach((o, k) => o.classList.toggle('zx', k === val));
      opts.forEach((o, k) => { o.classList.add('zopt'); o.setAttribute('role', 'button'); o.tabIndex = 0; o.addEventListener('click', () => { val = val === k ? -1 : k; paint(); persist(); }); });
      addField(mq, { get: () => (val >= 0 ? opts[val].textContent.trim() : ''), set: (v) => { val = opts.findIndex((o) => o.textContent.trim() === v); paint(); }, el: mq });
    });

    // Gespeichertes wieder eintragen
    fields.forEach((fs, i) => { const v = mine[i] || []; fs.forEach((f, k) => { if (v[k]) f.set(v[k]); }); });
    document.querySelectorAll('textarea.zta').forEach(grow);

    // Paragraphen-Bausteine zum Antippen (unter dem gerade aktiven Fundstellen-Feld)
    const chipBar = el('div', 'zchips');
    CHIPS.forEach((c) => {
      const b = el('button', null, c); b.type = 'button';
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault(); const ta = chipBar._ta; if (!ta) return;
        const v = ta.value, a = ta.selectionStart == null ? v.length : ta.selectionStart, z = ta.selectionEnd == null ? v.length : ta.selectionEnd;
        ta.setRangeText((a > 0 && !/\s$/.test(v.slice(0, a)) ? ' ' : '') + c + ' ', a, z, 'end'); ta.focus(); grow(ta); persist();
      });
      chipBar.appendChild(b);
    });
    function showChips(ta) {
      if (!ta.dataset.para) { if (chipBar.parentNode) chipBar.remove(); return; }
      chipBar._ta = ta; const tb = ta.closest('table'); (tb || ta).after(chipBar);
    }

    // Hinweise und „Lösung vergleichen“
    let solDoc = null;
    const getSol = () => solDoc ? Promise.resolve(solDoc) : fetch(base + '-loesung.html').then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); }).then((t) => { solDoc = new DOMParser().parseFromString(t, 'text/html'); return solDoc; });
    tasks.forEach((t, i) => {
      if (SKIP[i]) { const n = el('div', 'zskip', SKIP[i] === 1 ? 'Kommt laut Themenliste nicht dran – auslassen.' : SKIP[i]); t.querySelector('.t').after(n); }
      if (examRunning) return;
      const fs = fields[i]; let anchor = t;
      if (fs.length) { const last = fs[fs.length - 1].el; anchor = last.closest('table') || last.closest('.fund') || last.closest('.mcq') || last; }
      if (!t.contains(anchor) && taskOf(anchor) !== i) anchor = t;
      const wrap = el('div', 'zcmpwrap');
      const btn = el('button', 'zcmp', 'Lösung vergleichen'); btn.type = 'button';
      const box = el('div', 'zsol'); box.hidden = true;
      wrap.append(btn, box); anchor.after(wrap);
      btn.addEventListener('click', () => {
        if (!box.hidden) { box.hidden = true; btn.textContent = 'Lösung vergleichen'; return; }
        btn.textContent = 'Lädt …';
        getSol().then((d) => {
          const lb = d.querySelectorAll('.lb')[i];
          box.textContent = '';
          if (!lb) box.appendChild(el('p', null, 'Lösung nicht gefunden – öffne oben „Lösungen“.'));
          else {
            const h = lb.previousElementSibling; if (h && h.classList.contains('lh')) box.appendChild(document.importNode(h, true));
            box.appendChild(document.importNode(lb, true));
            box.appendChild(el('p', 'zhint', 'Vergleiche ehrlich mit deiner Antwort: Stimmen Entscheidung, Paragraph, Absatz und Gesetz?'));
          }
          box.hidden = false; btn.textContent = 'Lösung ausblenden';
        }).catch(() => { btn.textContent = 'Lösung vergleichen'; box.hidden = false; box.textContent = 'Lösung konnte nicht geladen werden – öffne oben „Lösungen“.'; });
      });
    });

    // Kopf-Hinweis + Löschen
    const head = el('div', 'znote zwrite');
    head.appendChild(el('span', null, examRunning ? 'Schreib deine Antworten direkt in die Felder – sie bleiben auf diesem Handy gespeichert.' : 'Schreib direkt in die Felder – alles bleibt auf diesem Handy gespeichert. Unter jeder Aufgabe: „Lösung vergleichen“. Bei Fundstellen erscheinen Bausteine zum Antippen (§, Abs., BBiG …).'));
    const clr = el('button', 'zclear', 'Antworten löschen'); clr.type = 'button';
    let armed = false;
    clr.addEventListener('click', () => {
      if (!armed) { armed = true; clr.textContent = 'Wirklich alle löschen?'; setTimeout(() => { armed = false; clr.textContent = 'Antworten löschen'; }, 3000); return; }
      delete all[base]; saveAll(all); location.reload();
    });
    head.appendChild(clr);
    const cov = document.querySelector('.cover'); if (cov) cov.after(head); else document.body.prepend(head);
    window.addEventListener('pagehide', () => { clearTimeout(timer); tasks.forEach((_, i) => { const v = fields[i].map((f) => f.get()); if (v.some((x) => x)) mine[i] = v; else delete mine[i]; }); saveAll(all); });
  } else {
    // Lösungsseite: eigene Antworten über jeder Lösung zeigen
    const mine = loadAll()[base] || {};
    document.querySelectorAll('.lb').forEach((lb, i) => {
      const lines = answerLines(mine[i]);
      if (!lines.length) return;
      const box = el('div', 'zmine');
      box.appendChild(el('b', null, 'Deine Antwort'));
      lines.forEach((l) => box.appendChild(el('p', null, l)));
      lb.before(box);
    });
  }
})();
