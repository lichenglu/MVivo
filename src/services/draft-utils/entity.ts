import { ContentState, DraftEntityMutability } from 'draft-js';

import { NormalCodeTextProps } from './decorator';

import { DraftDecorator } from '~/lib/constants';

const createCodeFactory = <T = {}>(
  type: DraftDecorator,
  mutability: DraftEntityMutability = 'MUTABLE'
) => (contentState: ContentState, data?: T) =>
  contentState.createEntity(type, mutability, data);

export const createBufferedCode = createCodeFactory<object>(
  DraftDecorator.BUFFERED_CODE
);

export const createNormalCode = createCodeFactory<NormalCodeTextProps>(
  DraftDecorator.CODE
);
