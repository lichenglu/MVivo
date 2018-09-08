import { values } from 'mobx';
import { getSnapshot, types } from 'mobx-state-tree';

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
  }))
  .preProcessSnapshot(assignUUID);

export const CodeBookModel = types
  .model('CodeBook', {
    codes: types.optional(types.map(types.reference(CodeModel)), {}),
    id: types.identifier,
    name: types.string,
    colorPalette: types.optional(types.array(types.string), colorPalette),
    recycleColor: types.optional(types.boolean, true),
  })
  .volatile(self => ({
    availableColors: getSnapshot(self.colorPalette),
  }))
  .actions(self => {
    function sliceAvailableColor(idx: number) {
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
  }))
  .views(self => ({
    codeBookBy(id: string) {
      return self.codeBooks.get(id);
    },
    get codeBookList() {
      return values(self.codeBooks).map((book: CodeBook) => getSnapshot(book));
    },
  }));

export type Code = typeof CodeModel.Type;
export type CodeBook = typeof CodeBookModel.Type;
export type CodeSnapshot = typeof CodeModel.SnapshotType;
export type CodesSnapshot = typeof CodeBookModel.SnapshotType['codes'];
export type CodeBookSnapshot = typeof CodeBookModel.SnapshotType;
