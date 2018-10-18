import { Change, Inline } from 'slate';

interface SelectToHighlightOptions {
  highlightColor: string;
  type: string;
  allowMultipleSelection?: boolean;
}

export const mapSelectionToInlines = (options: SelectToHighlightOptions) => (
  change: Change
) => {
  const selection = change.value.selection;

  // The selection needs to be expanded in order for
  // us to buffer something
  if (!selection.isExpanded) return change;

  const highlightInline = Inline.create({
    type: options.type,
    data: {
      bgColor: options.highlightColor,
    },
  });

  return change.wrapInline(highlightInline).call(endSelection);
};

export const endSelection = (change: Change) => {
  if (change.value.selection.isBackward) {
    change.moveToStart();
  } else {
    change.moveToEnd();
  }
};
