import { EditorState, EntityInstance } from 'draft-js';

import { DraftDecorator } from '~/lib/constants';

export const getSelectedTextFromEditor = (
  editorState: EditorState
): { text: string; start: number; end: number; anchorKey: string } => {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = selectionState.getStartOffset();
  const end = selectionState.getEndOffset();
  const selectedText = currentContentBlock.getText().slice(start, end);

  return { text: selectedText, start, end, anchorKey };
};

interface FoundEntity {
  entityKey: string;
  blockKey: string;
  entity: EntityInstance;
  start?: number;
  end?: number;
}

export const getEntitiesFromBlocks = (
  editorState: EditorState,
  entityType?: string
) => {
  const content = editorState.getCurrentContent();
  const entities: FoundEntity[] = [];
  content.getBlocksAsArray().forEach(block => {
    let selectedEntity: FoundEntity | null = null;
    block.findEntityRanges(
      character => {
        if (character.getEntity() !== null) {
          const entity = content.getEntity(character.getEntity());
          if (!entityType || (entityType && entity.getType() === entityType)) {
            selectedEntity = {
              entityKey: character.getEntity(),
              blockKey: block.getKey(),
              entity: content.getEntity(character.getEntity()),
            };
            return true;
          }
        }
        return false;
      },
      (start, end) => {
        if (selectedEntity) {
          entities.push({ ...selectedEntity, start, end });
        }
      }
    );
  });
  return entities;
};

export const getCodeCounts = (
  editorState: EditorState
): { [codeID: string]: number } => {
  const entities = getEntitiesFromBlocks(editorState, DraftDecorator.CODE);
  return entities.reduce((dict, entity) => {
    const { codeID } = entity.entity.getData();
    if (dict[codeID] === undefined) {
      dict[codeID] = 1;
    } else {
      dict[codeID] = dict[codeID] + 1;
    }
    return dict;
  }, {});
};
