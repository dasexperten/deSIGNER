// Packaging Localizer — pilot renderer (uses the SAME substitute module as the Worker).
// Usage: node render.mjs SYMBIOS RU   |   node render.mjs   (default: all locales)
import { readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { substitute } from './worker/src/substitute.js';

const FONT_OPT = {
  fontDirs: ['/System/Library/Fonts/Supplemental', '/System/Library/Fonts', '/Library/Fonts'],
  loadSystemFonts: true, defaultFontFamily: 'Arial',
};
const escm = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// true rendered width via the same engine (real glyph shaping) — honest fit-to-box
function measure(text, size, family, weight, style){
  const fw = weight==='bold' ? ' font-weight="bold"' : '';
  const fs = style==='italic' ? ' font-style="italic"' : '';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="8000" height="400">'
    + '<text x="0" y="200" font-family="'+family+'" font-size="'+size+'"'+fw+fs+'>'+escm(text)+'</text></svg>';
  try { const bb = new Resvg(svg, { font: FONT_OPT }).innerBBox(); return bb ? bb.width : 0; }
  catch { return text.length * size * 0.55; }
}

function render(sku, country){
  const template = readFileSync(new URL('./template/'+sku+'.svg', import.meta.url), 'utf8');
  const all = JSON.parse(readFileSync(new URL('./strings.json', import.meta.url), 'utf8'));
  const set = all[sku] && all[sku][country];
  if (!set){ console.error('No strings for '+sku+'/'+country); return; }
  const values = {}; for (const k of Object.keys(set)) if (k !== '_dir') values[k] = set[k];

  const { svg, report } = substitute(template, values, measure);
  writeFileSync(new URL('./out/'+sku+'_'+country+'.svg', import.meta.url), svg);
  const png = new Resvg(svg, { background:'white', fitTo:{ mode:'width', value:2200 }, font: FONT_OPT }).render().asPng();
  writeFileSync(new URL('./out/'+sku+'_'+country+'.png', import.meta.url), png);

  const notes = report.filter(r => r.fit !== 'ok').map(r => r.field+':'+r.fit);
  console.log('['+sku+'/'+country+'] '+png.length+'B  fit:'+(notes.length?notes.join(', '):'all ok'));
}

const [sku = 'SYMBIOS', country] = process.argv.slice(2);
const all = JSON.parse(readFileSync(new URL('./strings.json', import.meta.url), 'utf8'));
const locales = country ? [country] : Object.keys(all[sku] || {});
for (const c of locales) render(sku, c);
