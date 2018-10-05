import isHotkey from 'is-hotkey';
import { Change } from 'slate';

import { mapMarksToSelection } from './mapMarksToSelection';

import { Highlight } from '../components';
// import { SelectToHighlight } from '../utils/changes';
import { MARKS } from '../utils/constants';
import { RenderHighlight } from '../utils/render';

interface BufferedText {
  clearOnEscape?: boolean;
}

export default function BufferedText(options: BufferedText = {}) {
  return {
    // ...SelectToHighlight({
    //   type: MARKS.BufferedText,
    //   highlightColor: '#adb5bd',
    //   allowMultipleSelection: true,
    // }),
    ...RenderHighlight({
      type: MARKS.BufferedText,
    }),
    // schema: {
    //   marks: {
    //     [MARKS.BufferedText]: {
    //       isAtomic: true,
    //     },
    //   },
    // },
    onKeyDown(event: KeyboardEvent, change: Change) {
      if (isHotkey('Escape', event)) {
        if (!options.clearOnEscape) return;
        const { value } = change;
        const { selection } = value;
        if (event.key !== 'Escape') return;

        change.setValue({
          decorations: change.value.decorations
            .toArray()
            .filter(d => d.mark.type !== MARKS.BufferedText),
        });

        const edge = selection.isBackward ? 'Start' : 'End';
        return change[`moveTo${edge}`]();
      }
      if (isHotkey('mod+e', event)) {
        event.preventDefault();
        change.call(
          mapMarksToSelection({
            type: MARKS.BufferedText,
            highlightColor: '#adb5bd',
            allowMultipleSelection: true,
          })
        );
      }
    },
  };
}

export { Highlight, mapMarksToSelection };
