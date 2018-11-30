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

// https://stackoverflow.com/questions/36330859/export-html-table-as-word-file-and-change-file-orientation
export const export2Word = ({
  containerID,
  element,
  docName = 'document',
  style,
}: {
  element: HTMLElement | null;
  containerID?: string;
  docName?: string;
  style?: string;
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

  const _containerID = containerID || Date.now().toString();

  const css = `<style>
  @page ${_containerID} {
    size: 11.0in 8.5in;
    mso-page-orientation: landscape;
  }
  #${_containerID} {
    page: ${_containerID};
  }
  ${style === undefined ? defaultTableStyle : style}
  </style>`;

  let html = element.innerHTML;
  if (!containerID) {
    html = `<div id="${_containerID}">${element.innerHTML}</div>`;
  }

  html = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${docName}</title>
    </head>
    <body>
    ${html}
    </body>
  </html>
  `;

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
