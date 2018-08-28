import { ContentBlock, EditorState, Modifier, SelectionState } from 'draft-js';

export function removeInlineStylesFromSelection(
  editorState: EditorState
): EditorState {
  const currentStyles = editorState.getCurrentInlineStyle();
  let contentState = editorState.getCurrentContent();
  currentStyles.forEach((style: string) => {
    contentState = Modifier.removeInlineStyle(
      contentState,
      editorState.getSelection(),
      style
    );
  });
  return EditorState.push(editorState, contentState, 'change-inline-style');
}

export function removeInlineStylesOfBlock(
  editorState: EditorState,
  blockKey?: string
): EditorState {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const selectionKey = selectionState.getAnchorKey();
  const currentStyles = editorState.getCurrentInlineStyle();

  const block = blockKey
    ? contentState.getBlockForKey(blockKey)
    : contentState.getBlockForKey(selectionKey);
  const _blockKey = block.getKey();

  let nextContentState = contentState;
  currentStyles.forEach((style: string) => {
    nextContentState = Modifier.removeInlineStyle(
      nextContentState,
      new SelectionState({
        anchorOffset: 0,
        anchorKey: _blockKey,
        focusOffset: block.getLength(),
        focusKey: _blockKey,
      }),
      style
    );
  });

  const nextEditorState = EditorState.push(
    editorState,
    nextContentState,
    'change-inline-style'
  );

  return EditorState.acceptSelection(nextEditorState, selectionState);
}

export function removeInlineStylesOfBlocks(editorState: EditorState) {
  const contentState = editorState.getCurrentContent();
  const blocks = contentState.getBlockMap();
  let nextEditorState = editorState;
  blocks.forEach((block: ContentBlock) => {
    const blockKey = block.getKey();
    nextEditorState = removeInlineStylesOfBlock(nextEditorState, blockKey);
  });
  return nextEditorState;
}
