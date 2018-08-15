import { types } from "mobx-state-tree"

import { assignUUID } from './utils';

export const CodeModel = types.model('Code', {
  definition: types.string,
  id: types.identifier,
  name: types.string,
})
.preProcessSnapshot(assignUUID)

export const CodeBookModel = types.model('CodeBook', {
  codes: types.optional(types.array(types.reference(CodeModel)), []),
  id: types.identifier,
  name: types.string,
})
.preProcessSnapshot(assignUUID)

export const CodeBookStore = types
  .model("CodeBookStore", {
      codeBooks: types.optional(types.map(CodeBookModel), {}),
      codes: types.optional(types.map(CodeModel), {}),
  })
  .views(self => ({
    codeBookOf(id: string) {
      return self.codeBooks.get(id)
    }
  }))

export type Code = typeof CodeModel.Type
export type CodeBook = typeof CodeBookModel.Type
export type CodeSnapshot = typeof CodeModel.SnapshotType
export type CodesSnapshot = typeof CodeBookModel.SnapshotType['codes']
export type CodeBookSnapshot = typeof CodeBookModel.SnapshotType
