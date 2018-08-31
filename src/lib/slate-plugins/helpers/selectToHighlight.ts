import { Change, Mark } from 'slate';

import { SlatePlugin } from '~/lib/slate-plugins';

interface SelectToHighlightOptions {
  highlightColor: string;
  type: string;
}

export function SelectToHighlight(
  options: SelectToHighlightOptions
): SlatePlugin {
  const mark = Mark.create({
    type: options.type,
    data: { bgColor: options.highlightColor },
  });

  return {
    onChange: (change: Change) => {
      if (change.value.fragment.text) {
        change.toggleMark(mark);
      }
    },
  };
}
