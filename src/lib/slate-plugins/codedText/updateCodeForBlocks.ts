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
    const decorations = value.decorations.toArray().filter(decoration => {
      if (!decoration || !decoration.mark) return true;
      return decoration.mark.type !== MARKS.BufferedText;
    });

    const ranges = value.decorations.toArray().filter(decoration => {
      if (!decoration || !decoration.mark) return true;
      return decoration.mark.type === MARKS.BufferedText;
    });

    change.setValue({ decorations });

    for (const range of ranges) {
      const inline = Inline.create({
        type,
        data: { codeIDs: [codeID] },
      });
      change.select(range).wrapInline(inline);
    }

    return change;
  }
}
