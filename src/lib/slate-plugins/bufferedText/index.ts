import { SlatePlugin } from '~/lib/slate-plugins';

import { Highlight } from '../components';
import { SelectToHighlight } from '../utils/changes';
import { MARKS } from '../utils/constants';
import { RenderHighlight } from '../utils/render';

export default function BufferedText(options?) {
  return {
    ...SelectToHighlight({
      type: MARKS.BufferedText,
      highlightColor: '#adb5bd',
    }),
    ...RenderHighlight({
      type: MARKS.BufferedText,
    }),
  };
}

export { Highlight };
