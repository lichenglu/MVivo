import { Change, Decoration, DecorationProperties, Mark } from 'slate';

import { hasMark } from './has';

import { SlatePlugin } from '~/lib/slate-plugins';

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
      const highlightMark = Mark.create({
        type: options.type,
        data: {
          bgColor: options.highlightColor,
        },
      });

      if (selection.isExpanded) {
        const { anchor, focus } = selection;

        // TODO: allowMultipleSelection only works for the true case
        const decorations = options.allowMultipleSelection
          ? change.value.decorations.toArray()
          : [];

        const decCandidate = Decoration.create({
          anchor,
          focus,
          mark: highlightMark,
        });

        let found = false;
        let nextDecorations: DecorationProperties[] = [];

        // Really? Does it have to be this complicated and stupid?!
        decorations.forEach(decoration => {
          if (!decoration) return;

          const { changed, result } = mergeDecoration(decCandidate, decoration);
          if (changed) {
            found = true;
          }
          nextDecorations = [...nextDecorations, ...result];
        });

        if (!found) {
          nextDecorations.push(decCandidate);
        }

        change
          .setOperationFlag('save', true)
          .setValue({ decorations: nextDecorations })
          .setOperationFlag('save', false);
        if (selection.isBackward) {
          change.moveToStart();
        } else {
          change.moveToEnd();
        }
      }
    },
  };
}

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
    decCandidate.start.key !== decoration.start.key ||
    decCandidate.end.key !== decoration.end.key
  ) {
    result.push(decoration);
    return { changed, result };
  }

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
