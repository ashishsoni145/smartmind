/**
 * Sniffs the image type from the first bytes instead of trusting a file extension.
 * Only the formats the backend upload schema accepts are returned; anything else is null
 * so the caller refuses the attachment rather than mislabelling it.
 */
export type SniffedImage = { mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'; extension: 'jpg' | 'png' | 'webp' | 'gif' };

export function sniffImageType(bytes: Uint8Array): SniffedImage | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mimeType: 'image/jpeg', extension: 'jpg' };
  }
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) {
    return { mimeType: 'image/png', extension: 'png' };
  }
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') {
    return { mimeType: 'image/webp', extension: 'webp' };
  }
  if (bytes.length >= 6 && (ascii(bytes, 0, 6) === 'GIF87a' || ascii(bytes, 0, 6) === 'GIF89a')) {
    return { mimeType: 'image/gif', extension: 'gif' };
  }
  return null;
}

function ascii(bytes: Uint8Array, start: number, end: number): string {
  let out = '';
  for (let i = start; i < end; i += 1) out += String.fromCharCode(bytes[i]);
  return out;
}
