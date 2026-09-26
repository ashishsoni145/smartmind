/**
 * Minimal ZIP reader for APK/AAB auditing.
 *
 * Both artifacts are ZIP archives. This avoids shelling out to `unzip`/`jar` so the security audit
 * runs identically on Windows, macOS, Linux and CI with nothing but Node installed.
 *
 * Supports STORED (0) and DEFLATED (8) entries, ZIP64 sizes/offsets and data descriptors, which is
 * everything AGP produces. Encryption is not expected and is reported rather than silently skipped.
 */
import fs from 'node:fs';
import zlib from 'node:zlib';

const EOCD_SIGNATURE = 0x06054b50;
const EOCD64_LOCATOR_SIGNATURE = 0x07064b50;
const EOCD64_SIGNATURE = 0x06064b50;
const CENTRAL_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;

function findEndOfCentralDirectory(buffer) {
  // EOCD is 22 bytes minimum and sits at the end, followed by an optional comment (max 64 KiB).
  const floor = Math.max(0, buffer.length - 22 - 0xffff);
  for (let offset = buffer.length - 22; offset >= floor; offset -= 1) {
    if (buffer.readUInt32LE(offset) === EOCD_SIGNATURE) return offset;
  }
  return -1;
}

function readZip64Locator(buffer, eocdOffset) {
  const locatorOffset = eocdOffset - 20;
  if (locatorOffset < 0 || buffer.readUInt32LE(locatorOffset) !== EOCD64_LOCATOR_SIGNATURE) return null;
  const eocd64Offset = Number(buffer.readBigUInt64LE(locatorOffset + 8));
  if (eocd64Offset < 0 || eocd64Offset + 56 > buffer.length) return null;
  if (buffer.readUInt32LE(eocd64Offset) !== EOCD64_SIGNATURE) return null;
  return {
    totalEntries: Number(buffer.readBigUInt64LE(eocd64Offset + 32)),
    centralSize: Number(buffer.readBigUInt64LE(eocd64Offset + 40)),
    centralOffset: Number(buffer.readBigUInt64LE(eocd64Offset + 48)),
  };
}

/**
 * @param {string} filePath
 * @returns {{ buffer: Buffer, entries: Array<object> }}
 */
export function readZip(filePath) {
  const buffer = fs.readFileSync(filePath);
  const eocdOffset = findEndOfCentralDirectory(buffer);
  if (eocdOffset < 0) throw new Error(`${filePath}: not a ZIP archive (no end-of-central-directory record)`);

  let totalEntries = buffer.readUInt16LE(eocdOffset + 10);
  let centralSize = buffer.readUInt32LE(eocdOffset + 12);
  let centralOffset = buffer.readUInt32LE(eocdOffset + 16);

  const zip64 = readZip64Locator(buffer, eocdOffset);
  if (zip64) {
    if (totalEntries === 0xffff) totalEntries = zip64.totalEntries;
    if (centralSize === 0xffffffff) centralSize = zip64.centralSize;
    if (centralOffset === 0xffffffff) centralOffset = zip64.centralOffset;
  }

  const entries = [];
  let cursor = centralOffset;
  const limit = Math.min(buffer.length, centralOffset + centralSize + 0x10000);
  while (cursor + 46 <= limit && buffer.readUInt32LE(cursor) === CENTRAL_SIGNATURE) {
    const flags = buffer.readUInt16LE(cursor + 8);
    const method = buffer.readUInt16LE(cursor + 10);
    const crc32 = buffer.readUInt32LE(cursor + 16);
    let compressedSize = buffer.readUInt32LE(cursor + 20);
    let uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    let localOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.toString('utf8', cursor + 46, cursor + 46 + nameLength);

    if (compressedSize === 0xffffffff || uncompressedSize === 0xffffffff || localOffset === 0xffffffff) {
      let at = cursor + 46 + nameLength;
      const end = at + extraLength;
      while (at + 4 <= end) {
        const tag = buffer.readUInt16LE(at);
        const size = buffer.readUInt16LE(at + 2);
        if (tag === 0x0001) {
          let value = at + 4;
          if (uncompressedSize === 0xffffffff && value + 8 <= end) {
            uncompressedSize = Number(buffer.readBigUInt64LE(value));
            value += 8;
          }
          if (compressedSize === 0xffffffff && value + 8 <= end) {
            compressedSize = Number(buffer.readBigUInt64LE(value));
            value += 8;
          }
          if (localOffset === 0xffffffff && value + 8 <= end) {
            localOffset = Number(buffer.readBigUInt64LE(value));
            value += 8;
          }
          break;
        }
        at += 4 + size;
      }
    }

    entries.push({
      name,
      method,
      flags,
      crc32,
      compressedSize,
      uncompressedSize,
      localOffset,
      encrypted: (flags & 0x1) !== 0,
    });
    cursor = cursor + 46 + nameLength + extraLength + commentLength;
    if (entries.length >= totalEntries && totalEntries > 0) break;
  }

  if (entries.length === 0) throw new Error(`${filePath}: ZIP archive has no readable entries`);
  return { buffer, entries };
}

