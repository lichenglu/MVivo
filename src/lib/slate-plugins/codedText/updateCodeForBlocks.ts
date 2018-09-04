import { Inline, Value } from 'slate';

import { MARKS } from '../utils/constants';
import { hasMarkAndDo } from '../utils/has';

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
  type = 'CodedText',
  action,
  value,
}: UpdateCodeForBlocks) {
  let change;
  if (action === 'add') {
    console.log(codeID);
    value.marks.forEach(mark => {
      console.log(mark);
      if (!mark) return;
      if (mark.type === MARKS.BufferedText) {
        const range = mark.get('data').get('range');

        const text = value.document.getTextsAtRange(range)[0].text;

        const inline = Inline.create({
          type,
          data: {
            codeIDs: [codeID],
          },
        });

        change = value
          .change()
          .removeMarkAtRange(range, MARKS.BufferedText)
          .insertTextAtRange(range, text)
          .moveFocusForward(0 - text.length)
          .wrapInlineAtRange(range, inline);
      }
    });
    return change;
  }
}
