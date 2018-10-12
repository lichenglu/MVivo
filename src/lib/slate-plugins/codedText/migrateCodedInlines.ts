import { Value } from 'slate';

import { INLINES } from '../utils/constants';

export const migrateCodedInlines = ({
  mapper,
  value,
  type = INLINES.CodedText,
}: {
  mapper: { [key: string]: string };
  value: Value;
  type?: INLINES;
}) => {
  const change = value.change({});
  change.moveToRangeOfDocument();

  change.value.inlines
    .toArray()
    .filter(inline => inline && inline.type === type)
    .forEach(inline => {
      const data = inline.data;
      const codeIDs: string[] = data.get('codeIDs');
      change.moveToRangeOfNode(inline).setInlines({
        data: {
          codeIDs: codeIDs.map(codeID => mapper[codeID]).filter(id => !!id),
        },
      });
    });

  return change;
};
