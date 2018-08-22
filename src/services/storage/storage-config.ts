interface StorageConfig {
  name?: string

  storeName?: string

  driver?: string | string[]

  size?: number

  version?: number

  description?: string
}
/**
 * The default Reactotron configuration.
 */
export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  name: 'MVivo',
  storeName: 'mvivo_core'
}
