import { Inline, Range, Value } from 'slate';

import { INLINES, MARKS } from '../utils/constants';
import { List } from 'antd';

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
    const decorations = value.decorations
      .toArray()
      // For some reason...we need to wrap inline in the descending order
      // TODO: figure out why and if it is the correct way of doing such a thing
      .sort((a, b) => (b.start.offset || 0) - (a.start.offset || 0))
      .filter(decoration => {
        if (!decoration || !decoration.mark) return true;

        if (decoration.mark.type === MARKS.BufferedText) {
          const range = Range.create(decoration);
          const inline = Inline.create({
            type,
            data: { codeIDs: [codeID] },
          });
          change = change.wrapInlineAtRange(range, inline);
          return false;
        }
        return true;
      });

    return change.setValue({ decorations });
  } else if (action === 'delete') {
    change.moveToRangeOfDocument();
    change.value.inlines.forEach(inline => {
      if (inline && inline.type === type) {
        const codeIDs: string[] = inline.get('data').get('codeIDs');

        // pre-exit if target code is not even in the inline
        if (!codeIDs.includes(codeID)) {
          return;
        }

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
