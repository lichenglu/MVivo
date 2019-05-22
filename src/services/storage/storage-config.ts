interface StorageConfig {
  name?: string;

  storeName?: string;

  driver?: string | string[];

  size?: number;

  version?: number;

  description?: string;
}
/**
 * The default Reactotron configuration.
 */
const testing = process.env.NODE_ENV === 'testing';
export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  name: testing ? 'MVivo_test' : 'MVivo',
  storeName: testing ? 'mvivo_core_test' : 'mvivo_core',
};
