import { Change } from 'slate';

import { SlatePlugin } from '~/lib/slate-plugins';

import { Highlight } from '../components';
import { SelectToHighlight } from '../utils/changes';
import { MARKS } from '../utils/constants';
import { RenderHighlight } from '../utils/render';

interface BufferedText {
  clearOnEscape?: boolean;
}

export default function BufferedText(options: BufferedText = {}) {
  return {
    ...SelectToHighlight({
      type: MARKS.BufferedText,
      highlightColor: '#adb5bd',
      allowMultipleSelection: true,
    }),
    ...RenderHighlight({
      type: MARKS.BufferedText,
    }),
    schema: {
      marks: {
        [MARKS.BufferedText]: {
          isAtomic: true,
        },
      },
    },
    onKeyDown(event: KeyboardEvent, change: Change) {
      if (!options.clearOnEscape) return;
      const { value } = change;
      const { selection } = value;
      if (event.key !== 'Escape') return;

      change.setValue({ decorations: [] });

      const edge = selection.isBackward ? 'Start' : 'End';
      return change[`moveTo${edge}`]();
    },
  };
}

export { Highlight };
