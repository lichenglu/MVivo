import { Inline, Range, Value } from 'slate';

import { INLINES, MARKS } from '../utils/constants';

interface UpdateCodeForBlocks {
  codeID: string;
  action: 'add' | 'delete';
  value: Value;
  type?: string;
}

export interface CodedTextMarkData {
  codeIDs: string[];
}

export function updateCodeForBlocks({
  codeID,
  type = INLINES.CodedText,
  action,
  value,
}: UpdateCodeForBlocks) {
  let change = value.change({});

  if (action === 'add') {
    change.moveToRangeOfDocument();
    const originalRange = change.value.selection;
    change.value.inlines.forEach(inline => {
      if (inline && inline.type === MARKS.BufferedText) {
        change.moveToRangeOfNode(inline);

        const codedInline = Inline.create({
          type,
          data: { codeIDs: [codeID] },
        });

        change = change.wrapInline(codedInline);
      }
    });
    return change.select(originalRange).moveToStart();
  } else if (action === 'delete') {
    change.moveToRangeOfDocument();
    change.value.inlines.forEach(inline => {
      if (inline && inline.type === type) {
        const codeIDs: string[] = inline.get('data').get('codeIDs');

        // pre-exit if target code is not even in the inline
        if (!codeIDs.includes(codeID)) {
          return;
        }

        change.moveToRangeOfNode(inline);

        const nextCodeIDs = codeIDs.filter(id => id !== codeID);
        const shouldRMInline = nextCodeIDs.length === 0;

        shouldRMInline
          ? change.unwrapInline(inline)
          : change.setInlines({
              data: { codeIDs: nextCodeIDs },
            });
      }
    });
    return change.deselect();
  }
}
