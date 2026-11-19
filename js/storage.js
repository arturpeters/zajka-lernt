/**
 * storage.js – alles bleibt auf dem Gerät (localStorage), kein Konto, kein Server.
 * Wird von der App (index.html) und von den Blätter-Seiten (blaetter/*.html)
 * gemeinsam benutzt, damit erledigte Blätter und Klausurergebnisse ankommen.
 */
(function (root) {
  'use strict';
  const KEY = 'zajka-lernt:v1';
  const SCHEMA = 1;

  function today() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function fresh() {
    return {
      schema: SCHEMA,
      subjects: {},          // id -> { q:{}, sessions:[], sheetsDone:{}, exams:{} }
      days: {},              // 'YYYY-MM-DD' -> Anzahl beantworteter Fragen
      xp: 0,
      settings: { subject: 'lf1', dailyGoal: 20, klausuren: [], installHintHidden: false },
      examRun: null,         // laufende Probeklausur { subject, exam, start }
      updatedAt: 0,
    };
  }
  let S = null;
  function load() {
    if (S) return S;
    S = fresh();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const o = JSON.parse(raw);
        if (o && o.schema === SCHEMA) {
          S = Object.assign(fresh(), o);
          S.settings = Object.assign(fresh().settings, o.settings || {});
        }
      }
    } catch (e) { /* leer starten */ }
    return S;
  }
  function save() {
    S.updatedAt = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch (e) { return false; }
  }
  function subject(id) {
    load();
    if (!S.subjects[id]) S.subjects[id] = { q: {}, sessions: [], sheetsDone: {}, exams: {} };
    const p = S.subjects[id];
    p.q = p.q || {}; p.sessions = p.sessions || []; p.sheetsDone = p.sheetsDone || {}; p.exams = p.exams || {};
    return p;
  }
  function exportCode() {
    load();
    try { return btoa(unescape(encodeURIComponent(JSON.stringify({ app: 'zajka-lernt', data: S })))); } catch (e) { return ''; }
  }
  /** Liest einen Sicherungscode – auch den alten Code aus dem LF1-Trainer (claude.ai). */
  function importCode(code) {
    const o = JSON.parse(decodeURIComponent(escape(atob(String(code).trim()))));
    load();
    if (o && o.app === 'zajka-lernt' && o.data && o.data.schema === SCHEMA) {
      S = Object.assign(fresh(), o.data);
      S.settings = Object.assign(fresh().settings, o.data.settings || {});
      save();
      return 'full';
    }
    if (o && o.v === 1 && o.q) {
      // Alter LF1-Trainer: Fortschritt pro Frage übernehmen (der bessere Stand gewinnt).
      const p = subject('lf1');
      Object.keys(o.q).forEach((id) => {
        const a = o.q[id], b = p.q[id];
        if (!b || (a.c + a.w) > (b.c + b.w)) p.q[id] = a;
      });
      Object.keys(o.days || {}).forEach((d) => { S.days[d] = Math.max(S.days[d] || 0, o.days[d]); });
      S.xp = Math.max(S.xp, o.xp || 0);
      (o.sessions || []).forEach((s) => p.sessions.push(s));
      p.sessions = p.sessions.slice(0, 40);
      save();
      return 'lf1';
    }
    throw new Error('unbekannt');
  }
  /** Neu von der Festplatte lesen (z. B. nach Rückkehr von einem Blatt). */
  function reload() { S = null; return load(); }
  function reset() { S = fresh(); save(); }
  /** Notenschätzung nach IHK-Schlüssel (nicht der Schlüssel der Schule). */
  function grade(pct) {
    if (pct >= 92) return 1; if (pct >= 81) return 2; if (pct >= 67) return 3;
    if (pct >= 50) return 4; if (pct >= 30) return 5; return 6;
  }

  root.ZStore = { load, reload, save, subject, today, exportCode, importCode, reset, grade, get state() { return load(); } };
})(typeof self !== 'undefined' ? self : this);
