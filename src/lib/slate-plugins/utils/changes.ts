import { Set } from 'immutable';
import { Change, Decoration, DecorationProperties, Mark } from 'slate';

import { hasMark } from './has';

import { SlatePlugin } from '~/lib/slate-plugins';
import { INLINES } from '~/lib/slate-plugins/utils/constants';

interface SelectToHighlightOptions {
  highlightColor: string;
  type: string;
  allowMultipleSelection?: boolean;
}

export function SelectToHighlight(
  options: SelectToHighlightOptions
): SlatePlugin {
  return {
    onChange: (change: Change) => {
      const selection = change.value.selection;
      const selectedText = change.value.fragment.text;
      const highlightMark = Mark.create({
        type: options.type,
        data: {
          bgColor: options.highlightColor,
        },
      });
      const { anchor, focus } = selection;
      const decCandidate = change.value.document.createDecoration({
        anchor,
        focus,
        mark: highlightMark,
      });

      if (selection.isExpanded) {
        const decorations = options.allowMultipleSelection
          ? change.value.decorations.toArray()
          : [change.value.decorations.toArray()[0]].filter(d => !!d);

        let found = false;
        let nextDecorations: DecorationProperties[] = [];

        // If the selection overlaps with any coded inlines
        if (decCandidate.start.key !== decCandidate.end.key) {
          nextDecorations = [...decorations, decCandidate];
        } else {
          // TODO: Really? Does it have to be this complicated and stupid?!
          decorations.forEach(decoration => {
            if (!decoration) return;

            const { changed, result } = mergeDecoration(
              decCandidate,
              decoration
            );

            if (changed) {
              found = true;
            }
            nextDecorations = [...nextDecorations, ...result];
          });

          if (!found) {
            nextDecorations.push(decCandidate);
          }

          if (!options.allowMultipleSelection && !found) {
            nextDecorations = [decCandidate];
          }
        }
        change
          .setOperationFlag('save', true)
          .setValue({ decorations: nextDecorations })
          .setOperationFlag('save', false);
        endSelection(change);
      }
    },
  };
}

const endSelection = (change: Change) => {
  if (change.value.selection.isBackward) {
    change.moveToStart();
  } else {
    change.moveToEnd();
  }
};

enum DecorationNormalization {
  overlapped = 'overlapped',
  sameStartShortEnd = 'sameStartShortEnd',
  sameEndShortStart = 'sameEndShortStart',
  completelyOverlapped = 'completelyOverlapped',
}

const mergeDecoration = (decCandidate: Decoration, decoration: Decoration) => {
  let changed = false;
  const result = [];
  const mark = decCandidate.mark;

  // we only deal with decoration within the same node
  // so this is basically a block level update
  if (
    decCandidate.start.offset > decoration.start.offset &&
    decCandidate.end.offset < decoration.end.offset
  ) {
    changed = true;
    result.push({
      focus: decoration.start,
      anchor: decCandidate.start,
      mark,
    });

    result.push({
      focus: decCandidate.end,
      anchor: decoration.end,
      mark,
    });
  } else if (
    decCandidate.start.offset === decoration.start.offset &&
    decCandidate.end.offset < decoration.end.offset
  ) {
    changed = true;
    result.push({
      focus: decCandidate.end,
      anchor: decoration.end,
      mark,
    });
  } else if (
    decCandidate.end.offset === decoration.end.offset &&
    decCandidate.start.offset > decoration.start.offset
  ) {
    changed = true;
    result.push({
      focus: decoration.start,
      anchor: decCandidate.start,
      mark,
    });
  } else if (
    decCandidate.end.offset === decoration.end.offset &&
    decCandidate.start.offset === decoration.start.offset
  ) {
    changed = true;
  } else if (
    decCandidate.end.offset > decoration.end.offset &&
    decCandidate.start.offset >= decoration.start.offset &&
    decCandidate.start.offset < decoration.end.offset
  ) {
    changed = true;
    result.push({
      focus: decoration.start,
      anchor: decCandidate.end,
      mark,
    });
  } else if (
    decCandidate.end.offset <= decoration.end.offset &&
    decCandidate.end.offset >= decoration.start.offset &&
    decCandidate.start.offset < decoration.start.offset
  ) {
    changed = true;
    result.push({
      focus: decCandidate.start,
      anchor: decoration.end,
      mark,
    });
  } else if (
    decCandidate.end.offset > decoration.end.offset &&
    decCandidate.start.offset < decoration.start.offset
  ) {
    changed = true;
    result.push(decCandidate);
  } else {
    result.push(decoration);
  }

  return { changed, result };
};
