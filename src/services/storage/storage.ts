import * as localForage from 'localforage';

import { DEFAULT_STORAGE_CONFIG } from './storage-config';

export interface StorageAdapter {
  getItem<T>(key: string, callback?: (err: any, value: T) => void): Promise<T>;

  setItem<T>(key: string, value: T, callback?: (err: any, value: T) => void): Promise<T>;

  removeItem(key: string, callback?: (err: any) => void): Promise<void>;

  clear(callback?: (err: any) => void): Promise<void>;

  length(callback?: (err: any, numberOfKeys: number) => void): Promise<number>;

  key?(keyIndex: number, callback?: (err: any, key: string) => void): Promise<string>;

  keys?(callback?: (err: any, keys: string[]) => void): Promise<string[]>;

  iterate?<T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U,
          callback?: (err: any, result: U) => void): Promise<U>;
}

export class Storage {
  public readonly store: StorageAdapter;

  constructor(store: StorageAdapter = localForage.createInstance(DEFAULT_STORAGE_CONFIG)) {
    this.store = store;
  }

  public load = async (key: string): Promise<any | null> => {
    try {
      return await this.store.getItem(key)      
    } catch {
      return null
    }
  }

  public save = async (key: string, value: any): Promise<boolean> => {
    try {
      await this.store.setItem(key, value)      
      return true
    } catch {
      return false
    }
  }

  public remove = async (key: string): Promise<boolean> => {
    try {
      await this.store.removeItem(key)
      return true
    } catch (err) {
      console.tron.log(`[storage remove] failed: ${err.message}`)
      return false
    }
  }

  public clear = async (): Promise<boolean> => {
    try {
      await this.store.clear()
      return true
    } catch (err) {
      console.tron.log(`[storage remove] failed: ${err.message}`)
      return false
    }
  }
}

export const storage = new Storage()