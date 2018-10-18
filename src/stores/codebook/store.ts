import { values } from 'mobx';
import { applySnapshot, getSnapshot, types } from 'mobx-state-tree';

import { Code, CodeModel } from './code';
import { CodeBook, CodeBookModel, CodesSnapshot } from './codebook';
import { ThemeModel } from './theme';

export const CodeBookStore = types
  .model('CodeBookStore', {
    codeBooks: types.optional(types.map(CodeBookModel), {}),
    codes: types.optional(types.map(CodeModel), {}),
    themes: types.optional(types.map(ThemeModel), {}),
  })
  .actions(self => ({
    createCodeAndAddTo(codeBookID: string, code: Code) {
      const codeBook = self.codeBooks.get(codeBookID);

      if (!code.bgColor && codeBook) {
        code.setBgColor(codeBook.randomColorFromPalette());
        console.log(code.bgColor);
      }

      self.codes.put(code);
      if (codeBook) {
        codeBook.addCode(code);
      }
    },
    removeCodeOf(codeBookID: string, codeID: string) {
      const codeBook = self.codeBooks.get(codeBookID);
      if (codeBook) {
        codeBook.removeCode(codeID);
        return true;
      } else {
        return false;
      }
    },
    updateCodeOf(codeBookID: string, codeID: string, data: object) {
      const codeBook = self.codeBooks.get(codeBookID);
      if (codeBook) {
        codeBook.updateCode(codeID, data);
      }
    },
    copyCodeBookBy(
      codeBookID: string,
      data: {
        name: string;
        codes?: CodesSnapshot;
        description?: string;
      }
    ) {
      const copiedCodeBook = self.codeBooks.get(codeBookID);

      if (copiedCodeBook) {
        const codeBook = CodeBookModel.create({
          ...data,
          colorPalette: getSnapshot(copiedCodeBook.colorPalette),
          availableColors: getSnapshot(copiedCodeBook.availableColors),
        });
        self.codeBooks.put(codeBook);

        const codes = copiedCodeBook.codeList;
        codes.forEach(({ id, ...codeData }) => {
          this.createCodeAndAddTo(
            codeBook.id,
            CodeModel.create({
              ...codeData,
              id: `${id}_@${Date.now()}`,
            })
          );
        });
        return self.codeBooks.get(codeBook.id);
      }
      console.log(`Failed to copy codebook with id ${codeBookID}`);
      return null;
    },
  }))
  .views(self => ({
    codeBookBy(id: string) {
      return self.codeBooks.get(id);
    },
    get codeBookList() {
      return values(self.codeBooks).map((book: CodeBook) => getSnapshot(book));
    },
    get hasCodeBook() {
      return this.codeBookList.length > 0;
    },
  }));
