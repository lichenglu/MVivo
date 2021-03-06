import { Inline, Value } from 'slate';
import { Editor } from 'slate-react';

import { INLINES } from '../utils/constants';

interface UpdateSelectedCode {
  codeID: string;
  action: 'add' | 'delete';
  editor: Editor;
  type?: INLINES;
}

export function updateSelectedCode({
  type = INLINES.CodedText,
  codeID,
  action,
  editor,
}: UpdateSelectedCode) {

  editor.change(change => {
    if (action === 'add') {
      change.value.inlines.forEach(inline => {
        if (inline && inline.type === type) {
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
        if (inline && inline.type === type) {
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
  })
}
