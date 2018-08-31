import { Inline, Value } from 'slate';

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
    hasMarkAndDo(value, 'BufferedText', (editorState, markType) => {
      console.log('asdasd');
      change = editorState.change().removeMark(markType);
      return change;
    });
  }
}
