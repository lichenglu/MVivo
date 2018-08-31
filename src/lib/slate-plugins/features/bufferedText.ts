import { SlatePlugin } from '~/lib/slate-plugins';

import { RenderHighlight, SelectToHighlight } from '../helpers';

export function BufferedText(options?) {
  return {
    plugins: [
      SelectToHighlight({ type: 'BufferedText', highlightColor: '#adb5bd' }),
      RenderHighlight({ type: 'BufferedText' }),
    ],
  };
}
