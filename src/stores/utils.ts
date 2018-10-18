import { Value, ValueJSON } from 'slate';

import { types } from 'mobx-state-tree';
import uuid from 'uuid/v4';

// @ts-ignore
export function assignUUID(snapshot) {
  if (!snapshot.id) {
    return { ...snapshot, id: uuid() };
  } else {
    return { ...snapshot };
  }
}

export const EditorContentState = types.custom<ValueJSON, Value>({
  name: 'EditorContentState',
  fromSnapshot(state: ValueJSON): Value {
    return Value.fromJSON(state);
  },
  toSnapshot(state: Value): ValueJSON {
    return state.toJSON();
  },
  isTargetType: (value: Value) => {
    return value instanceof Value;
  },
  getValidationMessage: (value: Value | ValueJSON) => {
    if (!value) {
      return 'Invalid content state';
    }
    return '';
  },
});
