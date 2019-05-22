import { TFAsiaLAModel } from '~/services/tensorflow/tf-asia-la';

import { Change } from 'slate';

interface AutoCodeOptions {
  model?: TFAsiaLAModel;
  debounce?: number;
}

export default function AutoCode({ model, debounce = 80 }: AutoCodeOptions) {
  let timer: number;

  return {
    onChange: (change: Change) => {
      if (!model) {
        return change;
      }

      const selection = change.value.selection;
      // The selection needs to be expanded in order for
      // us to buffer something
      if (!selection.isExpanded) return change;
      const selectedText = change.value.fragment.text;

      clearTimeout(timer);

      timer = setTimeout(async () => {
        const res = await model.predict(selectedText);
        console.log(`For selected text: ${selectedText}: `, res);
      }, debounce);

      return change;
    },
  };
}
