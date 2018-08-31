import { Value } from 'slate';

export const hasMark = (editorState: Value, type: string) => {
  return editorState.marks.some(mark => {
    if (!mark) return false;
    return mark.type === type;
  });
};

export const hasBlock = (editorState: Value, type: string) => {
  return editorState.blocks.some(node => {
    if (!node) return false;
    return node.type === type || node.type.indexOf(`${type}-`) === 0;
  });
};
