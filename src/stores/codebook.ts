import { types } from "mobx-state-tree"
import * as uuid from 'uuid';

export const Code = types.model('Code', {
  definition: types.string,
  id: types.optional(types.identifier, uuid()),
  name: types.string,
})

export const CodeBook = types.model('CodeBook', {
  codes: types.optional(types.array(Code), []),
  id: types.optional(types.identifier, uuid()),
  name: types.string,
})

export const CodeBookStore = types
  .model("CodeBookStore", {
      codeBooks: types.optional(types.map(CodeBook), {}),
  })
  .views(self => ({
    codeBookOf(id: string) {
      return self.codeBooks.get(id)
    }
  }))
  .actions(self => ({
    createCodeBook(data: { name: string, codes?: Array<typeof Code.Type> }) {
      const codeBook = CodeBook.create(data);
      self.codeBooks.set(codeBook.id, codeBook);
    }
  }))

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
