import { EditorState, Modifier, RichUtils, SelectionState } from 'draft-js';

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
  styleMap: object
): EditorState {
  let contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const selectionKey = selectionState.getAnchorKey();

  const block = contentState.getBlockForKey(selectionKey);
  const blockKey = block.getKey();

  contentState = Object.keys(styleMap).reduce((state, style) => {
    return Modifier.removeInlineStyle(
      state,
      new SelectionState({
        anchorOffset: 0,
        anchorKey: blockKey,
        focusOffset: block.getLength(),
        focusKey: blockKey,
        isBackward: false,
        hasFocus: selectionState.getHasFocus(),
      }),
      style
    );
  }, contentState);

  const nextEditorState = EditorState.push(
    editorState,
    contentState,
    'change-inline-style'
  );

  return EditorState.acceptSelection(nextEditorState, selectionState);
}
