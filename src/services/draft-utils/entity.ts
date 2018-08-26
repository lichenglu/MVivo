import { ContentState } from 'draft-js';

import { DraftDecorator } from '~/lib/constants';

export const createBufferedCode = (
  contentState: ContentState,
  data: object = {}
) => contentState.createEntity(DraftDecorator.BUFFERED_CODE, 'MUTABLE', data);
