export function standardizeText(text: string) {
  return text.toLowerCase();
}

export function padSequence(
  seq: number[],
  value: number = 0,
  maxLen: number = 55
) {
  let encoded = [...seq];
  const curLen = encoded.length;
  if (curLen < maxLen) {
    encoded = [...encoded, ...Array(maxLen - curLen).fill(value)];
  } else {
    encoded = encoded.slice(0, maxLen);
  }
  return encoded;
}
