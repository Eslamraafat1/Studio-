import fs from "fs"; import sharp from "sharp";
const files = ["projects","materials","studio"].flatMap(d => fs.readdirSync(`public/images/${d}`).map(f => `public/images/${d}/${f}`));
const cw = 400, ch = 260, cols = 5, rows = Math.ceil(files.length/cols);
const comps = [];
for (let i=0;i<files.length;i++){ const b = await sharp(files[i]).resize(cw,ch,{fit:"cover"}).toBuffer();
  comps.push({input:b,left:(i%cols)*cw,top:Math.floor(i/cols)*ch});
  comps.push({input:Buffer.from(`<svg width="260" height="22"><rect width="260" height="22" fill="black"/><text x="4" y="16" font-size="13" fill="white" font-family="Arial">${files[i].replace("public/images/","")}</text></svg>`),left:(i%cols)*cw,top:Math.floor(i/cols)*ch}); }
await sharp({create:{width:cw*cols,height:ch*rows,channels:3,background:"#fff"}}).composite(comps).jpeg({quality:72}).toFile(process.env.TEMP+"/all.jpg");
