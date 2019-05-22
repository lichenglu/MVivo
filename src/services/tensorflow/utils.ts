/**
 * standardizeText
 * A function that would standardize texts by stripping off non-alphanumeric characters
 * and will convert texts to lowercase
 * e.g.
 * From "$he$llo w.o'r'_ld \"asd\" @asd 1:23" to "hello world asd asd 1:23"
 * @param {string} text - Text that you want to normalize
 * @returns {string} Standardized string
 */
export function standardizeText(text: string) {
  return (
    text
      .replace('@', 'at')
      // /([^\w\d\s:]|_)/g strips all non-alphanumeric values except spaces and colons
      .replace(/([^\w\d\s:]|_)/g, '')
      .toLowerCase()
  );
}

/**
 * padSequence
 * A function that is useful for models such as RNN and CNN, which often require sequence as input.
 * Because model was trained with padded sequence, meaning filling sequence with a specific value if
 * sequence length is smaller than the maximum sequence length
 * @param {number[]} seq - A sequence of number that you want to pad
 * @param {number} value - Value you want to use to pad
 * @param {number} maxLen - The maximum length a sequence can have
 * @returns {number[]} Padded sequence
 */
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
