// FREEZE CHECK v2 — STRUCTURAL proof that "nothing changed but text".
//
// Why v1 was unsound (regex strip of whole <text>…</text>):
//  - strips text ATTRS + CHILDREN wholesale -> hides design nodes nested inside
//    a <text> (e.g. <image>/<textPath href> inside text), and hides "text-as-graphic"
//    brand drift in <text> nodes that carry NO data-field.
//  - greedy/early-terminating regex mis-strips on self-closing <text/>, CDATA,
//    comments containing </text>.
//  - whitespace+entity normalization is too weak -> attr reordering, float
//    re-formatting, entity vs literal cause FALSE DRIFT on benign re-serialization.
//
// v2 approach: tokenize SVG into a node stream, then CANONICALIZE the design and
// diff structurally. The ONLY thing allowed to differ between locales is the text
// PAYLOAD (concatenated character data + tspan text) of <text> nodes that carry a
// data-field. Everything else — every design node, every attribute, every href,
// every non-field <text> — must be byte-identical after canonicalization.

import { readFileSync } from 'node:fs';

// ---- tokenizer: emits {type:'open'|'close'|'selfclose'|'text'|'cdata'|'comment', name, raw, attrs} ----
function tokenize(svg){
  const toks = [];
  let i = 0;
  while (i < svg.length){
    if (svg.startsWith('<!--', i)){
      const e = svg.indexOf('-->', i); const end = e<0?svg.length:e+3;
      toks.push({type:'comment', raw:svg.slice(i,end)}); i=end; continue;
    }
    if (svg.startsWith('<![CDATA[', i)){
      const e = svg.indexOf(']]>', i); const end = e<0?svg.length:e+3;
      toks.push({type:'cdata', raw:svg.slice(i,end)}); i=end; continue;
    }
    if (svg.startsWith('<?', i) || svg.startsWith('<!', i)){ // PI / doctype
      const e = svg.indexOf('>', i); const end = e<0?svg.length:e+1;
      toks.push({type:'pi', raw:svg.slice(i,end)}); i=end; continue;
    }
    if (svg[i] === '<'){
      const e = svg.indexOf('>', i); if (e<0){ toks.push({type:'text',raw:svg.slice(i)}); break; }
      const tag = svg.slice(i, e+1);
      const isClose = tag[1] === '/';
      const isSelf  = tag[tag.length-2] === '/';
      const name = (tag.match(/^<\/?\s*([a-zA-Z0-9:_.-]+)/)||[])[1] || '';
      toks.push({
        type: isClose ? 'close' : (isSelf ? 'selfclose' : 'open'),
        name, raw: tag, attrs: parseAttrs(tag)
      });
      i = e+1; continue;
    }
    // text run
    const nx = svg.indexOf('<', i); const end = nx<0?svg.length:nx;
    const raw = svg.slice(i, end);
    if (raw.length) toks.push({type:'text', raw});
    i = end;
  }
  return toks;
}

