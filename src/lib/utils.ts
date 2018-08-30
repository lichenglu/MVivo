export const trimText = (
  str?: string,
  mode: 'middle' | 'tail' = 'middle',
  maxLen = 20
) => {
  if (!str) return '';
  const length = str.length;
  const shouldTrim = length > maxLen;
  if (mode === 'middle') {
    return shouldTrim
      ? `${str.slice(0, maxLen / 2)}...${str.slice(-(maxLen / 2))}`
      : str;
  }

  if (mode === 'tail') {
    return shouldTrim ? `${str.slice(0, maxLen)}...` : str;
  }

  console.log('[trimText] invalid mode. Can only be middle or tail');
  return str;
};
