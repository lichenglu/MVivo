import { values } from 'mobx';
import { applySnapshot, getSnapshot, types } from 'mobx-state-tree';

import { assignUUID } from './utils';

import { colorPalette } from '~/lib/colorPalette';

export const CodeModel = types
  .model('Code', {
    definition: types.optional(types.string, ''),
    id: types.identifier,
    name: types.string,
    bgColor: types.optional(types.string, ''),
    tint: types.optional(types.string, '#fff'),
  })
  .actions(self => ({
    setBgColor(color: string) {
      self.bgColor = color;
    },
    update(data: object) {
      applySnapshot(self, { ...getSnapshot(self), ...data });
    },
  }))
  .preProcessSnapshot(assignUUID);

export const CodeBookModel = types
  .model('CodeBook', {
    availableColors: types.optional(types.array(types.string), colorPalette),
    codes: types.optional(types.map(types.reference(CodeModel)), {}),
    colorPalette: types.optional(types.array(types.string), colorPalette),
    description: types.maybe(types.string),
    id: types.identifier,
    name: types.string,
    recycleColor: types.optional(types.boolean, true),
  })
  .actions(self => {
    function sliceAvailableColor(idx: number) {
      // @ts-ignore
      self.availableColors = self.availableColors
        .slice(0, idx)
        .concat(self.availableColors.slice(idx + 1));
      if (self.availableColors.length === 0 && self.recycleColor) {
        self.availableColors = self.colorPalette;
      }
    }

    return {
      addCode(code: Code) {
        self.codes.put(code);
      },
      removeCode(codeID: string) {
        self.codes.delete(codeID);
      },
      updateCode(codeID: string, data: object) {
        const code = self.codes.get(codeID);
        if (code) {
          code.update(data);
        }
      },
      randomColorFromPalette() {
        const randomIdx = Math.floor(
          Math.random() * self.availableColors.length
        );
        const color = self.availableColors[randomIdx];
        sliceAvailableColor(randomIdx);
        return color;
      },
    };
  })
  .views(self => ({
    get codeList() {
      return values(self.codes).map((code: Code) => getSnapshot(code));
    },
  }))
  .preProcessSnapshot(assignUUID);

export const CodeBookStore = types
  .model('CodeBookStore', {
    codeBooks: types.optional(types.map(CodeBookModel), {}),
    codes: types.optional(types.map(CodeModel), {}),
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
          this.createCodeAndAddTo(codeBook.id, CodeModel.create(codeData));
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

export type Code = typeof CodeModel.Type;
export type CodeBook = typeof CodeBookModel.Type;
export type CodeSnapshot = typeof CodeModel.SnapshotType;
export type CodesSnapshot = typeof CodeBookModel.SnapshotType['codes'];
export type CodeBookSnapshot = typeof CodeBookModel.SnapshotType;
