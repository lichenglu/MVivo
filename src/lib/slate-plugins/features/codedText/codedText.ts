import styled from 'styled-components';

import { RenderCodedText, updateCodeForBlocks } from '~/lib/slate-plugins';
import { CodeSnapshot } from '~/stores';

export const CodedTextCompnent = styled.span`
  font-size: 0.6rem;
  cursor: not-allowed;
`;

interface CodedTextOptions {
  codeMap: Map<string, CodeSnapshot>;
}

export function CodedText({ codeMap }: CodedTextOptions) {
  return {
    changes: {
      updateCodeForBlocks,
    },
    helpers: {},
    plugins: [RenderCodedText({ type: 'CodedText', codeMap })],
  };
}
