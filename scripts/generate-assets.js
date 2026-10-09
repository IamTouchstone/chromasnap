const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 implementation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const rowBytes = width * 4;
  const filtered = Buffer.alloc(height * (rowBytes + 1));
  for (let y = 0; y < height; y++) {
    const srcOffset = y * rowBytes;
    const dstOffset = y * (rowBytes + 1);
    filtered[dstOffset] = 0; // Filter 0 (None)
    rgbaBuffer.copy(filtered, dstOffset + 1, srcOffset, srcOffset + rowBytes);
  }

  const compressed = zlib.deflateSync(filtered, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// 2D Software Drawing Canvas
class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.buffer = Buffer.alloc(width * height * 4);
  }

  fill(r, g, b, a = 255) {
    for (let i = 0; i < this.buffer.length; i += 4) {
      this.buffer[i] = r;
      this.buffer[i + 1] = g;
      this.buffer[i + 2] = b;
      this.buffer[i + 3] = a;
    }
  }

  setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const idx = (y * this.width + x) * 4;
    if (a === 255) {
      this.buffer[idx] = r;
      this.buffer[idx + 1] = g;
      this.buffer[idx + 2] = b;
      this.buffer[idx + 3] = 255;
    } else {
      const alpha = a / 255;
      const invAlpha = 1 - alpha;
      this.buffer[idx] = Math.round(r * alpha + this.buffer[idx] * invAlpha);
      this.buffer[idx + 1] = Math.round(g * alpha + this.buffer[idx + 1] * invAlpha);
      this.buffer[idx + 2] = Math.round(b * alpha + this.buffer[idx + 2] * invAlpha);
      this.buffer[idx + 3] = 255;
    }
  }

  // Draw rounded rectangle
  drawRoundedRect(rx, ry, rw, rh, radius, r, g, b, a = 255) {
    const x1 = Math.round(rx);
    const y1 = Math.round(ry);
    const x2 = Math.round(rx + rw);
    const y2 = Math.round(ry + rh);
    const rad = Math.min(radius, rw / 2, rh / 2);

    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        let inside = true;
        // Check 4 corners
        if (x < x1 + rad && y < y1 + rad) {
          const dx = x - (x1 + rad);
          const dy = y - (y1 + rad);
          if (dx * dx + dy * dy > rad * rad) inside = false;
        } else if (x >= x2 - rad && y < y1 + rad) {
          const dx = x - (x2 - rad);
          const dy = y - (y1 + rad);
          if (dx * dx + dy * dy > rad * rad) inside = false;
        } else if (x < x1 + rad && y >= y2 - rad) {
          const dx = x - (x1 + rad);
          const dy = y - (y2 - rad);
          if (dx * dx + dy * dy > rad * rad) inside = false;
        } else if (x >= x2 - rad && y >= y2 - rad) {
          const dx = x - (x2 - rad);
          const dy = y - (y2 - rad);
          if (dx * dx + dy * dy > rad * rad) inside = false;
        }

        if (inside) {
          this.setPixel(x, y, r, g, b, a);
        }
      }
    }
  }

  // Draw circle
  drawCircle(cx, cy, radius, r, g, b, a = 255) {
    const x1 = Math.floor(cx - radius);
    const x2 = Math.ceil(cx + radius);
    const y1 = Math.floor(cy - radius);
    const y2 = Math.ceil(cy + radius);
    const r2 = radius * radius;

    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= r2) {
          this.setPixel(x, y, r, g, b, a);
        }
      }
    }
  }

  toPNG() {
    return encodePNG(this.width, this.height, this.buffer);
  }
}

// Colors from PRD:
// Dark charcoal background: #101010 -> (16, 16, 16)
// RED = 1 #FF3B30 -> (255, 59, 48)
// BLUE = 2 #2F80FF -> (47, 128, 255)
// YELLOW = 3 #FFD60A -> (255, 214, 10)
// GREEN = 4 #34C759 -> (52, 199, 89)
// PURPLE = 5 #AF52DE -> (175, 82, 222)
const BG = [16, 16, 16];
const RED = [255, 59, 48];
const BLUE = [47, 128, 255];
const YELLOW = [255, 214, 10];
const GREEN = [52, 199, 89];
const PURPLE = [175, 82, 222];
const WHITE = [255, 255, 255];

