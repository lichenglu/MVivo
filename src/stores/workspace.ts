import { values } from 'mobx';
import { getSnapshot, types } from 'mobx-state-tree';
import { Value as SlateValue } from 'slate';
import Serializer from 'slate-plain-serializer';

import { CodeBook, CodeBookModel } from './codebook';
import { assignUUID, EditorContentState } from './utils';

import { gradients, generateGradient } from '~/lib/colorPalette';

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

export const WorkSpaceModel = types
  .model('WorkSpace', {
    bookmarked: types.optional(types.boolean, false),
    codeBook: types.maybe(types.reference(CodeBookModel)),
    cover: types.optional(
      types.string,
      generateGradient(gradients[Math.floor(Math.random() * gradients.length)])
    ),
    description: types.optional(types.string, ''),
    document: types.maybe(types.reference(DocumentModel)),
    id: types.identifier,
    name: types.string,
  })
  .actions(self => ({
    setCodeBook(book?: CodeBook) {
      self.codeBook = book;
    },
    setDocument(documentT?: Document) {
      self.document = documentT;
    },
    bookmark(toggle: boolean) {
      self.bookmarked = toggle;
    },
  }))
  .preProcessSnapshot(assignUUID);

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
    createDocument(data: Omit<DocumentSnapshot, 'id' | 'editorContentState'>) {
      const document = DocumentModel.create(data);
      if (!document.editorContentState) {
        document.updateEditorState(Serializer.deserialize(document.text));
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

export type Document = typeof DocumentModel.Type;
export type WorkSpace = typeof WorkSpaceModel.Type;
export type DocumentSnapshot = typeof DocumentModel.SnapshotType;
export type WorkSpaceSnapshot = typeof WorkSpaceModel.SnapshotType;
