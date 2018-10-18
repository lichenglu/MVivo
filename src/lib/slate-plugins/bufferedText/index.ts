import isHotkey from 'is-hotkey';
import { Change } from 'slate';

import {
  endSelection,
  mapSelectionToInlines,
} from '~/lib/slate-plugins/bufferedText/mapSelectionToInlines';

import { Highlight } from '../components';
// import { SelectToHighlight } from '../utils/changes';
import { INLINES } from '../utils/constants';
import { RenderHighlight } from '../utils/render';

import { Colors } from '~/themes';
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
    onKeyDown(event: KeyboardEvent, change: Change, next: Function) {
      if (isHotkey('Escape', event)) {
        if (!options.clearOnEscape) return next();
        const { value } = change;
        const { selection } = value;
        if (event.key !== 'Escape') return next();

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
            highlightColor: Colors.bufferedText,
            allowMultipleSelection: true,
          })
        );
      }
      return next();
    },
  };
}

export { Highlight, mapSelectionToInlines, endSelection };
