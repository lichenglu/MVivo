import { Inline, Value } from 'slate';

import { INLINES } from '../utils/constants';

interface UpdateSelectedCode {
  codeID: string;
  action: 'add' | 'delete';
  value: Value;
  type?: string;
}

export function updateSelectedCode({
  type = INLINES.CodedText,
  codeID,
  action,
  value,
}: UpdateSelectedCode) {
  let change = value.change({});

  if (action === 'add') {
    change.value.inlines.forEach(inline => {
      if (inline && inline.type === INLINES.CodedText) {
        console.log(inline);
        const codeIDs: string[] = inline.get('data').get('codeIDs');
        if (codeIDs.includes(codeID)) {
          console.warn(`code ${codeID} is already in this inline. abort`);
          return;
        }
        const nextCodeIDs = [...codeIDs, codeID];
        change.setInlines({
          data: {
            codeIDs: nextCodeIDs,
          },
        });
      }
    });
  } else if (action === 'delete') {
    change.value.inlines.forEach(inline => {
      if (inline && inline.type === INLINES.CodedText) {
        const codeIDs: string[] = inline.get('data').get('codeIDs');
        const nextCodeIDs = codeIDs.filter(id => id !== codeID);
        const shouldRMInline = nextCodeIDs.length === 0;

        shouldRMInline
          ? change.unwrapInline(inline)
          : change.setInlines({
              data: { codeIDs: nextCodeIDs },
            });
      }
    });
  }
  return change;
}
