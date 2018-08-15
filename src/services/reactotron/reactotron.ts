import { onSnapshot } from "mobx-state-tree"
import { mst } from "reactotron-mst"
import Tron from "reactotron-react-js"
import { DEFAULT_REACTOTRON_CONFIG, ReactotronConfig } from "./reactotron-config"

import { RootStore } from "../../stores/root-store"

const __DEV__ = process.env.NODE_ENV === 'development';

// Teach TypeScript about the bad things we want to do.
declare global {
  interface Console {
    tron: typeof Tron
  }
}

/** Do Nothing. */
const noop = () => undefined

// in dev, we attach Reactotron, in prod we attach a interface-compatible mock.
if (__DEV__) {
  console.tron = Tron // attach reactotron to `console.tron`
} else {
  // attach a mock so if things sneaky by our __DEV__ guards, we won't crash.
  console.tron = {
    clear: noop,
    configure: noop,
    connect: noop,
    display: noop,
    error: noop,
    image: noop,
    log: noop,
    logImportant: noop,
    reportError: noop,
    trackMstNode: noop,
    use: noop,
  }
}

/**
 * You'll probably never use the service like this since we hang the Reactotron
 * instance off of `console.tron`. This is only to be consistent with the other
 * services.
 */
export class Reactotron {
  public readonly config: ReactotronConfig
  private rootStore: any

  /**
   * Create the Reactotron service.
   *
   * @param config the configuration
   */
  constructor(config: ReactotronConfig = DEFAULT_REACTOTRON_CONFIG) {
    // merge the passed in config with some defaults
    this.config = {
      clearOnLoad: true,
      host: "localhost",
      ...config,
      state: {
        initial: false,
        snapshots: false,
        ...(config && config.state),
      },
    }
  }

  /**
   * Hook into the root store for doing awesome state-related things.
   *
   * @param rootStore The root store
   */
  public setRootStore(rootStore: any, initialData: any) {
    if (__DEV__) {
      rootStore = rootStore as RootStore // typescript hack
      this.rootStore = rootStore
      
      if (this.config.state) {
        const { initial, snapshots } = this.config.state
        const name = "ROOT STORE"
  
        // logging features
        if (initial) {
          console.tron.display({ name, value: initialData, preview: "Initial State" })
        }
        // log state changes?
        if (snapshots) {
          onSnapshot(rootStore, snapshot => {
            console.tron.display({ name, value: snapshot, preview: "New State" })
          })
        }
  
        // @ts-ignore
        console.tron.trackMstNode(rootStore)
      }
    }
  }

  /**
   * Configure reactotron based on the the config settings passed in, then connect if we need to.
   */
  public async setup() {
    // only run this in dev...
    if (__DEV__) {
      // configure reactotron
      Tron.configure({
        host: this.config.host,
        name: this.config.name || require("../../../package.json").name,
      })

      // ignore some chatty `mobx-state-tree` actions
      const RX = /postProcessSnapshot|@APPLY_SNAPSHOT/

      // hookup mobx-state-tree middleware
      Tron.use(
        mst({
          filter: event => RX.test(event.name) === false,
        }),
      )

      // connect to the app
      Tron.connect()

      // clear if we should
      if (this.config.clearOnLoad) {
        Tron.clear()
      }
    }
  }
}