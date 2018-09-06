import { Inline, Mark, Value } from 'slate';

import { MARKS } from '../utils/constants';

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
  let change = value.change();
  if (action === 'add') {
    const decorations = value.decorations.filter(decoration => {
      if (!decoration || !decoration.mark) return true;
      if (decoration.mark.type === MARKS.BufferedText) {
        const inline = Inline.create({
          type,
          data: { codeIDs: [codeID] },
        });
        change = change.wrapInlineAtRange(decoration, inline);
        return false;
      }
      return true;
    });
    return change.setValue({ decorations });
  }
}
