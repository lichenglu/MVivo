import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  RawDraftContentState,
} from 'draft-js';
import { types } from 'mobx-state-tree';
import uuid from 'uuid';

// @ts-ignore
export function assignUUID(snapshot) {
  if (!snapshot.id) {
    return { ...snapshot, id: uuid() };
  } else {
    return { ...snapshot };
  }
}

export const DraftContentState = types.custom<
  RawDraftContentState,
  ContentState
>({
  name: 'DraftEditorContent',
  fromSnapshot(state: RawDraftContentState): ContentState {
    return convertFromRaw(state);
  },
  toSnapshot(state: ContentState): RawDraftContentState {
    return convertToRaw(state);
  },
  isTargetType: (value: ContentState) => {
    return value instanceof ContentState;
  },
  getValidationMessage: (value: ContentState | RawDraftContentState) => {
    if (!value) {
      return 'Invalid content state';
    }
    return '';
  },
});
