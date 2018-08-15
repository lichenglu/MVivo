import { types } from "mobx-state-tree"
import { CodeBookModel, CodeBookSnapshot, CodeBookStore, CodesSnapshot } from "./codebook"
import { DocumentSnapshot, WorkSpaceModel, WorkSpaceStore, } from "./workspace"

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  codeBookStore: types.optional(CodeBookStore, {}),
  workSpaceStore: types.optional(WorkSpaceStore, {}),
})
.actions(self => ({
  createCodeBook(data: { name: string, codes?: CodesSnapshot }) {
    const codeBook = CodeBookModel.create(data);
    self.codeBookStore.codeBooks.put(codeBook);
    return codeBook;
  },
  createWorkSpace(data: { name: string, codeBook?: CodeBookSnapshot, document?: DocumentSnapshot }) {
      const workSpace = WorkSpaceModel.create(data);
      self.workSpaceStore.workSpaces.put(workSpace)

      if (data.document) {
        self.workSpaceStore.createDocument(data.document)
      }

      if (data.codeBook) {
        this.createCodeBook(data.codeBook)
      }
      
      return workSpace;
  },
  setWorkSpace(id: string) {
    const workspace = self.workSpaceStore.workSpaces.get(id);
    if (workspace) {
      self.workSpaceStore.currentWorkSpace = workspace;
    }
    return workspace
  }
}))

/**
 * The RootStore instance.
 */
export type RootStore = typeof RootStoreModel.Type

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = typeof RootStoreModel.SnapshotType