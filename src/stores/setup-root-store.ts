import { onSnapshot } from "mobx-state-tree"
import { RootStore, RootStoreModel } from "./root-store"

import { Environment } from "~/lib/env"
import * as storage from "~/lib/storage"
import { Api } from "~/services/api"
import { Reactotron } from "~/services/reactotron"

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = "root"
const __DEV__ = process.env.NODE_ENV
const ENABLE_PERSISTENCE = process.env.ENABLE_PERSISTENCE

/**
 * Setup the root state.
 */
export async function setupRootStore() {
  let rootStore: RootStore
  let data: any

  // prepare the environment that will be associated with the RootStore.
  const env = await createEnvironment()
  
  try {
    // load data from storage
    data = (await storage.load(ROOT_STATE_STORAGE_KEY)) || {}
    // https://github.com/mobxjs/mobx-state-tree#dependency-injection
    rootStore = RootStoreModel.create(data, env)
  } catch {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    rootStore = RootStoreModel.create({}, env)
  }

  // reactotron logging
  if (__DEV__) {
    env.reactotron.setRootStore(rootStore, data)
  }

  if (!ENABLE_PERSISTENCE) {
    await storage.remove(ROOT_STATE_STORAGE_KEY)
  }
  
  onSnapshot(rootStore, snapshot => storage.save(ROOT_STATE_STORAGE_KEY, snapshot))
  
  return rootStore
}

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This is how we loosly couple things
 * like events between models.
 */
export async function createEnvironment() {
  const env = new Environment()

  // create each service
  env.reactotron = new Reactotron()
  env.api = new Api()

  // allow each service to setup
  await env.reactotron.setup()
  await env.api.setup()

  return env
}