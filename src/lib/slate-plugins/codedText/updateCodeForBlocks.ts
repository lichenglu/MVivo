import { Change, Inline } from 'slate';
import { Editor } from 'slate-react';

import { INLINES } from '../utils/constants';

interface UpdateCodeForBlocks {
  codeID: string;
  action: 'add' | 'delete';
  editor: Editor;
  type?: string;
}

export interface CodedTextMarkData {
  codeIDs: string[];
}

export function updateCodeForBlocks({
  codeID,
  type = INLINES.CodedText,
  action,
  editor,
}: UpdateCodeForBlocks) {
  if (action === 'add') {
    return addCode({
      codeID,
      type,
      editor,
    });
  } else if (action === 'delete') {
    return removeCode({
      codeID,
      type,
      editor,
    });
  }
}

export const addCode = ({
  codeID,
  type = INLINES.CodedText,
  editor,
}: {
  codeID: string;
  editor: Editor;
  type?: string;
}) => {
  editor.change(change => {
    change.moveToRangeOfDocument();
    const originalRange = change.value.selection;
    change.value.inlines.forEach(inline => {
      console.log(inline);
      if (inline && inline.type === INLINES.BufferedText) {
        change.moveToRangeOfNode(inline);

        const codedInline = Inline.create({
          type,
          data: { codeIDs: [codeID] },
        });

        const nestedInlines = inline.nodes.toArray().filter(node => {
          return node instanceof Inline && node.type === INLINES.CodedText;
        });

        change = change.unwrapInline(inline).wrapInline(codedInline);

        // This is the step to merge nested inlines with the same codeID
        // with the parent inline. It is important to do this step LAST, because
        // merging could end up with structure change, which will in turn fail
        // parent inline creation
        if (nestedInlines.length > 0) {
          safelyUnwrapCodedInlines({
            inlines: nestedInlines as Inline[],
            change,
            type,
            codeID,
          });
        }
      }
    });
    change.select(originalRange).moveToStart();
  });
};

const removeCode = ({
  codeID,
  type = INLINES.CodedText,
  editor,
}: {
  codeID: string;
  editor: Editor;
  type?: string;
}) => {
  editor.change(change => {
    change.moveToRangeOfDocument();
    safelyUnwrapCodedInlines({
      change,
      codeID,
      inlines: change.value.inlines.toArray(),
      type,
    });
    change.deselect();
  });
};
/**
 * safelyUnwrapCodedInlines
 * This function will remove target codeID in passed inlines
 * and it will unwrap inlines if the coded inline becomes empty
 * @param {object} params
 */
export const safelyUnwrapCodedInlines = ({
  inlines,
  change,
  type,
  codeID,
}: {
  inlines: Inline[];
  change: Change;
  type: string;
  codeID: string;
}) => {
  inlines.forEach(inline => {
    if (inline && inline.type === type) {
      const codeIDs: string[] = inline.get('data').get('codeIDs');

      // pre-exit if target code is not even in the inline
      if (!codeIDs.includes(codeID)) {
        return;
      }

      change.moveToRangeOfNode(inline);

      const nextCodeIDs = codeIDs.filter(id => id !== codeID);
      const shouldRMInline = nextCodeIDs.length === 0;

      shouldRMInline
        ? change.unwrapInline(inline)
        : change.setInlines({
            data: { codeIDs: nextCodeIDs },
          });
    }
  });
};
