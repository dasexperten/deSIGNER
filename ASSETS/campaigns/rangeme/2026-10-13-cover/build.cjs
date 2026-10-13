const fs=require('fs'),sharp=require('sharp');
const dir=__dirname;process.env.FONTCONFIG_FILE=__dirname+'/fonts.conf';
const svg=s=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="3200" height="800">${s}</svg>`);
(async()=>{
const scene=await sharp(__dirname+'/refs/scene.png').resize(1600,800).png().toBuffer();
const mask=Buffer.from('<svg width="1000" height="1000"><path fill="white" d="M502 110L598 87L720 105L720 877L597 921L498 889L502 176L480 510L462 778L455 865Q400 900 341 870L334 796L324 480L313 225L301 177L302 135L502 135Z"/></svg>');
const rawpack=await sharp(__dirname+'/refs/innoweiss.png').ensureAlpha().composite([{input:mask,blend:'dest-in'}]).png().toBuffer();
const pack=await sharp(rawpack).trim().resize({height:520}).png().toBuffer();await sharp(pack).toFile(dir+'/innoweiss-cutout.png');
const pr=await sharp(pack).ensureAlpha().raw().toBuffer({resolveWithObject:true}); const cd=Buffer.alloc(pr.info.width*(pr.info.height+8)*4); for(let x=0;x<pr.info.width;x++){let y=pr.info.height-1;while(y>=0&&pr.data[(y*pr.info.width+x)*4+3]<128)y--;if(y<480)continue;for(let k=0;k<5;k++){let o=((y+k)*pr.info.width+x)*4;cd[o]=30;cd[o+1]=40;cd[o+2]=48;cd[o+3]=Math.round(165*(1-k/5));}}const contact=await sharp(cd,{raw:{width:pr.info.width,height:pr.info.height+8,channels:4}}).blur(.5).png().toBuffer();
const logo=await sharp(__dirname+'/refs/logo-full.png').resize({width:640}).png().toBuffer();
const blend=svg('<defs><linearGradient id="fade"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect x="1500" y="0" width="270" height="800" fill="url(#fade)"/>');
const shadow=svg('<defs><filter id="s"><feGaussianBlur stdDeviation="5"/></filter></defs><g fill="#253341" opacity=".25" filter="url(#s)"><ellipse cx="1676" cy="565" rx="37" ry="7"/><ellipse cx="1818" cy="589" rx="59" ry="7"/></g><g stroke="#3c4248" stroke-width="4" opacity=".6"><path d="M2565 437h20M2894 453h21"/></g>');
const labelPanel=svg('<rect x="1600" y="675" width="1600" height="110" fill="white" opacity=".72"/>');
const base=await sharp({create:{width:3200,height:800,channels:4,background:'#fff'}}).composite([{input:scene,left:1600,top:0},{input:blend},{input:shadow},{input:contact,left:1615,top:71},{input:pack,left:1615,top:70},{input:dir+'/etalon-full-cutout.png',left:1900,top:316}]).png().toBuffer();await sharp(base).toFile(dir+'/SCI-scene-products.png');
const text=svg('<style>text{font-family:Archivo;font-weight:700;fill:#20262c}</style><text x="100" y="360" font-size="138">Oral care.</text><text x="100" y="508" font-size="138">Expertly considered.</text><text x="104" y="626" font-size="66">Toothbrushes · Toothpastes</text><text x="104" y="740" font-size="66">dasexperten.com</text><g font-size="60" style="fill:#000000"><text style="fill:#000000" x="1615" y="735">Five-enzyme formula</text><text style="fill:#000000" x="2430" y="735">Spiral PBT bristles</text></g><g stroke="#20262c" stroke-width="2" fill="none"><path d="M1735 681v-54"/><path d="M2840 681v-60l155-118"/></g>');
await sharp(base).composite([{input:logo,left:100,top:80},{input:text}]).png().toFile(dir+'/RangeMe-SCI-3200.png');
await sharp(dir+'/RangeMe-SCI-3200.png').resize(1600,400).jpeg({quality:95}).toFile(dir+'/RangeMe-SCI-1600.jpg');await sharp(dir+'/RangeMe-SCI-3200.png').resize(390).png().toFile(dir+'/RangeMe-SCI-390.png');
console.log('done',await sharp(pack).metadata());
})();
