import { values } from 'mobx';
import { getSnapshot, types } from 'mobx-state-tree';

import { CodeBook, CodeBookModel } from '../codebook';
import { assignUUID } from '../utils';

import { generateGradient, gradients } from '~/lib/colorPalette';

import { Document, DocumentModel } from './document';

export const WorkSpaceModel = types
  .model('WorkSpace', {
    bookmarked: types.optional(types.boolean, false),
    codeBook: types.maybe(types.reference(CodeBookModel)),
    cover: types.maybe(
      types.model({
        from: types.string,
        to: types.string,
        degree: types.number,
      })
    ),
    description: types.optional(types.string, ''),
    documents: types.optional(types.map(types.reference(DocumentModel)), {}),
    id: types.identifier,
    name: types.string,
  })
  .actions(self => ({
    setCodeBook(book?: CodeBook) {
      self.codeBook = book;
    },
    addDocument(documentT?: Document) {
      if (documentT) {
        self.documents.put(documentT);
      }
    },
    bookmark(toggle: boolean) {
      self.bookmarked = toggle;
    },
    afterCreate() {
      if (!self.cover) {
        self.cover = gradients[Math.floor(Math.random() * gradients.length)];
      }
    },
  }))
  .views(self => ({
    get coverCSS() {
      if (self.cover) {
        return generateGradient(self.cover);
      }
      return null;
    },
    get documentList() {
      return values(self.documents).map((doc: Document) => getSnapshot(doc));
    },
  }))
  .preProcessSnapshot(assignUUID);

export type WorkSpace = typeof WorkSpaceModel.Type;
export type WorkSpaceSnapshot = typeof WorkSpaceModel.SnapshotType;
