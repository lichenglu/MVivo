import { applySnapshot, getSnapshot, types } from 'mobx-state-tree';

import { assignUUID } from '../utils';

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

export type Code = typeof CodeModel.Type;
export type CodeSnapshot = typeof CodeModel.SnapshotType;