// Generate App Icon (1024x1024)
// Distinctive geometric composition:
// A crisp 3x3 layout with signature snap arrangement showcasing the 5 Chroma Snap colours
function generateIcon() {
  const size = 1024;
  const canvas = new Canvas(size, size);
  canvas.fill(...BG);

  // Center emblem: 640x640 total footprint
  const emblemSize = 640;
  const startX = (size - emblemSize) / 2; // 192
  const startY = (size - emblemSize) / 2; // 192

  // 3x3 block layout, each block 180px with 30px gap: 180*3 + 30*2 = 540 + 60 = 600
  const bSize = 186;
  const gap = 28;
  const offset = (emblemSize - (bSize * 3 + gap * 2)) / 2;
  const ox = startX + offset;
  const oy = startY + offset;
  const cornerRadius = 36;

  // Pattern:
  // [ RED    ] [ BLUE   ] [ YELLOW ]
  // [ GREEN  ] [ PURPLE ] [ RED    ]
  // [ BLUE   ] [ YELLOW ] [ GREEN  ]
  const pattern = [
    [RED, BLUE, YELLOW],
    [GREEN, PURPLE, RED],
    [BLUE, YELLOW, GREEN],
  ];

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const x = ox + c * (bSize + gap);
      const y = oy + r * (bSize + gap);
      const color = pattern[r][c];
      canvas.drawRoundedRect(x, y, bSize, bSize, cornerRadius, ...color);

      // Value dot pattern inside each block!
      const cx = x + bSize / 2;
      const cy = y + bSize / 2;
      const dotColor = (color === YELLOW) ? [20, 20, 20] : WHITE;
      const dotR = 12;

      // Determine dot count based on color
      let dots = 1;
      if (color === RED) dots = 1;
      else if (color === BLUE) dots = 2;
      else if (color === YELLOW) dots = 3;
      else if (color === GREEN) dots = 4;
      else if (color === PURPLE) dots = 5;

      if (dots === 1) {
        canvas.drawCircle(cx, cy, dotR, ...dotColor);
      } else if (dots === 2) {
        canvas.drawCircle(cx - 32, cy, dotR, ...dotColor);
        canvas.drawCircle(cx + 32, cy, dotR, ...dotColor);
      } else if (dots === 3) {
        canvas.drawCircle(cx - 40, cy + 24, dotR, ...dotColor);
        canvas.drawCircle(cx, cy - 30, dotR, ...dotColor);
        canvas.drawCircle(cx + 40, cy + 24, dotR, ...dotColor);
      } else if (dots === 4) {
        canvas.drawCircle(cx - 32, cy - 32, dotR, ...dotColor);
        canvas.drawCircle(cx + 32, cy - 32, dotR, ...dotColor);
        canvas.drawCircle(cx - 32, cy + 32, dotR, ...dotColor);
        canvas.drawCircle(cx + 32, cy + 32, dotR, ...dotColor);
      } else if (dots === 5) {
        canvas.drawCircle(cx, cy, dotR, ...dotColor);
        canvas.drawCircle(cx - 36, cy - 36, dotR, ...dotColor);
        canvas.drawCircle(cx + 36, cy - 36, dotR, ...dotColor);
        canvas.drawCircle(cx - 36, cy + 36, dotR, ...dotColor);
        canvas.drawCircle(cx + 36, cy + 36, dotR, ...dotColor);
      }
    }
  }

  return canvas.toPNG();
}

// Generate Splash (1024x1024)
function generateSplash() {
  const size = 1024;
  const canvas = new Canvas(size, size);
  canvas.fill(...BG);

  // Centered 2x2 iconic logo mark + 5th accent block
  const bSize = 140;
  const gap = 20;
  const totalW = bSize * 2 + gap;
  const cx = size / 2;
  const cy = size / 2 - 40;
  const ox = cx - totalW / 2;
  const oy = cy - totalW / 2;
  const cornerRadius = 28;

  // 4 blocks forming geometric core: RED, BLUE, GREEN, PURPLE, with YELLOW accent
  canvas.drawRoundedRect(ox, oy, bSize, bSize, cornerRadius, ...RED);
  canvas.drawRoundedRect(ox + bSize + gap, oy, bSize, bSize, cornerRadius, ...BLUE);
  canvas.drawRoundedRect(ox, oy + bSize + gap, bSize, bSize, cornerRadius, ...GREEN);
  canvas.drawRoundedRect(ox + bSize + gap, oy + bSize + gap, bSize, bSize, cornerRadius, ...PURPLE);

  // Center snap diamond in YELLOW
  const dotR = 26;
  canvas.drawCircle(cx, cy, dotR, ...YELLOW);

  return canvas.toPNG();
}

// Generate Favicon (48x48)
function generateFavicon() {
  const size = 48;
  const canvas = new Canvas(size, size);
  canvas.fill(...BG);

  const bSize = 18;
  const gap = 4;
  const ox = 4;
  const oy = 4;
  const rad = 4;

  canvas.drawRoundedRect(ox, oy, bSize, bSize, rad, ...RED);
  canvas.drawRoundedRect(ox + bSize + gap, oy, bSize, bSize, rad, ...BLUE);
  canvas.drawRoundedRect(ox, oy + bSize + gap, bSize, bSize, rad, ...GREEN);
  canvas.drawRoundedRect(ox + bSize + gap, oy + bSize + gap, bSize, bSize, rad, ...PURPLE);

  return canvas.toPNG();
}

const outDir = path.join(__dirname, '..', 'assets', 'images');
fs.writeFileSync(path.join(outDir, 'icon.png'), generateIcon());
fs.writeFileSync(path.join(outDir, 'adaptive-icon.png'), generateIcon());
fs.writeFileSync(path.join(outDir, 'splash.png'), generateSplash());
fs.writeFileSync(path.join(outDir, 'favicon.png'), generateFavicon());

console.log('Successfully generated all icon & splash images in assets/images!');
