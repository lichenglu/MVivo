import styled from 'styled-components';

import { CodeSnapshot } from '~/stores';

import { INLINES } from '../utils/constants';
import { RenderCodedText } from './renderCodedText';
import { updateCodeForBlocks } from './updateCodeForBlocks';

interface CodedTextOptions {
  codeMap: Map<string, CodeSnapshot>;
}

export default function CodedText({ codeMap }: CodedTextOptions) {
  return {
    ...RenderCodedText({ type: INLINES.CodedText, codeMap }),
  };
}

export { updateCodeForBlocks };
