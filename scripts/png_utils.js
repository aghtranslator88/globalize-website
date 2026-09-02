const fs = require('fs');
const zlib = require('zlib');

function decodePNG(buffer) {
  let offset = 8;
  let width, height;
  const idatChunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.slice(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  const compressedData = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressedData);
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const rawData = Buffer.alloc(width * height * bytesPerPixel);

  let srcPos = 0;
  let dstPos = 0;

  for (let y = 0; y < height; y++) {
    const filterType = decompressed[srcPos++];
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < bytesPerPixel; c++) {
        const rawByte = decompressed[srcPos++];
        let left = x > 0 ? rawData[dstPos - bytesPerPixel] : 0;
        let up = y > 0 ? rawData[dstPos - stride] : 0;
        let upLeft = (x > 0 && y > 0) ? rawData[dstPos - stride - bytesPerPixel] : 0;

        let val = 0;
        if (filterType === 0) val = rawByte;
        else if (filterType === 1) val = (rawByte + left) & 0xff;
        else if (filterType === 2) val = (rawByte + up) & 0xff;
        else if (filterType === 3) val = (rawByte + Math.floor((left + up) / 2)) & 0xff;
        else if (filterType === 4) {
          const p = left + up - upLeft;
          const pa = Math.abs(p - left);
          const pb = Math.abs(p - up);
          const pc = Math.abs(p - upLeft);
          let pr = (pa <= pb && pa <= pc) ? left : (pb <= pc ? up : upLeft);
          val = (rawByte + pr) & 0xff;
        }
        rawData[dstPos++] = val;
      }
    }
  }
  return { width, height, data: rawData };
}

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = Buffer.alloc(4 + len);
  typeAndData.write(type, 0, 4, 'ascii');
  data.copy(typeAndData, 4);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function encodePNG(width, height, rgbaBuffer) {
  const stride = width * 4;
  const filtered = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    filtered[y * (stride + 1)] = 0; // Filter None
    rgbaBuffer.copy(filtered, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const deflated = zlib.deflateSync(filtered, { level: 9 });
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(6, 9);
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', deflated),
    createChunk('IEND', Buffer.alloc(0))
  ]);
}

function resizeRGBA(src, srcW, srcH, dstW, dstH) {
  const dst = Buffer.alloc(dstW * dstH * 4);
  const xRatio = srcW / dstW;
  const yRatio = srcH / dstH;

  for (let dy = 0; dy < dstH; dy++) {
    for (let dx = 0; dx < dstW; dx++) {
      const gx = (dx + 0.5) * xRatio - 0.5;
      const gy = (dy + 0.5) * yRatio - 0.5;

      const gxi = Math.floor(gx);
      const gyi = Math.floor(gy);

      const xDiff = gx - gxi;
      const yDiff = gy - gyi;

      let r = 0, g = 0, b = 0, a = 0;
      let totalWeight = 0;

      for (let cy = 0; cy <= 1; cy++) {
        for (let cx = 0; cx <= 1; cx++) {
          const sx = Math.max(0, Math.min(srcW - 1, gxi + cx));
          const sy = Math.max(0, Math.min(srcH - 1, gyi + cy));
          const sIdx = (sy * srcW + sx) * 4;

          const weight = (cx === 0 ? 1 - xDiff : xDiff) * (cy === 0 ? 1 - yDiff : yDiff);
          const sa = src[sIdx + 3] / 255;

          r += src[sIdx] * weight * sa;
          g += src[sIdx + 1] * weight * sa;
          b += src[sIdx + 2] * weight * sa;
          a += src[sIdx + 3] * weight;
          totalWeight += weight * sa;
        }
      }

      const dIdx = (dy * dstW + dx) * 4;
      if (totalWeight > 0.001) {
        dst[dIdx] = Math.round(r / totalWeight);
        dst[dIdx + 1] = Math.round(g / totalWeight);
        dst[dIdx + 2] = Math.round(b / totalWeight);
        dst[dIdx + 3] = Math.round(Math.min(255, a));
      } else {
        dst[dIdx] = 0;
        dst[dIdx + 1] = 0;
        dst[dIdx + 2] = 0;
        dst[dIdx + 3] = 0;
      }
    }
  }
  return dst;
}

function renderCentered(srcData, srcW, srcH, bMinX, bMaxX, bMinY, bMaxY, targetSize, paddingRatio = 0.04) {
  const bW = bMaxX - bMinX + 1;
  const bH = bMaxY - bMinY + 1;

  const cropped = Buffer.alloc(bW * bH * 4);
  for (let y = 0; y < bH; y++) {
    for (let x = 0; x < bW; x++) {
      const sIdx = ((bMinY + y) * srcW + (bMinX + x)) * 4;
      const dIdx = (y * bW + x) * 4;
      cropped[dIdx] = srcData[sIdx];
      cropped[dIdx + 1] = srcData[sIdx + 1];
      cropped[dIdx + 2] = srcData[sIdx + 2];
      cropped[dIdx + 3] = srcData[sIdx + 3];
    }
  }

  const availableSize = Math.round(targetSize * (1 - 2 * paddingRatio));
  const scale = availableSize / Math.max(bW, bH);
  const scaledW = Math.round(bW * scale);
  const scaledH = Math.round(bH * scale);

  const scaled = resizeRGBA(cropped, bW, bH, scaledW, scaledH);

  const square = Buffer.alloc(targetSize * targetSize * 4);
  const offsetX = Math.floor((targetSize - scaledW) / 2);
  const offsetY = Math.floor((targetSize - scaledH) / 2);

  for (let y = 0; y < scaledH; y++) {
    for (let x = 0; x < scaledW; x++) {
      const sIdx = (y * scaledW + x) * 4;
      const dIdx = ((offsetY + y) * targetSize + (offsetX + x)) * 4;
      square[dIdx] = scaled[sIdx];
      square[dIdx + 1] = scaled[sIdx + 1];
      square[dIdx + 2] = scaled[sIdx + 2];
      square[dIdx + 3] = scaled[sIdx + 3];
    }
  }
  return square;
}

function createICO(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let dirOffset = 6 + count * 16;
  const dirEntries = [];
  const imageBuffers = [];

  for (const { width, height, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(dirOffset, 12);

    dirEntries.push(entry);
    imageBuffers.push(buffer);
    dirOffset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

module.exports = {
  decodePNG,
  encodePNG,
  resizeRGBA,
  renderCentered,
  createICO
};
