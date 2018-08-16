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
  createWorkSpace(data: { name: string, description?: string, codeBookID?: string, documentID?: string }) {

      const workSpace = WorkSpaceModel.create(data);
      
      if (data.codeBookID) {
        const codeBook = self.codeBookStore.codeBookBy(data.codeBookID)
        workSpace.setCodeBook(codeBook);
      }
      
      if (data.documentID) {
        const documentT = self.workSpaceStore.documentBy(data.documentID)
        workSpace.setDocument(documentT);
      }

      self.workSpaceStore.workSpaces.put(workSpace)

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