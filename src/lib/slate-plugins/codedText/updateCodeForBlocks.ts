import { Inline, Mark, Range, Value } from 'slate';

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
    const decorations = value.decorations
      .toArray()
      // For some reason...we need to wrap inline in the descending order
      // TODO: figure out why and if it is the correct way of doing such a thing
      .sort((a, b) => b.start.offset - a.start.offset)
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
    return change
      .moveToRangeOfDocument()
      .value.inlines.toArray()
      .forEach(inline => {
        if (inline && inline.type === INLINES.CodedText) {
          const codeIDs: string[] = inline.get('data').get('codeIDs');
          const nextCodeIDs = codeIDs.filter(id => id !== codeID);
          const shouldRMInline = nextCodeIDs.length === 0;

          change.moveAnchorToStartOfNode(inline).moveFocusToEndOfNode(inline);

          shouldRMInline
            ? change.unwrapInline(inline)
            : change.setInlines({
                data: { codeIDs: nextCodeIDs },
              });
        }
      });
  }
}
