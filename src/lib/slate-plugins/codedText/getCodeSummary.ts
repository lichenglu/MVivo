import { Value } from 'slate';
import { INLINES } from '../utils/constants';

export const getCodeSummary = ({
  value,
  type = INLINES.CodedText,
}: {
  value: Value;
  type?: INLINES;
}) => {
  const change = value.change({});
  change.moveToRangeOfDocument();

  const codeSummary = {};
  change.value.inlines.forEach(inline => {
    if (inline && inline.type === type) {
      const data = inline.get('data');
      const codeIDs = data.get('codeIDs');

      const text = inline.getText();

      for (const codeID of codeIDs) {
        codeSummary[codeID] = codeSummary[codeID] || { count: 0, examples: [] };
        codeSummary[codeID] = {
          ...codeSummary[codeID],
          count: codeSummary[codeID].count + 1,
          examples: [...codeSummary[codeID].examples, text],
        };
      }
    }
  });
  return codeSummary;
};
