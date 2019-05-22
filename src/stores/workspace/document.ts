import { types } from 'mobx-state-tree';
import { Value as SlateValue } from 'slate';

import { assignUUID, EditorContentState } from '../utils';

export const DocumentModel = types
  .model('Document', {
    id: types.identifier,
    name: types.string,
    text: types.string,
    editorContentState: types.maybe(EditorContentState),
  })
  .actions(self => ({
    updateEditorState(contentState: SlateValue) {
      self.editorContentState = contentState;
    },
  }))
  .preProcessSnapshot(assignUUID);

export type Document = typeof DocumentModel.Type;
export type DocumentSnapshot = typeof DocumentModel.SnapshotType;
