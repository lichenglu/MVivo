import { values } from 'mobx';
import { getParent, getSnapshot, types } from 'mobx-state-tree';

import { assignUUID } from '../utils';

import { colorPalette } from '~/lib/colorPalette';

import { Code, CodeModel } from './code';
import { Theme, ThemeModel } from './theme';

export const CodeBookModel = types
  .model('CodeBook', {
    availableColors: types.optional(types.array(types.string), colorPalette),
    codes: types.optional(types.map(types.reference(CodeModel)), {}),
    themes: types.optional(types.map(types.reference(ThemeModel)), {}),
    firstLevelTheme: types.maybe(types.reference(ThemeModel)),
    colorPalette: types.optional(types.array(types.string), colorPalette),
    description: types.maybe(types.string),
    id: types.identifier,
    name: types.string,
    recycleColor: types.optional(types.boolean, true),
    // this is for default new theme name
    nextThemeNumber: types.optional(types.number, 0),
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
      afterAttach() {
        if (self.firstLevelTheme) return;
        const theme = ThemeModel.create({
          name: 'First Level Codes',
        });
        getParent(self, 2).createThemeAndAddTo(self.id, theme);
        this.addTheme(theme);
        self.firstLevelTheme = theme;
      },
      addCode(code: Code) {
        self.codes.put(code);

        if (self.firstLevelTheme) {
          self.firstLevelTheme.adopt([code]);
        }
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
        self.nextThemeNumber = self.nextThemeNumber + 1;
      },
      removeTheme(themeID: string) {
        // we need to adopt the children abandoned by the to-be-deleted theme
        const targetTheme = self.themes.get(themeID);
        if (targetTheme && self.firstLevelTheme) {
          self.firstLevelTheme.adopt(values(targetTheme.children));
        }
        self.themes.delete(themeID);
      },
      reorderTheme(startIndex: number, endIndex: number) {
        const children = [...values(self.themes)];
        const [removed] = children.splice(startIndex, 1);
        children.splice(endIndex, 0, removed);

        self.themes.clear();
        for (const theme of children) {
          self.themes.put(theme);
        }

        return children;
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
      // TODO: solve recursive issues of children
      return values(self.themes).map((theme: Theme) => {
        const themeSnapshot = getSnapshot(theme);
        const children = values(theme.children).map((child: any) =>
          getSnapshot(child)
        );
        return { ...themeSnapshot, children };
      });
    },
  }))
  .preProcessSnapshot(assignUUID);

export type CodeBook = typeof CodeBookModel.Type;
export type CodesSnapshot = typeof CodeBookModel.SnapshotType['codes'];
export type CodeBookSnapshot = typeof CodeBookModel.SnapshotType;
