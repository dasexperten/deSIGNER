// Packaging Localizer Worker
//   GET  /render?sku=SYMBIOS&country=AR   -> PNG preview (frozen design, swapped text)
//   GET  /api/fields?sku=&country=        -> JSON { fields:[{field_key,value,dir}], ... }
//   POST /api/string  { sku,country,field_key,value,updated_by }  -> save (new version)
//   GET  /                                -> minimal editor UI
//
// Bindings (wrangler.toml):
//   DB        D1   — templates + strings
//   ASSETS    R2   — templates/<SKU>.svg  +  fonts/<file>.ttf
//   CACHE     KV   — rendered PNG cache (optional)
import initWasm, { Resvg } from '@resvg/resvg-wasm';
import wasm from '@resvg/resvg-wasm/index_bg.wasm';
import { substitute } from './substitute.js';

let wasmReady;
const ensureWasm = () => (wasmReady ??= initWasm(wasm));

// Font files the designer uploads once to R2 under fonts/. Must cover every
// script used on pack (Latin, Cyrillic, Arabic, ...). Embed from Corel is the
// alternative; loading buffers here guarantees the renderer has the glyphs.
const FONT_KEYS = ['fonts/Arial.ttf','fonts/Arial Bold.ttf','fonts/Arial Italic.ttf','fonts/SFArabic.ttf'];

async function loadFonts(env){
  const buffers = [];
  for (const k of FONT_KEYS){
    const obj = await env.ASSETS.get(k);
    if (obj) buffers.push(new Uint8Array(await obj.arrayBuffer()));
  }
  return buffers;
}

function makeMeasurer(fontBuffers){
  // measure true rendered width via resvg-wasm innerBBox (real shaping)
  return (text, size, family, weight, style) => {
    const fw = weight==='bold' ? ' font-weight="bold"' : '';
    const fs = style==='italic' ? ' font-style="italic"' : '';
    const esc = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="6000" height="400">`
      + `<text x="0" y="200" font-family="${family}" font-size="${size}"${fw}${fs}>${esc}</text></svg>`;
    try {
      const r = new Resvg(svg, { font: { fontBuffers, loadSystemFonts:false, defaultFontFamily:'Arial' } });
      const bb = r.innerBBox() || r.getBBox();
      return bb ? bb.width : 0;
    } catch { return text.length * size * 0.55; }
  };
}

async function getValues(env, sku, country){
  const { results } = await env.DB.prepare(
    `SELECT field_key, value FROM strings WHERE sku=? AND country=?`
  ).bind(sku, country).all();
  const v = {}; for (const r of results) v[r.field_key] = r.value; return v;
}

async function getTemplate(env, sku){
  const row = await env.DB.prepare(`SELECT r2_key FROM templates WHERE sku=?`).bind(sku).first();
  const key = row?.r2_key || `templates/${sku}.svg`;
  const obj = await env.ASSETS.get(key);
  return obj ? await obj.text() : null;
}

export default {
  async fetch(req, env){
    const url = new URL(req.url);
    const p = url.pathname;
    const sku = url.searchParams.get('sku') || 'SYMBIOS';
    const country = url.searchParams.get('country') || 'RU';

    if (p === '/render'){
      await ensureWasm();
      const template = await getTemplate(env, sku);
      if (!template) return new Response('template not found', { status: 404 });
      const values = await getValues(env, sku, country);
      const fonts = await loadFonts(env);
      const { svg } = substitute(template, values, makeMeasurer(fonts));
      const png = new Resvg(svg, {
        background:'white', fitTo:{ mode:'width', value:2200 },
        font:{ fontBuffers:fonts, loadSystemFonts:false, defaultFontFamily:'Arial' },
      }).render().asPng();
      return new Response(png, { headers:{ 'content-type':'image/png', 'cache-control':'no-store' } });
    }

    if (p === '/api/fields'){
      const { results } = await env.DB.prepare(
        `SELECT field_key, value, dir, status FROM strings WHERE sku=? AND country=? ORDER BY field_key`
      ).bind(sku, country).all();
      return Response.json({ sku, country, fields: results });
    }

    if (p === '/api/string' && req.method === 'POST'){
      const b = await req.json();
      await env.DB.prepare(
        `INSERT INTO strings (sku,country,field_key,value,dir,status,version,updated_by,updated_at)
         VALUES (?,?,?,?,?, 'draft', 1, ?, datetime('now'))
         ON CONFLICT(sku,country,field_key) DO UPDATE SET
           value=excluded.value, status='draft', version=version+1,
           updated_by=excluded.updated_by, updated_at=excluded.updated_at`
      ).bind(b.sku, b.country, b.field_key, b.value, b.dir||'ltr', b.updated_by||'web').run();
      return Response.json({ ok:true });
    }

    if (p === '/') return new Response(EDITOR_HTML, { headers:{ 'content-type':'text/html; charset=utf-8' } });
    return new Response('not found', { status:404 });
  }
};

const EDITOR_HTML = `<!doctype html><meta charset=utf-8>
<title>Packaging Localizer</title>
<style>body{font:14px system-ui;margin:0;display:flex;height:100vh}
#side{width:46%;overflow:auto;padding:16px;border-right:1px solid #ddd}
#prev{flex:1;display:flex;align-items:center;justify-content:center;background:#f4f4f4}
#prev img{max-width:96%;max-height:96%;box-shadow:0 2px 12px #0002}
.row{margin:8px 0}label{display:block;color:#666;font-size:12px}
input,textarea{width:100%;box-sizing:border-box;padding:6px;font:13px system-ui}
h2{margin:4px 0 12px}select{padding:4px}</style>
<div id=side>
  <h2>Packaging Localizer</h2>
  <div class=row>SKU <select id=sku><option>SYMBIOS</option></select>
   Country <select id=country><option>RU</option><option>DE</option><option>AR</option></select></div>
  <div id=fields></div>
</div>
<div id=prev><img id=img></div>
<script>
const $=s=>document.querySelector(s);
async function load(){
  const sku=$('#sku').value,c=$('#country').value;
  const r=await(await fetch('/api/fields?sku='+sku+'&country='+c)).json();
  $('#fields').innerHTML=r.fields.map(f=>
    '<div class=row><label>'+f.field_key+' ['+f.dir+']</label>'+
    '<textarea rows=2 data-k="'+f.field_key+'" data-d="'+f.dir+'">'+(f.value||'')+'</textarea></div>').join('');
  refresh();
  document.querySelectorAll('textarea').forEach(t=>t.onchange=async()=>{
    await fetch('/api/string',{method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({sku,country:c,field_key:t.dataset.k,value:t.value,dir:t.dataset.d})});
    refresh();
  });
}
function refresh(){ $('#img').src='/render?sku='+$('#sku').value+'&country='+$('#country').value+'&t='+Date.now(); }
$('#sku').onchange=load;$('#country').onchange=load;load();
</script>`;
