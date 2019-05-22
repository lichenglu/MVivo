import { getSnapshot, types } from 'mobx-state-tree';
import {
  CodeBookModel,
  CodeBookSnapshot,
  CodeBookStore,
  CodesSnapshot,
} from './codebook';
import { DocumentSnapshot, WorkSpaceModel, WorkSpaceStore } from './workspace';

export * from './codebook';
export * from './workspace';
/**
 * An RootStore model.
 */
export const RootStoreModel = types
  .model('RootStore')
  .props({
    codeBookStore: types.optional(CodeBookStore, {}),
    workSpaceStore: types.optional(WorkSpaceStore, {}),
  })
  .views(self => ({
    isSharedCodeBook(codeBookID: string) {
      let count = 0;
      self.workSpaceStore.workSpaces.forEach(ws => {
        if (ws.codeBook && ws.codeBook.id === codeBookID) {
          count++;
        }
      });
      return count > 1;
    },
  }))
  .actions(self => ({
    createCodeBook(data: {
      name: string;
      codes?: CodesSnapshot;
      description?: string;
      codeBookID?: string;
    }) {
      const { codeBookID, ...rest } = data;

      // if there is codeBookID passed in, then copy the
      // codebook and create a new codebook
      if (codeBookID) {
        const codeBook = self.codeBookStore.copyCodeBookBy(codeBookID, rest);
        if (codeBook) {
          return codeBook;
        }
        return null;
      } else {
        const codeBook = CodeBookModel.create(data);
        self.codeBookStore.addCodeBook(codeBook);
        return codeBook;
      }
    },
    deleteCodeBookBy(id: string) {
      const targetCodeBook = self.codeBookStore.codeBookBy(id);
      if (targetCodeBook) {
        targetCodeBook.codeList.forEach(code =>
          self.codeBookStore.codes.delete(code.id)
        );
      }
      self.codeBookStore.codeBooks.delete(id);
    },
    createWorkSpace(data: {
      name: string;
      description?: string;
      codeBookID?: string;
      documentID?: string;
    }) {
      const workSpace = WorkSpaceModel.create(data);

      if (data.codeBookID) {
        const codeBook = self.codeBookStore.codeBookBy(data.codeBookID);
        workSpace.setCodeBook(codeBook);
      }

      if (data.documentID) {
        const documentT = self.workSpaceStore.documentBy(data.documentID);
        workSpace.addDocument(documentT);
      }

      self.workSpaceStore.workSpaces.put(workSpace);

      return workSpace;
    },
    deleteWorkSpaceBy(id: string) {
      if (
        self.workSpaceStore.currentWorkSpace &&
        self.workSpaceStore.currentWorkSpace.id === id
      ) {
        if (self.workSpaceStore.currentWorkSpace.documents) {
          self.workSpaceStore.currentWorkSpace.documents.forEach(doc => {
            self.workSpaceStore.documents.delete(doc.id);
          });
        }
        self.workSpaceStore.setWorkSpaceBy('');
      }
      self.workSpaceStore.workSpaces.delete(id);
    },
    setWorkSpaceBy(id: string) {
      return self.workSpaceStore.setWorkSpaceBy(id);
    },
  }));

/**
 * The RootStore instance.
 */
export type RootStore = typeof RootStoreModel.Type;

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = typeof RootStoreModel.SnapshotType;
