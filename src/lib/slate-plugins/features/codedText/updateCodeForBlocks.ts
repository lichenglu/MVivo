import { Inline, Value } from 'slate';

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
    const marks = value.document.getMarks();
    marks.valueSeq().forEach(mark => {
      if (!mark) return;
      if (mark.type === 'BufferedText') {
        console.log(mark);
        change = value.change().removeMark(mark.type);
        // .setInlines({ type, data: [codeID] });
      }
    });
    return change;
  }
}
