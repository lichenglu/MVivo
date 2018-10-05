import isHotkey from 'is-hotkey';
import { Change } from 'slate';

import { mapSelectionToInlines } from '~/lib/slate-plugins/bufferedText/mapSelectionToInlines';

import { Highlight } from '../components';
// import { SelectToHighlight } from '../utils/changes';
import { INLINES } from '../utils/constants';
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
      type: INLINES.BufferedText,
    }),
    schema: {
      inlines: {
        [INLINES.BufferedText]: {
          isAtomic: true,
        },
      },
    },
    onKeyDown(event: KeyboardEvent, change: Change) {
      if (isHotkey('Escape', event)) {
        if (!options.clearOnEscape) return;
        const { value } = change;
        const { selection } = value;
        if (event.key !== 'Escape') return;

        change.moveToRangeOfDocument();
        change.value.inlines.forEach(inline => {
          if (inline && inline.type === INLINES.BufferedText) {
            change.unwrapInline(inline);
          }
        });

        const edge = selection.isBackward ? 'Start' : 'End';
        return change.select(selection)[`moveTo${edge}`]();
      }
      if (isHotkey('mod+e', event)) {
        event.preventDefault();
        change.call(
          mapSelectionToInlines({
            type: INLINES.BufferedText,
            highlightColor: '#adb5bd',
            allowMultipleSelection: true,
          })
        );
      }
    },
  };
}

export { Highlight, mapSelectionToInlines };
