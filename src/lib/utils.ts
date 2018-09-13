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

export const export2Word = ({
  containerID,
  element,
  docName = 'document',
  tableStyle,
}: {
  containerID: string;
  element: HTMLElement | null;
  docName?: string;
  tableStyle?: string;
}) => {
  if (!window.Blob) {
    alert('Your legacy browser does not support this action.');
    return;
  }

  if (!element) {
    alert('No element found. Make sure the element is still alive');
    return;
  }

  const defaultTableStyle = `  
    table {
      border-collapse: collapse;

      border-top: 4px solid black;
      border-bottom: 4px solid black;
      border-right: none;
      border-left: none;

      font-size: 12px;
    }
    th {
      border-top: 4px solid black;
      border-bottom: 1px solid black;
      border-right: none;
      border-left: none;
      font-weight: 500;
    }

    td {
      border: none;
    }
  `;

  const css = `<style>
  @page ${containerID} {
    size: 11.0in 8.5in;
    mso-page-orientation: landscape;
  }
  #${containerID} {
    page: ${containerID};
  }
  ${tableStyle || defaultTableStyle}
  </style>`;

  const html = element.innerHTML;
  const blob = new Blob(['\ufeff', css + html], {
    type: 'application/msword',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a') as HTMLAnchorElement;
  link.href = url;
  link.download = docName; // default name without extension
  document.body.appendChild(link);
  if (navigator.msSaveOrOpenBlob)
    navigator.msSaveOrOpenBlob(blob, `${docName}.doc`);
  // IE10-11
  else link.click(); // other browsers
  document.body.removeChild(link);
};
