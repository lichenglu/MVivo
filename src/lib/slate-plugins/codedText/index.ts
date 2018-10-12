import { Inline, Node } from 'slate';

import { INLINES } from '../utils/constants';
import { getCodeSummary } from './getCodeSummary';
import { migrateCodedInlines } from './migrateCodedInlines';
import { RenderCodedText } from './renderCodedText';
import { updateCodeForBlocks } from './updateCodeForBlocks';
import { updateSelectedCode } from './updateSelectedCode';

interface CodedTextOptions {
  onClickCodedText?: (data: { node: Node; codeIDs: string[] }) => void;
  mixBgColor?: boolean;
}

export default function CodedText({
  onClickCodedText,
  mixBgColor,
}: CodedTextOptions) {
  return {
    ...RenderCodedText({
      onClickCodedText,
      type: INLINES.CodedText,
      mixBgColor,
    }),
  };
}

export {
  updateCodeForBlocks,
  updateSelectedCode,
  getCodeSummary,
  migrateCodedInlines,
};
