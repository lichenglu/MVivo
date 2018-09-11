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

        change.setValue({ decorations: nextDecorations });
        change.deselect();
      }
    },
  };
}

const mergeDecoration = (decCandidate: Decoration, decoration: Decoration) => {
  let changed = false;
  const result = [];
  const mark = decCandidate.mark;

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
    decCandidate.start.offset >= decoration.start.offset
  ) {
    changed = true;
    result.push({
      focus: decoration.start,
      anchor: decCandidate.end,
      mark,
    });
  } else if (
    decCandidate.end.offset <= decoration.end.offset &&
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
  } else {
    result.push(decoration);
  }

  return { changed, result };
};
