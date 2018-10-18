import { applySnapshot, getSnapshot, types } from 'mobx-state-tree';

import { CodeModel } from './code';

export const ThemeModel = CodeModel.named('Theme').props({
  children: types.optional(
    types.map(
      types.union(
        types.reference(CodeModel),
        types.reference(types.late((): any => ThemeModel))
      )
    ),
    {}
  ),
});

export type Theme = typeof ThemeModel.Type;
export type ThemeSnapshot = typeof ThemeModel.SnapshotType;
