import fs from 'fs';
import zlib from 'zlib';

const pdfPath = process.argv[2] || 'C:/Users/USER/Downloads/Ekaya Final report V.1.pdf';
const outPath = process.argv[3] || 'ekaya-extracted.txt';

const buffer = fs.readFileSync(pdfPath);
const source = buffer.toString('latin1');

function decodeStream(raw, header) {
  const data = Buffer.from(raw, 'latin1');
  if (/\/FlateDecode\b/.test(header)) {
    return zlib.inflateSync(data).toString('latin1');
  }
  return data.toString('latin1');
}

function getStreams() {
  const streams = [];
  const re = /stream\r?\n([\s\S]*?)\r?\n?endstream/g;
  let match;
  while ((match = re.exec(source))) {
    const headerStart = Math.max(0, match.index - 900);
    const header = source.slice(headerStart, match.index);
    let decoded = '';
    try {
      decoded = decodeStream(match[1], header);
    } catch {
      continue;
    }
    streams.push({ index: match.index, header, decoded });
  }
  return streams;
}

function hexToUtf16(hex) {
  const clean = hex.replace(/\s+/g, '');
  let out = '';
  for (let i = 0; i < clean.length; i += 4) {
    const unit = clean.slice(i, i + 4);
    if (unit.length === 4) out += String.fromCharCode(parseInt(unit, 16));
  }
  return out;
}

function parseCMap(text) {
  const map = new Map();
  const bfchar = /beginbfchar([\s\S]*?)endbfchar/g;
  let match;
  while ((match = bfchar.exec(text))) {
    const lineRe = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g;
    let pair;
    while ((pair = lineRe.exec(match[1]))) {
      map.set(parseInt(pair[1], 16), hexToUtf16(pair[2]));
    }
  }

  const bfrange = /beginbfrange([\s\S]*?)endbfrange/g;
  while ((match = bfrange.exec(text))) {
    const rangeRe = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(?:<([0-9A-Fa-f]+)>|\[([^\]]+)\])/g;
    let range;
    while ((range = rangeRe.exec(match[1]))) {
      const start = parseInt(range[1], 16);
      const end = parseInt(range[2], 16);
      if (range[3]) {
        let target = parseInt(range[3], 16);
        for (let code = start; code <= end; code += 1) {
          map.set(code, String.fromCharCode(target));
          target += 1;
        }
      } else if (range[4]) {
        const vals = [...range[4].matchAll(/<([0-9A-Fa-f]+)>/g)].map((m) => hexToUtf16(m[1]));
        for (let code = start, i = 0; code <= end && i < vals.length; code += 1, i += 1) {
          map.set(code, vals[i]);
        }
      }
    }
  }
  return map;
}

const streams = getStreams();

const cmapByObject = new Map();
for (const stream of streams) {
  if (/begincmap/.test(stream.decoded)) {
    const objectMatch = /(\d+)\s+0\s+obj\s*[\s\S]{0,200}$/.exec(stream.header);
    if (objectMatch) cmapByObject.set(objectMatch[1], parseCMap(stream.decoded));
  }
}

const fontObjectToCMap = new Map();
const objectRe = /(\d+)\s+0\s+obj([\s\S]*?)endobj/g;
let objectMatch;
while ((objectMatch = objectRe.exec(source))) {
  const body = objectMatch[2];
  if (!/\/Type\s*\/Font\b/.test(body)) continue;
  const unicodeRef = /\/ToUnicode\s+(\d+)\s+0\s+R/.exec(body);
  if (!unicodeRef) continue;
  const cmap = cmapByObject.get(unicodeRef[1]);
  if (cmap) fontObjectToCMap.set(objectMatch[1], cmap);
}

const fontNameToCMap = new Map();
const resourceFontRe = /\/(F\d+)\s+(\d+)\s+0\s+R/g;
let resMatch;
while ((resMatch = resourceFontRe.exec(source))) {
  const cmap = fontObjectToCMap.get(resMatch[2]);
  if (cmap) fontNameToCMap.set(resMatch[1], cmap);
}

function decodePdfString(value, currentFont) {
  const cmap = fontNameToCMap.get(currentFont);
  if (!cmap) return '';
  const clean = value.replace(/\s+/g, '');
  let out = '';
  for (let i = 0; i < clean.length; i += 4) {
    const code = parseInt(clean.slice(i, i + 4), 16);
    out += cmap.get(code) ?? '';
  }
  return out;
}

function decodeLiteral(value) {
  return value
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

function cleanLine(line) {
  return line
    .replace(/\u0000/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s+([,.;:%])/g, '$1')
    .trim();
}

function extractBlockText(block) {
  let currentFont = '';
  let out = '';
  const tokenRe =
    /\/(F\d+)\s+[-+]?\d*\.?\d+\s+Tf|<([0-9A-Fa-f\s]+)>\s*Tj|\(([^()]*(?:\\.[^()]*)*)\)\s*Tj|\[([\s\S]*?)\]\s*TJ/g;
  let token;
  while ((token = tokenRe.exec(block))) {
    if (token[1]) {
      currentFont = token[1];
    } else if (token[2]) {
      out += decodePdfString(token[2], currentFont);
    } else if (token[3]) {
      out += decodeLiteral(token[3]);
    } else if (token[4]) {
      const inner = token[4];
      let innerToken;
      const innerRe = /<([0-9A-Fa-f\s]+)>|\(([^()]*(?:\\.[^()]*)*)\)|(-?\d+(?:\.\d+)?)/g;
      while ((innerToken = innerRe.exec(inner))) {
        if (innerToken[1]) out += decodePdfString(innerToken[1], currentFont);
        else if (innerToken[2]) out += decodeLiteral(innerToken[2]);
        else if (Number(innerToken[3]) < -120) out += ' ';
      }
    }
  }
  return cleanLine(out);
}

const pages = [];

for (const stream of streams) {
  const text = stream.decoded;
  if (!/\bBT\b/.test(text) || !/\bT[Jj]\b/.test(text)) continue;

  const blockRe = /q\b([\s\S]*?)\bQ/g;
  let blockMatch;
  const lines = [];
  while ((blockMatch = blockRe.exec(text))) {
    if (!/\bBT\b/.test(blockMatch[1])) continue;
    const line = extractBlockText(blockMatch[1]);
    if (line) lines.push(line);
  }

  if (!lines.length) {
    const fallback = extractBlockText(text);
    if (fallback) lines.push(fallback);
  }

  const joined = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  if (!joined) continue;
  pages.push(joined);
}

let output = pages
  .map((p, i) => `--- PAGE ${i + 1} ---\n${p}`)
  .join('\n\n')
  .replace(/\n{4,}/g, '\n\n\n');

fs.writeFileSync(outPath, output, 'utf8');
console.log(`Extracted ${pages.length} page-like sections to ${outPath}`);
console.log(output.slice(0, 4000));
