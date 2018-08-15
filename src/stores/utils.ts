import * as uuid from 'uuid';

// @ts-ignore
export function assignUUID(snapshot) {
    if (!snapshot.id) {
        return { ...snapshot, id: uuid() };
      } else {
        return { ...snapshot };
      }
}