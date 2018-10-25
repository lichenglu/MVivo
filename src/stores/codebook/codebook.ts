import { values } from 'mobx';
import { getSnapshot, types } from 'mobx-state-tree';

import { assignUUID } from '../utils';

import { colorPalette } from '~/lib/colorPalette';

import { Code, CodeModel } from './code';
import { Theme, ThemeModel } from './theme';

export const CodeBookModel = types
  .model('CodeBook', {
    availableColors: types.optional(types.array(types.string), colorPalette),
    codes: types.optional(types.map(types.reference(CodeModel)), {}),
    themes: types.optional(types.map(types.reference(ThemeModel)), {}),
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
      addTheme(theme: Theme) {
        self.themes.put(theme);
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
    get themeList() {
      return values(self.themes).map((theme: Theme) => {
        const themeSnapshot = getSnapshot(theme);
        const children = Object.values(themeSnapshot.children).map(
          (code: Code) => getSnapshot(code)
        );
        return { ...themeSnapshot, children };
      });
    },
  }))
  .preProcessSnapshot(assignUUID);

export type CodeBook = typeof CodeBookModel.Type;
export type CodesSnapshot = typeof CodeBookModel.SnapshotType['codes'];
export type CodeBookSnapshot = typeof CodeBookModel.SnapshotType;
