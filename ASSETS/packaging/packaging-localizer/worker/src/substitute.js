// Engine-agnostic text substitution + fit-to-box + word-wrap + RTL + per-script
// font selection. `measureWidth(text,size,family,weight,style)` is injected so
// the same code runs under native resvg (pilot) and resvg-wasm (Worker).
export const ARABIC_RE   = /[؀-ۿݐ-ݿ]/;
const ARMENIAN_RE = /[԰-֏]/;
const GEORGIAN_RE = /[Ⴀ-ჿᲐ-Ჿ]/;
export const isArabic = s => ARABIC_RE.test(s);

const FAMILY = {
  arabic:   'SF Arabic',
  armenian: 'SF Armenian',
  georgian: 'SF Georgian',
};
function scriptFamily(text, fallback){
  if (ARABIC_RE.test(text))   return { fam: FAMILY.arabic,   rtl: true  };
  if (ARMENIAN_RE.test(text)) return { fam: FAMILY.armenian, rtl: false };
  if (GEORGIAN_RE.test(text)) return { fam: FAMILY.georgian, rtl: false };
  return { fam: fallback || 'Arial', rtl: false };
}

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const attr = (s,n) => (s.match(new RegExp(`(?<![-\\w])${n}="([^"]*)"`))||[])[1];
function setAttr(s,n,v){
  if (attr(s,n)!==undefined) return s.replace(new RegExp(`(?<![-\\w])${n}="[^"]*"`), `${n}="${v}"`);
  return s + ` ${n}="${v}"`;
}

// greedy word-wrap into lines that each fit `maxw` at `size`
function wrap(text, maxw, size, fam, weight, style, measure){
  const words = text.split(/\s+/).filter(Boolean);
  const lines = []; let cur = '';
  for (const w of words){
    const trial = cur ? cur + ' ' + w : w;
    if (!cur || measure(trial, size, fam, weight, style) <= maxw) cur = trial;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

export function substitute(template, values, measureWidth){
  const report = [];
  const out = template.replace(
    /<text\b([^>]*\bdata-field="([^"]+)"[^>]*)>([\s\S]*?)<\/text>/g,
    (m, attrs, field) => {
      let a = attrs;
      const value = values[field];
      if (value === undefined) return m;

      const tplFam  = attr(a,'font-family') || 'Arial';
      const { fam, rtl } = scriptFamily(value, tplFam);
      const maxw     = parseFloat(attr(a,'data-maxw')) || Infinity;
      const baseSize = parseFloat(attr(a,'font-size')) || 16;
      const weight   = attr(a,'font-weight');
      const style    = attr(a,'font-style');
      const anchor   = attr(a,'text-anchor');
      const doWrap   = attr(a,'data-wrap') === '1';
      const lh       = parseFloat(attr(a,'data-lh')) || Math.round(baseSize * 1.25);
      const maxLines = parseInt(attr(a,'data-maxlines')) || 99;

      // apply script font + RTL anchoring
      if (fam !== tplFam) a = setAttr(a,'font-family', fam);
      let baseX = attr(a,'x');
      if (rtl){
        a = setAttr(a,'direction','rtl');
        if (anchor !== 'middle'){
          const x2 = attr(a,'data-x2'); if (x2){ a = setAttr(a,'x', x2); baseX = x2; }
          a = setAttr(a,'text-anchor','end');
        }
      }

      let size = baseSize, fitNote = 'ok', inner;
      if (doWrap){
        // wrap; if too many lines, shrink font and re-wrap until it fits maxLines
        let lines = wrap(value, maxw, size, fam, weight, style, measureWidth);
        while (lines.length > maxLines && size > 8){
          size -= 1;
          lines = wrap(value, maxw, size, fam, weight, style, measureWidth);
        }
        if (size !== baseSize){ a = setAttr(a,'font-size', size); fitNote = `wrap+shrink ${baseSize}->${size} (${lines.length}ln)`; }
        else fitNote = `wrap (${lines.length}ln)`;
        const curLh = Math.round(lh * size / baseSize);
        inner = lines.map((ln,i)=>`<tspan x="${baseX}"${i?` dy="${curLh}"`:''}>${esc(ln)}</tspan>`).join('');
      } else {
        // single line: shrink-to-fit
        const w = measureWidth(value, baseSize, fam, weight, style);
        if (w > maxw){ size = Math.max(8, Math.floor(baseSize * (maxw/w))); a = setAttr(a,'font-size', size); fitNote = `shrink ${baseSize}->${size}`; }
        inner = esc(value);
      }
      report.push({ field, script: fam, dir: rtl?'rtl':'ltr', fit: fitNote });
      return `<text${a}>${inner}</text>`;
    }
  );
  return { svg: out, report };
}
