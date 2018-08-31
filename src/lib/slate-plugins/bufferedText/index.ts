import { SlatePlugin } from '~/lib/slate-plugins';

import { HighlightComponent } from '../components';
import { SelectToHighlight } from '../utils/changes';
import { RenderHighlight } from '../utils/render';

export function BufferedText(options?) {
  return {
    plugins: [
      SelectToHighlight({ type: 'BufferedText', highlightColor: '#adb5bd' }),
      RenderHighlight({ type: 'BufferedText' }),
    ],
  };
}