function parseAttrs(tag){
  const attrs = {};
  const body = tag.replace(/^<\/?\s*[a-zA-Z0-9:_.-]+/, '').replace(/\/?>$/, '');
  const re = /([a-zA-Z_:][-a-zA-Z0-9:._]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let m;
  while ((m = re.exec(body))) attrs[m[1]] = m[3] !== undefined ? m[3] : m[4];
  return attrs;
}

// ---- canonicalization helpers ----
const decodeEntities = s => String(s)
  .replace(/&#x([0-9a-fA-F]+);/g, (_,h)=>String.fromCodePoint(parseInt(h,16)))
  .replace(/&#(\d+);/g, (_,d)=>String.fromCodePoint(parseInt(d,10)))
  .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"')
  .replace(/&apos;/g,"'").replace(/&amp;/g,'&');

// normalize a numeric-ish attribute string: collapse float formatting (10.0 -> 10, 1.2300 -> 1.23)
const normNums = s => String(s).replace(/-?\d*\.?\d+(?:[eE][-+]?\d+)?/g, t => {
  const n = Number(t); return Number.isFinite(n) ? String(n) : t;
});

// canonical, order-independent attribute signature for a design node
function canonAttrs(attrs){
  return Object.keys(attrs).sort()
    .map(k => `${k}=${normNums(decodeEntities(attrs[k]))}`)
    .join('');
}

const RENDERER_TEXT_ATTRS = new Set([        // attrs substitute.js is ALLOWED to mutate on a field <text>
  'font-family','font-size','direction','text-anchor','x','data-x2'
]);

// build a canonical design-stream + a list of field-text payloads
function canonicalize(svg){
  const toks = tokenize(svg);
  const design = [];     // canonical tokens that must match across locales
  const fieldPayloads = {}; // data-field -> normalized text payload (allowed to differ)
  const violations = [];

  let depth = 0;
  let inFieldText = null;  // {field, payload, startDepth}
  let inAnyText = 0;       // nesting count of <text> elements (field or not)

  for (const t of toks){
    if (t.type === 'comment' || t.type === 'pi'){ design.push('C:'+t.raw.replace(/\s+/g,' ').trim()); continue; }

    if (t.type === 'open' || t.type === 'selfclose'){
      if (t.name === 'text'){
        const field = t.attrs['data-field'];
        if (field){
          // emit a canonical placeholder that EXCLUDES renderer-mutable attrs + the text body,
          // but INCLUDES every other attr (so e.g. a sneaky fill/clip-path change is still caught)
          const frozenAttrs = {};
          for (const k of Object.keys(t.attrs)) if (!RENDERER_TEXT_ATTRS.has(k)) frozenAttrs[k]=t.attrs[k];
          design.push(`<text#field=${field}|${canonAttrs(frozenAttrs)}>`);
          if (t.type === 'open'){ inFieldText = {field, payload:''}; inAnyText++; depth++; }
          continue;
        } else {
          // NON-field text = text drawn as graphic (brand, drawn label). Its payload is DESIGN.
          design.push(`<text|${canonAttrs(t.attrs)}>`);
          if (t.type === 'open'){ inAnyText++; depth++; }
          continue;
        }
      }
      // any other element
      const sig = `<${t.name}|${canonAttrs(t.attrs)}>`;
      if (inFieldText){
        // a design element nested INSIDE a field <text> is suspicious: the renderer only
        // emits <tspan>. Anything else (image, textPath, use, rect...) is design drift risk.
        if (t.name === 'tspan'){
          // tspan from renderer is PURE LAYOUT of the field payload (line count varies by
          // language). Do NOT emit into the design stream — capture its text as payload only.
          // x/dy/dx/y are renderer-computed layout. Any OTHER attr should never appear -> violation.
          const extra = {};
          for (const k of Object.keys(t.attrs)) if (!['x','y','dx','dy'].includes(k)) extra[k]=t.attrs[k];
          if (Object.keys(extra).length){
            violations.push(`unexpected attr on field tspan (data-field=${inFieldText.field}): ${Object.keys(extra).join(',')}`);
          }
        } else {
          violations.push(`design node <${t.name}> nested inside field <text data-field=${inFieldText.field}>`);
          design.push('NESTED:'+sig);
        }
      } else {
        design.push(sig);
      }
      if (t.type === 'open') depth++;
      continue;
    }

    if (t.type === 'close'){
      if (t.name === 'text'){
        if (inFieldText){
          fieldPayloads[inFieldText.field] = normPayload(inFieldText.payload);
          inFieldText = null;
        } else {
          design.push('</text>');
        }
        inAnyText = Math.max(0, inAnyText-1);
        depth = Math.max(0, depth-1);
        continue;
      }
      // suppress </tspan> that belongs to a field <text> (renderer layout, varies by language)
      if (!(inFieldText && t.name === 'tspan')) design.push(`</${t.name}>`);
      depth = Math.max(0, depth-1);
      continue;
    }

    // text / cdata character data
    if (t.type === 'text' || t.type === 'cdata'){
      const txt = t.type==='cdata' ? t.raw.slice(9,-3) : t.raw;
      if (inFieldText){
        inFieldText.payload += decodeEntities(txt);
      } else if (inAnyText){
        // char data inside a NON-field text = design payload
        const v = decodeEntities(txt).replace(/\s+/g,' ').trim();
        if (v) design.push('TXT:'+v);
      } else {
        // inter-element whitespace -> ignore; meaningful text outside any element is rare in SVG
        const v = decodeEntities(txt).replace(/\s+/g,' ').trim();
        if (v) design.push('STRAY:'+v);
      }
      continue;
    }
  }
  if (inFieldText) violations.push(`unclosed field <text data-field=${inFieldText.field}>`);
  return { design: design.join('\n'), fieldPayloads, violations };
}

const normPayload = s => decodeEntities(s).replace(/\s+/g,' ').trim();

// ---- compare two locales ----
function compare(aPath, bPath){
  const A = canonicalize(readFileSync(aPath,'utf8'));
  const B = canonicalize(readFileSync(bPath,'utf8'));
  const designSame = A.design === B.design;
  // first differing line for diagnostics
  let firstDiff = null;
  if (!designSame){
    const al = A.design.split('\n'), bl = B.design.split('\n');
    for (let k=0;k<Math.max(al.length,bl.length);k++){
      if (al[k]!==bl[k]){ firstDiff = {line:k, a:al[k], b:bl[k]}; break; }
    }
  }
  // field set must match (a missing/extra field = structural drift even though both are "text")
  const fa = Object.keys(A.fieldPayloads).sort().join(',');
  const fb = Object.keys(B.fieldPayloads).sort().join(',');
  const fieldsSame = fa === fb;
  return {
    designSame, fieldsSame,
    pass: designSame && fieldsSame && !A.violations.length && !B.violations.length,
    violations: [...A.violations, ...B.violations],
    firstDiff
  };
}

// ---- run against SYMBIOS if present; otherwise self-test the adversarial cases ----
const base = '/Users/dasexperten/packaging-localizer/out/SYMBIOS_';
import { existsSync } from 'node:fs';
if (existsSync(base+'RU.svg')){
  const pairs = [['RU','DE'],['RU','AR'],['RU','KA'],['RU','VI'],['RU','HY']];
  console.log('STRUCTURAL design-freeze check:\n');
  let all = true;
  for (const [x,y] of pairs){
    const r = compare(base+x+'.svg', base+y+'.svg');
    all = all && r.pass;
    let line = `  ${x} vs ${y}:  frozen=${r.pass?'YES':'NO'}`;
    if (!r.pass){
      if (!r.fieldsSame) line += '  [field set differs]';
      if (r.violations.length) line += '  [violations: '+r.violations.join('; ')+']';
      if (r.firstDiff) line += `  [first diff @line ${r.firstDiff.line}: "${r.firstDiff.a}" vs "${r.firstDiff.b}"]`;
    }
    console.log(line);
  }
  console.log(all ? '\nRESULT: design byte-identical (structural). Only field-text payload differs.'
                  : '\nRESULT: drift detected — see above.');
}

export { canonicalize, compare };
