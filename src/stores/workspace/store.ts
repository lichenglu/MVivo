import { values } from 'mobx';
import { getSnapshot, types } from 'mobx-state-tree';
import { Value as SlateValue } from 'slate';
import HTMLSerializer from 'slate-html-serializer';
import PlainSerializer from 'slate-plain-serializer';

import { HTML_RULES } from '~/lib/slate-plugins';

import { DocumentModel, DocumentSnapshot } from './document';
import { WorkSpace, WorkSpaceModel } from './workspace';

export const WorkSpaceStore = types
  .model('WorkSpaceStore', {
    currentWorkSpace: types.maybe(types.reference(WorkSpaceModel)),
    documents: types.optional(types.map(DocumentModel), {}),
    workSpaces: types.optional(types.map(WorkSpaceModel), {}),
  })
  .views(self => ({
    get workSpaceList() {
      return values(self.workSpaces).map((ws: WorkSpace) => getSnapshot(ws));
    },
    get hasWorkSpace() {
      return this.workSpaceList.length > 0;
    },
    get safeCurrentWorkSpace() {
      // If there is a selected workSpace, then we prioritize it
      // if not, and there is/are workSpaces, then we return the first
      // one
      if (self.currentWorkSpace) {
        return self.currentWorkSpace;
      }
      if (this.workSpaceList.length > 0) {
        return this.workSpaceList[0];
      }
      return null;
    },
    workSpaceBy(id: string) {
      return self.workSpaces.get(id);
    },
    documentBy(id: string) {
      return self.documents.get(id);
    },
  }))
  .actions(self => ({
    createDocument(
      data: Omit<DocumentSnapshot, 'id' | 'editorContentState'>,
      options: {
        isHTML?: boolean;
      } = {}
    ) {
      const document = DocumentModel.create(data);
      if (!document.editorContentState) {
        const value = options.isHTML
          ? new HTMLSerializer({ rules: HTML_RULES }).deserialize(document.text)
          : PlainSerializer.deserialize(document.text);
        document.updateEditorState(value);
      }
      self.documents.put(document);
      return document;
    },
    setWorkSpaceBy(id: string) {
      const workspace = self.workSpaces.get(id);
      if (workspace) {
        self.currentWorkSpace = workspace;
      } else {
        self.currentWorkSpace = undefined;
      }
      return workspace;
    },
    bookmarkWorkSpaceBy(id: string, bookmarked: boolean) {
      const workspace = self.workSpaces.get(id);
      if (workspace) {
        workspace.bookmark(bookmarked);
      }
    },
    updateEditorState(documentID: string, contentState: SlateValue) {
      const document = self.documentBy(documentID);
      if (document) {
        document.updateEditorState(contentState);
      }
    },
  }));
