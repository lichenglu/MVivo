import { Inline, Node } from 'slate';

import { INLINES } from '../utils/constants';
import { RenderCodedText } from './renderCodedText';
import { updateCodeForBlocks } from './updateCodeForBlocks';
import { updateSelectedCode } from './updateSelectedCode';
import { getCodeSummary } from './getCodeSummary';

interface CodedTextOptions {
  onClickCodedText?: (data: { node: Node; codeIDs: string[] }) => void;
}

export default function CodedText({ onClickCodedText }: CodedTextOptions) {
  return {
    ...RenderCodedText({
      onClickCodedText,
      type: INLINES.CodedText,
    }),
  };
}

export { updateCodeForBlocks, updateSelectedCode, getCodeSummary };
