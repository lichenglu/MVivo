import {
  ContentState,
  DraftEntityMutability,
  EditorState,
  Modifier,
} from 'draft-js';

import { NormalCodeTextProps } from './decorator';

import { DraftDecorator } from '~/lib/constants';
import { CodeSnapshot } from '~/stores';

const createCodeFactory = <T = {}>(
  type: DraftDecorator,
  mutability: DraftEntityMutability = 'MUTABLE'
) => (contentState: ContentState, data?: T) =>
  contentState.createEntity(type, mutability, data);

export const createBufferedCode = createCodeFactory<object>(
  DraftDecorator.BUFFERED_CODE
);

export const createNormalCode = createCodeFactory<NormalCodeTextProps>(
  DraftDecorator.CODE
);

export const updateCodeOfEntity = ({
  code,
  action,
  editorState,
  entityKey,
}: {
  editorState: EditorState;
  code: CodeSnapshot;
  entityKey: string;
  action: 'add' | 'delete';
}) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const entity = contentState.getEntity(entityKey);
  const currentCodes: string[] = entity.getData().codeIDs;

  let nextContentState = contentState;
  if (action === 'add') {
    nextContentState = contentState.mergeEntityData(entityKey, {
      codeIDs: currentCodes.concat([code.id]),
    });
  } else if (action === 'delete') {
    nextContentState = contentState.replaceEntityData(entityKey, {
      codeIDs: currentCodes.filter(id => id !== code.id),
    });
  }

  return Modifier.applyEntity(nextContentState, selection, entityKey);
};
