import { values } from 'mobx';
import { applySnapshot, getSnapshot, types } from 'mobx-state-tree';

import { Code, CodeModel } from './code';
import { CodeBook, CodeBookModel, CodesSnapshot } from './codebook';
import { Theme, ThemeModel } from './theme';

export const CodeBookStore = types
  .model('CodeBookStore', {
    codeBooks: types.optional(types.map(CodeBookModel), {}),
    codes: types.optional(types.map(CodeModel), {}),
    themes: types.optional(types.map(ThemeModel), {}),
    // this is to keep a record between the relationship of codes and themes
    // key: child, value: parent
    familyTree: types.optional(types.map(types.reference(ThemeModel)), {}),
  })
  .actions(self => ({
    addCodeBook(codebook: CodeBook) {
      self.codeBooks.put(codebook);
    },
    createCodeAndAddTo(codeBookID: string, code: Code) {
      const codeBook = self.codeBooks.get(codeBookID);

      if (!code.bgColor && codeBook) {
        code.setBgColor(codeBook.randomColorFromPalette());
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
    removeThemeOf(codeBookID: string, themeID: string) {
      const codeBook = self.codeBooks.get(codeBookID);
      if (codeBook) {
        codeBook.removeTheme(themeID);
        return true;
      } else {
        return false;
      }
    },
    removeTheme(themeID: string) {
      self.themes.delete(themeID);
    },
    updateCodeOf(codeBookID: string, codeID: string, data: object) {
      const codeBook = self.codeBooks.get(codeBookID);
      if (codeBook) {
        codeBook.updateCode(codeID, data);
      }
    },
    createThemeAndAddTo(codeBookID: string, theme: Theme) {
      const codeBook = self.codeBooks.get(codeBookID);
      self.themes.put(theme);
      if (codeBook) {
        codeBook.addTheme(theme);
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
    setToFamilyTree(parentID: string, childID: string) {
      self.familyTree.set(childID, parentID);
    },
    removeFromFamilyTree(childID: string) {
      self.familyTree.delete(childID);
    },
    getParentFromTree(childID: string) {
      return self.familyTree.get(childID);
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
