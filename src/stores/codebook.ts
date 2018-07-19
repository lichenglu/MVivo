import {action, computed, observable} from 'mobx'

export class CodeBookStore {
  @observable public currentCodeBookID: string
  @observable public codeBooks: Map<string, ICodeBook> = observable.map()

  @computed
  get currentCodeBook() {
    return this.codeBooks.get(this.currentCodeBookID)
  }

  @action
  public addCodeBook(codeBook: ICodeBook) {
    this.codeBooks.set(codeBook.id, codeBook)
  }

  @action
  public deleteCodeBookByID(id: string) {
    this.codeBooks.delete(id)
  }
}

export default new CodeBookStore()
