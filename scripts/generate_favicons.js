const fs = require('fs');
const { decodePNG, encodePNG, renderCentered, createICO } = require('./png_utils.js');

const logo = decodePNG(fs.readFileSync('public/logo.png'));
const emblemData = Buffer.from(logo.data);

// Clear everything to the right of the emblem and inside the speech bubble where text sits
for (let y = 0; y < logo.height; y++) {
  for (let x = 0; x < logo.width; x++) {
    const idx = (y * logo.width + x) * 4;
    // Outside the emblem on the right
    if (x > 1435) {
      emblemData[idx + 3] = 0;
    }
    // Inside the speech bubble where text sits: y: 330..720, x >= 560
    if (x >= 560 && y >= 330 && y <= 720) {
      emblemData[idx + 3] = 0;
    }
  }
}

let minX = logo.width, maxX = 0, minY = logo.height, maxY = 0;
for (let y = 0; y < logo.height; y++) {
  for (let x = 0; x < logo.width; x++) {
    const idx = (y * logo.width + x) * 4;
    if (emblemData[idx + 3] > 10) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log('Emblem bounds:', { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY });

const sizes = [512, 192, 180, 64, 48, 32, 16];
const generatedPNGs = {};

for (const size of sizes) {
  const sq = renderCentered(emblemData, logo.width, logo.height, minX, maxX, minY, maxY, size, 0.04);
  const pngBuf = encodePNG(size, size, sq);
  generatedPNGs[size] = pngBuf;
}

const icoBuffer = createICO([
  { width: 16, height: 16, buffer: generatedPNGs[16] },
  { width: 32, height: 32, buffer: generatedPNGs[32] },
  { width: 48, height: 48, buffer: generatedPNGs[48] },
]);

// Write to public/
fs.writeFileSync('public/favicon.ico', icoBuffer);
fs.writeFileSync('public/logo-icon.png', generatedPNGs[512]);
fs.writeFileSync('public/icon.png', generatedPNGs[512]);
fs.writeFileSync('public/apple-icon.png', generatedPNGs[180]);

// Write to src/app/
fs.writeFileSync('src/app/favicon.ico', icoBuffer);
fs.writeFileSync('src/app/icon.png', generatedPNGs[512]);
fs.writeFileSync('src/app/apple-icon.png', generatedPNGs[180]);

console.log('Favicons generated successfully across public/ and src/app/!');
