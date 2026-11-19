/**
 * check.js – prüft getippte Antworten.
 * Fundstellen: „§ 20 S. 2 BBiG“, „20 Satz 2 bbig“, „§13 S2 Nr1 iVm §14 Abs3 BBiG“ …
 * Regel (Themenliste der Klasse: „Paragraph, Absatz und Gesetz“):
 *   Paragraph, Absatz und Gesetz müssen stimmen. Satz/Nummer/Buchstabe dürfen fehlen
 *   (dann Hinweis „noch genauer“), aber wenn sie angegeben sind, müssen sie stimmen.
 * Zahlen, Zeiten (Std:Min) und Daten werden exakt verglichen.
 */
(function (root) {
  'use strict';
  const LAWS = ['jarbschg', 'betrvg', 'muschg', 'sgbix', 'entgfg', 'nachwg', 'tzbfg', 'burlg', 'kschg', 'arbzg', 'bbig', 'beeg', 'gewo', 'bgb', 'hgb'];
  const LAWNAME = { jarbschg: 'JArbSchG', betrvg: 'BetrVG', muschg: 'MuSchG', sgbix: 'SGB IX', entgfg: 'EntgFG', nachwg: 'NachwG', tzbfg: 'TzBfG', burlg: 'BUrlG', kschg: 'KSchG', arbzg: 'ArbZG', bbig: 'BBiG', beeg: 'BEEG', gewo: 'GewO', bgb: 'BGB', hgb: 'HGB' };

  function norm(s) {
    return String(s).toLowerCase()
      .replace(/\([^)]*\)/g, ' ')
      .replace(/(\d)([a-zäöü])/g, '$1 $2').replace(/([a-zäöü§.])(\d)/g, '$1 $2')
      .replace(/§§/g, '§')
      .replace(/sgb\s*(ix|9)\b/g, ' sgbix ')
      .replace(/\bi\.?\s*v\.?\s*m\.?/g, ' | ')
      .replace(/\b(und|sowie)\b/g, ' | ')
      .replace(/[,;/+&]/g, ' | ')
      .replace(/absatz/g, ' abs ').replace(/\babs\b\.?/g, ' abs ')
      .replace(/\bsatz\b|\bs\.(?=\s*\d)|\bs(?=\s*\d)/g, ' satz ')
      .replace(/nummer|ziffer|ziff\.?|\bnr\b\.?/g, ' nr ')
      .replace(/buchstabe|buchst\.?|lit\.?/g, ' ')
      .replace(/[.:–-]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  /** Zerlegt Text in Fundstellen [{p, abs, satz, nr, lit, law}]. */
  function parse(text) {
    const t = norm(text);
    // in Stücke an „§“ oder „|“ teilen
    let parts = t.split(/§|\|/).map((x) => x.trim()).filter(Boolean);
    const out = [];
    parts.forEach((chunk) => {
      const toks = chunk.split(' ');
      const c = { p: '', abs: '', satz: '', nr: '', lit: '', law: '' };
      for (let i = 0; i < toks.length; i++) {
        const k = toks[i], nx = toks[i + 1];
        if (/^\d+$/.test(k) && !c.p && !['abs', 'satz', 'nr'].includes(toks[i - 1])) {
          c.p = k;
          if (nx && /^[a-z]$/.test(nx)) { c.p += nx; i++; } // § 1a, § 611a
        } else if (k === 'abs' && /^\d+$/.test(nx || '')) { c.abs = nx; i++; }
        else if (k === 'satz' && /^\d+$/.test(nx || '')) { c.satz = nx; i++; }
        else if (k === 'nr' && /^\d+$/.test(nx || '')) {
          c.nr = nx; i++;
          if (toks[i + 1] && /^[a-z]$/.test(toks[i + 1])) { c.lit = toks[i + 1]; i++; }
        } else {
          const w = k.replace(/[^a-z]/g, '');
          const law = LAWS.find((l) => w === l);
          if (law) c.law = law;
        }
      }
      if (c.p || c.law) out.push(c);
    });
    // Gesetz am Ende gilt für vorangehende Fundstellen ohne Gesetz
    let last = '';
    for (let i = out.length - 1; i >= 0; i--) { if (out[i].law) last = out[i].law; else out[i].law = last; }
    return out.filter((c) => c.p);
  }

  function fmtCite(c) {
    return '§ ' + c.p + (c.abs ? ' Abs. ' + c.abs : '') + (c.satz ? ' Satz ' + c.satz : '') + (c.nr ? ' Nr. ' + c.nr : '') + (c.lit ? ' ' + c.lit : '') + (c.law ? ' ' + LAWNAME[c.law] : '');
  }

  /** Vergleicht Eingabe mit Lösungstext. → {ok, finer, msg} */
  function checkCite(input, solution) {
    const want = parse(solution), got = parse(input);
    if (!got.length) return { ok: false, invalid: true, msg: 'Keine Fundstelle erkannt. Beispiel: § 20 Satz 2 BBiG' };
    const used = new Set(); const finer = []; const errs = [];
    want.forEach((w) => {
      const gi = got.findIndex((g, i) => !used.has(i) && g.p === w.p && g.law === w.law);
      if (gi < 0) {
        const sameP = got.find((g) => g.p === w.p);
        if (sameP && !sameP.law) errs.push('Das Gesetz fehlt (' + LAWNAME[w.law] + ').');
        else if (sameP) errs.push('Falsches Gesetz.');
        else errs.push(want.length > 1 ? 'Es fehlt eine Fundstelle.' : 'Falscher Paragraph oder falsches Gesetz.');
        return;
      }
      used.add(gi); const g = got[gi];
      if (w.abs && !g.abs) errs.push('Der Absatz fehlt.');
      else if (w.abs && g.abs !== w.abs) errs.push('Falscher Absatz.');
      else if (!w.abs && g.abs) errs.push('§ ' + w.p + ' ' + LAWNAME[w.law] + ' wird hier ohne Absatz zitiert.');
      if (w.satz && g.satz && g.satz !== w.satz) errs.push('Falscher Satz.');
      if (w.nr && g.nr && g.nr !== w.nr) errs.push('Falsche Nummer.');
      if (w.lit && g.lit && g.lit !== w.lit) errs.push('Falscher Buchstabe.');
      if ((w.satz && !g.satz) || (w.nr && !g.nr) || (w.lit && !g.lit)) finer.push(fmtCite(w));
    });
    if (errs.length) return { ok: false, msg: errs[0] };
    return { ok: true, finer: finer.length ? 'Noch genauer: ' + finer.join(' i. V. m. ') : '' };
  }

  /** Erste(n) Fundstelle(n) aus einem Antworttext holen, z. B. „Ja – § 615 Satz 1 BGB“. */
  function citeText(s) { const i = String(s).indexOf('§'); return i < 0 ? '' : String(s).slice(i).replace(/\s*\(.*$/, ''); }

  function parseNum(s) {
    let t = String(s).toLowerCase().replace(/€|eur|euro|werktage?|tage?|minuten|min|arbeitnehmer|an\b/g, '').replace(/\s+/g, '');
    if (/^(keine?|nein|0)$/.test(t)) return 0;
    if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
    const n = parseFloat(t);
    return isFinite(n) && /^-?\d*\.?\d+$/.test(t) ? n : NaN;
  }
  function parseHm(s) {
    const t = String(s).toLowerCase().replace(/uhr/g, '').trim();
    let m = t.match(/^(\d{1,2})\s*[:.]\s*(\d{2})$/); if (m) return +m[1] * 60 + +m[2];
    m = t.match(/^(\d{1,2})\s*(h|std\.?|stunden?)\s*(?:(\d{1,2})\s*(m|min\.?|minuten)?)?$/); if (m) return +m[1] * 60 + (m[3] ? +m[3] : 0);
    m = t.match(/^(\d{1,3})\s*(m|min\.?|minuten)$/); if (m) return +m[1];
    m = t.match(/^(\d{1,2})(?:,(\d+))?$/); if (m) return Math.round(parseFloat(m[1] + '.' + (m[2] || '0')) * 60);
    return NaN;
  }
  function parseDate(s) {
    const n = String(s).match(/\d+/g); if (!n || n.length < 2) return null;
    let [d, m, y] = n.map(Number); if (y != null && y < 100) y += 2000;
    return { d, m, y };
  }
  const hmTxt = (v) => Math.floor(v / 60) + ':' + String(v % 60).padStart(2, '0');

  /** Prüft Zahl/Zeit/Datum. inp = {kind, v, unit}. → {ok, msg, want} */
  function checkValue(input, inp) {
    if (inp.kind === 'num') {
      const n = parseNum(input);
      const want = inp.zero && inp.v === 0 ? 'keine Pause (0 ' + inp.unit + ')' : (Math.round(inp.v * 100) / 100).toLocaleString('de-DE') + ' ' + inp.unit;
      if (isNaN(n)) return { ok: false, invalid: true, msg: 'Bitte eine Zahl eingeben.', want };
      return { ok: Math.abs(n - inp.v) < 0.001, want };
    }
    if (inp.kind === 'hm') {
      const v = parseHm(input), want = hmTxt(inp.v) + ' Std.';
      if (isNaN(v)) return { ok: false, invalid: true, msg: 'Bitte als Std:Min eingeben, z. B. 3:45.', want };
      return { ok: v === inp.v, want };
    }
    if (inp.kind === 'date') {
      const g = parseDate(input), w = parseDate(inp.v);
      if (!g) return { ok: false, invalid: true, msg: 'Bitte als TT.MM.JJJJ eingeben.', want: inp.v };
      return { ok: g.d === w.d && g.m === w.m && (g.y == null || g.y === w.y), want: inp.v };
    }
    return { ok: false, want: '' };
  }

  const api = { parse, checkCite, citeText, checkValue, parseNum, parseHm, fmtCite };
  root.ZCheck = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof self !== 'undefined' ? self : this);
