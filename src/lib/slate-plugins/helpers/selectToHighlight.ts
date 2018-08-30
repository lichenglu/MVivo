import { Change } from 'slate';

interface SelectToHighlightOptions {
  highlightColor: string;
  type: string;
}

export function selectToHighlight(
  options: SelectToHighlightOptions
): SlatePlugin {
  return {
    onChange: (change: Change) => {
      if (change.value.fragment.text) {
        change.insertInline({
          type: options.type,
          data: { bgColor: options.highlightColor },
        });
      }
    },
  };
}
