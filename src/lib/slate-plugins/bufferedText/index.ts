import { SlatePlugin } from '~/lib/slate-plugins';

import { Highlight } from '../components';
import { SelectToHighlight } from '../utils/changes';
import { RenderHighlight } from '../utils/render';

export default function BufferedText(options?) {
  return {
    ...SelectToHighlight({ type: 'BufferedText', highlightColor: '#adb5bd' }),
    ...RenderHighlight({
      type: 'BufferedText',
    }),
  };
}

export { Highlight };
