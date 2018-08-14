/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export async function loadString(key: string): Promise<string | null> {
  try {
    return await localStorage.getItem(key)
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    await localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export async function load(key: string): Promise<any | null> {
  try {
    const almostThere = await localStorage.getItem(key)
    return almostThere ? JSON.parse(almostThere) : null
  } catch {
    return null
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function save(key: string, value: any): Promise<boolean> {
  try {
    if (typeof value === 'object') {
      await localStorage.setItem(key, JSON.stringify(value))
    } else {
      await localStorage.setItem(key, value)
    }
    return true
  } catch {
    return false
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export async function remove(key: string): Promise<void> {
  try {
    await localStorage.removeItem(key)
  } catch (err) {
    console.tron.log(`[storage remove] failed: ${err.message}`)
  }
}

/**
 * Burn it all to the ground.
 */
export async function clear(): Promise<void> {
  try {
    await localStorage.clear()
  } catch (err) {
    console.tron.log(`[storage remove] failed: ${err.message}`)
  }
}
