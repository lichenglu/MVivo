import { Change, Decoration, Mark } from 'slate';

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
  const highlightMark = Mark.create({
    type: options.type,
    data: {
      bgColor: options.highlightColor,
    },
  });
  return {
    onChange: (change: Change) => {
      const selection = change.value.selection;
      if (selection.isExpanded) {
        const { anchor, focus } = selection;

        let decorations = options.allowMultipleSelection
          ? change.value.decorations.toArray()
          : [];

        const decCandidate = Decoration.create({
          anchor,
          focus,
          mark: highlightMark,
        });

        let found = false;
        const nextDecorations = [];

        for (const decoration of decorations) {
          if (
            decCandidate.start.offset > decoration.start.offset &&
            decCandidate.end.offset < decoration.end.offset
          ) {
            found = true;
          } else {
            nextDecorations.push(decoration);
          }
        }

        if (!found) {
          nextDecorations.push(decCandidate);
        }

        change.setValue({ decorations: nextDecorations });
      }
    },
  };
}
