import { Change, Mark } from 'slate';

import { SlatePlugin } from '~/lib/slate-plugins';

interface SelectToHighlightOptions {
  highlightColor: string;
  type: string;
}

export function SelectToHighlight(
  options: SelectToHighlightOptions
): SlatePlugin {
  return {
    onChange: (change: Change) => {
      const text = change.value.fragment.text;
      if (text) {
        const mark = Mark.create({
          type: options.type,
          data: {
            bgColor: options.highlightColor,
            range: change.value.selection,
          },
        });
        change.toggleMark(mark);
      }
    },
  };
}
