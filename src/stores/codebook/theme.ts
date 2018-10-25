import { values } from 'mobx';
import { types } from 'mobx-state-tree';

import { Code, CodeModel } from './code';

export const ThemeModel = CodeModel.named('Theme')
  .props({
    children: types.optional(
      types.map(
        types.union(
          types.reference(CodeModel),
          types.reference(types.late((): any => ThemeModel))
        )
      ),
      {}
    ),
  })
  .actions(self => ({
    // adopt children....
    adopt(children: any[]) {
      const castChildren = children as Array<Theme | Code>;
      for (const child of castChildren) {
        self.children.put(child);
      }
    },
    abandon(children: string[]) {
      for (const child of children) {
        self.children.delete(child);
      }
    },
    swap(at: number, originalPos: number) {
      const children = [...values(self.children)];
      const toBeSwapped = children[at];
      children[at] = children[originalPos];
      children[originalPos] = toBeSwapped;

      this.abandon(values(self.children).map(c => c.id));
      this.adopt(children);
    },
    insert(child: any, at: number) {
      const children = [...values(self.children)];
      children.splice(at, 0, child);
      this.abandon(values(self.children).map(c => c.id));
      this.adopt(children);
    },
  }));

export type Theme = typeof ThemeModel.Type;
export type ThemeSnapshot = typeof ThemeModel.SnapshotType;
