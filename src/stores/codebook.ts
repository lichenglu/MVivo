import { types } from "mobx-state-tree"

export const Code = types.model('Code', {
  definition: types.string,
  id: types.string,
  name: types.string,
})

export const CodeBook = types.model('CodeBook', {
  codes: types.maybeNull(types.array(Code)),
  id: types.string,
  name: types.string,
})

export const CodeBookStore = types
  .model("CodeBookStore", {
      codeBooks: types.maybeNull(types.map(CodeBook)),
      currentCodeBookID: types.maybeNull(types.string),
  })
  .views(self => ({
    get currentCodeBook() {
      if (!self.codeBooks || !self.currentCodeBookID) {
        return null
      }
      return self.codeBooks.get(self.currentCodeBookID)
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
