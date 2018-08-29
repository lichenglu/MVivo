import { ContentBlock, EditorState } from 'draft-js';
import * as Immutable from 'immutable';

/**
 * Function returns collection of currently selected blocks.
 */
export function getSelectedBlocksMap(editorState: EditorState) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blockMap = contentState.getBlockMap();
  return blockMap
    .toSeq()
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat([[endKey, blockMap.get(endKey)]]);
}

/**
 * Function returns collection of currently selected blocks.
 */
export function getSelectedBlocksList(
  editorState: EditorState
): Immutable.List<ContentBlock> {
  return getSelectedBlocksMap(editorState).toList();
}

/**
 * Function returns the first selected block.
 */
export function getSelectedBlock(
  editorState: EditorState
): ContentBlock | undefined {
  if (editorState) {
    return getSelectedBlocksList(editorState).get(0);
  }
  return undefined;
}
