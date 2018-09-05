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
      const text = change.value.fragment.text;
      if (text) {
        const selection = change.value.selection;
        const { anchor, focus } = selection;

        let decorations = options.allowMultipleSelection
          ? change.value.decorations.toArray()
          : [];

        const decCandidate = Decoration.create({
          anchor,
          focus,
          mark: highlightMark,
        });

        const nextDecorations = [];

        const candidateAnchorOffset = decCandidate.anchor.offset;
        const candidateFocusOffset = decCandidate.focus.offset;

        for (const decoration of decorations) {
          const anchorOffset = decoration.anchor.offset;
          const focusOffset = decoration.focus.offset;

          if (
            anchorOffset < candidateAnchorOffset &&
            focusOffset > candidateFocusOffset
          ) {
            nextDecorations.push({
              anchor: decoration.anchor,
              focus: {
                ...decoration.focus,
                offset: candidateAnchorOffset - anchorOffset,
              },
            });
          }
        }
        decorations = decorations.map(decoration => {
          const anchorOffset = decoration.anchor.offset;
          const focusOffset = decoration.focus.offset;

          const candidateAnchorOffset = decCandidate.anchor.offset;
          const candidateFocusOffset = decCandidate.focus.offset;

          if (
            (anchorOffset < candidateAnchorOffset &&
              focusOffset > candidateFocusOffset) ||
            (anchorOffset > candidateAnchorOffset &&
              focusOffset < candidateFocusOffset)
          ) {
            return {
              anchor: { ...decoration.anchor, offset: Math.abs() },
            };
          }
          return decorations;
        });

        console.log(decorations);

        change.setValue({ decorations });
      }
    },
  };
}
