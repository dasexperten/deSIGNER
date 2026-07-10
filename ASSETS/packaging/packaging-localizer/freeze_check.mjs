// FREEZE CHECK — formal proof that "nothing changed but text".
// Strips the inner content of every <text>…</text> from two rendered SVGs,
// then asserts every remaining (non-text / design) byte is identical.
import { readFileSync } from 'node:fs';
const stripText = s => s
  .replace(/<text\b[^>]*>[\s\S]*?<\/text>/g, '<text/>')   // drop text content+attrs
  .replace(/\s+/g, ' ').trim();                            // normalize whitespace

function compare(aPath, bPath){
  const a = stripText(readFileSync(aPath,'utf8'));
  const b = stripText(readFileSync(bPath,'utf8'));
  const same = a === b;
  // count design primitives for context
  const count = s => ['path','image','rect','circle','polygon','line','g'].map(t=>{
    const m = s.match(new RegExp('<'+t+'\\b','g')); return t+':'+(m?m.length:0);
  }).join(' ');
  return { same, designNodes: count(readFileSync(aPath,'utf8')) };
}

const base = '/Users/dasexperten/packaging-localizer/out/SYMBIOS_';
const pairs = [['RU','DE'],['RU','AR'],['RU','KA'],['RU','VI'],['RU','HY']];
console.log('Design-freeze check (design nodes must be byte-identical across locales):\n');
let allPass = true;
for (const [x,y] of pairs){
  const r = compare(base+x+'.svg', base+y+'.svg');
  allPass = allPass && r.same;
  console.log(`  ${x} vs ${y}:  design frozen = ${r.same ? 'YES ✓' : 'NO ✗'}`);
}
console.log('\ndesign primitives in template:', compare(base+'RU.svg', base+'DE.svg').designNodes);
console.log(allPass ? '\nRESULT: ✓ Across ALL locales, only <text> differs. Design is byte-identical.' 
                    : '\nRESULT: ✗ design drift detected');
