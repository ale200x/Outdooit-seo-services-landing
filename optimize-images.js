/**
 * Optimiza imagenes para Lighthouse: redimensiona y comprime WebP.
 * Ejecutar: node optimize-images.js
 */
const fs = require('fs');
const path = require('path');

async function run() {
  const sharp = require('sharp');
  const base = path.join(__dirname, 'images');

  // Logo principal: versiones para nav (80) y footer (128)
  const outdooit = path.join(base, 'outdooit.webp');
  if (fs.existsSync(outdooit)) {
    await sharp(outdooit)
      .resize(80, 80)
      .webp({ quality: 85, effort: 6 })
      .toFile(path.join(base, 'outdooit-80.webp'));
    await sharp(outdooit)
      .resize(128, 128)
      .webp({ quality: 85, effort: 6 })
      .toFile(path.join(base, 'outdooit-128.webp'));
    console.log('Creados outdooit-80.webp, outdooit-128.webp');
  }

  // Imagen decorativa 500x500 -> 384x384 para seccion services
  const big = path.join(base, 'outdooit-500x500px.webp');
  if (fs.existsSync(big)) {
    await sharp(big)
      .resize(384, 384)
      .webp({ quality: 80, effort: 6 })
      .toFile(path.join(base, 'outdooit-384.webp'));
    console.log('Creado outdooit-384.webp');
  }

  // Logos: redimensionar y comprimir -> archivo -opt.webp (HTML usara estos)
  const logosDir = path.join(base, 'Logos');
  if (fs.existsSync(logosDir)) {
    const files = fs.readdirSync(logosDir).filter(f => f.endsWith('.webp') && !f.endsWith('-opt.webp'));
    for (const file of files) {
      const src = path.join(logosDir, file);
      const meta = await sharp(src).metadata();
      const w = meta.width || 96;
      const h = meta.height || 48;
      const maxW = 112;
      const maxH = 48;
      let nw = w, nh = h;
      if (w > maxW || h > maxH) {
        const r = Math.min(maxW / w, maxH / h);
        nw = Math.round(w * r);
        nh = Math.round(h * r);
      }
      const outName = file.replace('.webp', '-opt.webp');
      await sharp(src)
        .resize(nw, nh)
        .webp({ quality: 82, effort: 6 })
        .toFile(path.join(logosDir, outName));
      console.log('Creado', outName);
    }
  }

  console.log('Listo.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
