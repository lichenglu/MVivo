import styled from 'styled-components';

import { CodeSnapshot } from '~/stores';

import { RenderCodedText } from './renderCodedText';
import { updateCodeForBlocks } from './updateCodeForBlocks';

export const CodedTextCompnent = styled.span`
  font-size: 0.6rem;
  cursor: not-allowed;
`;

interface CodedTextOptions {
  codeMap: Map<string, CodeSnapshot>;
}

export default function CodedText({ codeMap }: CodedTextOptions) {
  return {
    ...RenderCodedText({ type: 'CodedText', codeMap }),
  };
}

export { updateCodeForBlocks };
