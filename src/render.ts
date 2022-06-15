export function byteRender(byte: number) {
  const k = byte / 1024;
  if (k < 1024) {
    return `${k.toFixed(2)} KB`;
  }
  const m = k / 1024;
  if (m < 1024) {
    return `${m.toFixed(2)} MB`;
  }
  const g = m / 1024;
  if (g < 1024) {
    return `${g.toFixed(2)} GB`;
  }
  const t = g / 1024;
  return `${t.toFixed(2)} TB`;
}
