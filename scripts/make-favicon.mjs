// Generates app/favicon.ico from app/icon.svg (leaf logo) using sharp.
// ICO container embeds a 32x32 PNG (valid for all modern browsers + Windows).
// Run: node scripts/make-favicon.mjs
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "app", "icon.svg"));

const size = 32;
const png = await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

// Build a minimal ICO (1 image, PNG-encoded payload).
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count

const entry = Buffer.alloc(16);
entry.writeUInt8(size, 0);            // width
entry.writeUInt8(size, 1);            // height
entry.writeUInt8(0, 2);               // color palette
entry.writeUInt8(0, 3);               // reserved
entry.writeUInt16LE(1, 4);            // color planes
entry.writeUInt16LE(32, 6);           // bits per pixel
entry.writeUInt32LE(png.length, 8);   // size of image data
entry.writeUInt32LE(6 + 16, 12);      // offset of image data

writeFileSync(join(root, "app", "favicon.ico"), Buffer.concat([header, entry, png]));
console.log(`favicon.ico written (${png.length} bytes PNG payload)`);
