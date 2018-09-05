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
    value.decorations.forEach(decoration => {
      if (!decoration || !decoration.mark) return;
      if (decoration.mark.type === MARKS.BufferedText) {
        change = change;
      }
    });
    return change;
  }
}
