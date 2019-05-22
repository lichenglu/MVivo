import { values } from 'mobx';
import { getParentOfType, types } from 'mobx-state-tree';

import { Code, CodeModel, CodeSnapshot } from './code';

type Codable = CodeSnapshot;

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
  .views(self => ({
    get store() {
      const { CodeBookStore } = require('./store');
      const p = getParentOfType(self, CodeBookStore);
      return p;
    },
  }))
  .actions(self => ({
    // adopt children....
    adopt(children: Codable[]) {
      const castChildren = children as Array<Theme | Code>;
      for (const child of castChildren) {
        if (self.store) {
          self.store.setToFamilyTree(self.id, child.id);
        }
        self.children.put(child);
      }
    },
    abandon(children: Codable[]) {
      const castChildren = children as Array<Theme | Code>;
      for (const child of castChildren) {
        if (self.store) {
          self.store.removeFromFamilyTree(child.id);
        }
        self.children.delete(child.id);
      }
    },
    reorder(startIndex: number, endIndex: number) {
      const children = [...values(self.children)];
      const [removed] = children.splice(startIndex, 1);
      children.splice(endIndex, 0, removed);

      this.abandon(children);
      this.adopt(children);

      return children;
    },
    insert(child: any, at: number) {
      const children = [...values(self.children)];
      children.splice(at, 0, child);

      this.abandon(children);
      this.adopt(children);

      return children;
    },
  }));

export type Theme = typeof ThemeModel.Type;
export type ThemeSnapshot = typeof ThemeModel.SnapshotType;
