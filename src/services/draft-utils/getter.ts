import { EditorState } from 'draft-js';

export const getSelectedTextFromEditor = (
  editorState: EditorState
): { text: string; start: number; end: number } => {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = selectionState.getStartOffset();
  const end = selectionState.getEndOffset();
  const selectedText = currentContentBlock.getText().slice(start, end);

  return { text: selectedText, start, end };
};
