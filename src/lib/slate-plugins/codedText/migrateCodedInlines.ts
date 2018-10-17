import { Editor } from 'slate-react';

import { INLINES } from '../utils/constants';

export const migrateCodedInlines = ({
  mapper,
  editor,
  type = INLINES.CodedText,
}: {
  mapper: { [key: string]: string };
  editor: Editor;
  type?: INLINES;
}) => {
  editor.change(change => {
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
  });
  return editor;
};
