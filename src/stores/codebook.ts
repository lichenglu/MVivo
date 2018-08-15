import { types } from "mobx-state-tree"

import { assignUUID } from './utils';

const Code = types.model('Code', {
  definition: types.string,
  id: types.identifier,
  name: types.string,
})
.preProcessSnapshot(assignUUID)

const CodeBook = types.model('CodeBook', {
  codes: types.optional(types.array(types.reference(Code)), []),
  id: types.identifier,
  name: types.string,
})
.preProcessSnapshot(assignUUID)

export const CodeBookStore = types
  .model("CodeBookStore", {
      codeBooks: types.optional(types.map(CodeBook), {}),
      codes: types.optional(types.map(Code), {}),
  })
  .views(self => ({
    codeBookOf(id: string) {
      return self.codeBooks.get(id)
    }
  }))
  .actions(self => ({
    createCodeBook(data: { name: string, codes?: Codes }) {
      const codeBook = CodeBook.create(data);
      self.codeBooks.put(codeBook);
    }
  }))

export type Code = typeof Code.SnapshotType
export type Codes = typeof CodeBook.SnapshotType['codes']
export type CodeBook = typeof CodeBook.SnapshotType

// export class CodeBookStore {
//   @observable public currentCodeBookID: string
//   @observable public codeBooks: Map<string, ICodeBook> = observable.map()

//   @computed
//   get currentCodeBook() {
//     return this.codeBooks.get(this.currentCodeBookID)
//   }

//   @action
//   public addCodeBook(codeBook: ICodeBook) {
//     this.codeBooks.set(codeBook.id, codeBook)
//   }

//   @action
//   public deleteCodeBookByID(id: string) {
//     this.codeBooks.delete(id)
//   }
// }

// export default new CodeBookStore()
