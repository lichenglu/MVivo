import { types } from "mobx-state-tree"
import { CodeBookStore } from "./codebook"

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  codeBookStore: types.optional(CodeBookStore, {}),
})

/**
 * The RootStore instance.
 */
export type RootStore = typeof RootStoreModel.Type

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = typeof RootStoreModel.SnapshotType