/** @returns {Buffer|null} uncompressed bytes, or null when the entry cannot be decoded */
export function readEntry(zip, entry) {
  const { buffer } = zip;
  const at = entry.localOffset;
  if (at + 30 > buffer.length || buffer.readUInt32LE(at) !== LOCAL_SIGNATURE) return null;
  const nameLength = buffer.readUInt16LE(at + 26);
  const extraLength = buffer.readUInt16LE(at + 28);
  const start = at + 30 + nameLength + extraLength;
  const end = start + entry.compressedSize;
  if (end > buffer.length) return null;
  if (entry.encrypted) return null;
  const slice = buffer.subarray(start, end);
  if (entry.method === 0) return Buffer.from(slice);
  if (entry.method === 8) {
    try {
      return zlib.inflateRawSync(slice);
    } catch {
      return null;
    }
  }
  return null;
}

export function readEntryText(zip, entry) {
  const bytes = readEntry(zip, entry);
  return bytes ? bytes.toString('utf8') : null;
}

// --------------------------------------------------------------------------------------------
// Writing (used only by the auditor's self test, which builds throwaway fixtures)
// --------------------------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value;
  }
  return table;
})();

export function crc32(buffer) {
  let crc = -1;
  for (let index = 0; index < buffer.length; index += 1) {
    crc = CRC_TABLE[(crc ^ buffer[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
}

/**
 * @param {string} filePath
 * @param {Array<{name:string, data:Buffer, method?:0|8}>} files
 */
export function writeZip(filePath, files) {
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const file of files) {
    const nameBuffer = Buffer.from(file.name, 'utf8');
    const method = file.method ?? 8;
    const stored = method === 8 ? zlib.deflateRawSync(file.data) : file.data;
    const crc = crc32(file.data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(LOCAL_SIGNATURE, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(0, 10); // mod time
    local.writeUInt16LE(0x21, 12); // mod date (1996-01-01)
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(stored.length, 18);
    local.writeUInt32LE(file.data.length, 22);
    local.writeUInt16LE(nameBuffer.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, nameBuffer, stored);

    const header = Buffer.alloc(46);
    header.writeUInt32LE(CENTRAL_SIGNATURE, 0);
    header.writeUInt16LE(20, 4); // version made by
    header.writeUInt16LE(20, 6); // version needed
    header.writeUInt16LE(0, 8);
    header.writeUInt16LE(method, 10);
    header.writeUInt16LE(0, 12);
    header.writeUInt16LE(0x21, 14);
    header.writeUInt32LE(crc, 16);
    header.writeUInt32LE(stored.length, 20);
    header.writeUInt32LE(file.data.length, 24);
    header.writeUInt16LE(nameBuffer.length, 28);
    header.writeUInt16LE(0, 30);
    header.writeUInt16LE(0, 32);
    header.writeUInt16LE(0, 34);
    header.writeUInt16LE(0, 36);
    header.writeUInt32LE(0, 38);
    header.writeUInt32LE(offset, 42);
    central.push(Buffer.concat([header, nameBuffer]));

    offset += local.length + nameBuffer.length + stored.length;
  }

  const centralBuffer = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(EOCD_SIGNATURE, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBuffer.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  fs.writeFileSync(filePath, Buffer.concat([...chunks, centralBuffer, eocd]));
  return filePath;
}
