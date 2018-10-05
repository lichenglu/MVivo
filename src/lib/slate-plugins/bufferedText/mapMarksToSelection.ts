import { Set } from 'immutable';
import { Change, Decoration, DecorationProperties, Mark, Value } from 'slate';
import { INLINES } from '~/lib/slate-plugins/utils/constants';

interface SelectToHighlightOptions {
  highlightColor: string;
  type: string;
  allowMultipleSelection?: boolean;
}

export const mapMarksToSelection = (options: SelectToHighlightOptions) => (
  change: Change
) => {
  const selection = change.value.selection;

  // The selection needs to be expanded in order for
  // us to buffer something
  if (!selection.isExpanded) return change;

  const selectedText = change.value.fragment.text;
  const highlightMark = Mark.create({
    type: options.type,
    data: {
      bgColor: options.highlightColor,
    },
  });
  const { anchor, focus } = selection;

  const decCandidate = change.value.document.createDecoration({
    anchor,
    focus,
    mark: highlightMark,
  });

  const decorations = options.allowMultipleSelection
    ? change.value.decorations.toArray()
    : [change.value.decorations.toArray()[0]].filter(d => !!d);

  let found = false;
  let nextDecorations: DecorationProperties[] = [];

  // If the selection overlaps with any coded inlines
  if (decCandidate.start.key !== decCandidate.end.key) {
    nextDecorations = [...decorations, decCandidate];
    // const inlines = change.value.inlines.toArray();
    // const inlineData: object[] = [];
    // for (const inline of inlines) {
    //   inlineData.push({
    //     text: inline.getText(),
    //     startIdx: selectedText.indexOf(inline.getText()),
    //     inline,
    //   });
    //   change.unwrapInline(inline);
    // }

    // nextDecorations = [
    //   ...decorations,
    //   {
    //     anchor: decCandidate.start,
    //     focus: {
    //       key: decCandidate.start.key,
    //       offset: decCandidate.start.offset + selectedText.length,
    //     },
    //     mark: decCandidate.mark,
    //   },
    // ];

    // change
    //   .withoutMerging(() => {
    //     change.setValue({ decorations: nextDecorations });
    //   })
    //   .normalize();

    // for (const data of inlineData.reverse()) {
    //   const { text, startIdx, inline } = data;
    //   const dec = change.value.decorations.last();
    //   console.log(decCandidate, dec);
    //   const range = change.value.document.createRange({
    //     anchor: {
    //       key: dec.start.key,
    //       offset: startIdx,
    //     },
    //     focus: {
    //       key: dec.start.key,
    //       offset: startIdx + text.length,
    //     },
    //   });
    //   change.wrapInlineAtRange(range, {
    //     type: inline.type,
    //     data: inline.data.toObject(),
    //   });
    // }
  } else {
    // TODO: Really? Does it have to be this complicated and stupid?!
    decorations.forEach(decoration => {
      if (!decoration) return;

      const { changed, result } = mergeDecoration(decCandidate, decoration);

      if (changed) {
        found = true;
      }
      nextDecorations = [...nextDecorations, ...result];
    });

    if (!found) {
      nextDecorations.push(decCandidate);
    }

    if (!options.allowMultipleSelection && !found) {
      nextDecorations = [decCandidate];
    }
  }
  return change
    .withoutNormalizing(() => {
      change.setValue({ decorations: nextDecorations });
    })
    .call(endSelection)
    .normalize();
};

const endSelection = (change: Change) => {
  if (change.value.selection.isBackward) {
    change.moveToStart();
  } else {
    change.moveToEnd();
  }
};

enum DecorationNormalization {
  overlapped = 'overlapped',
  sameStartShortEnd = 'sameStartShortEnd',
  sameEndShortStart = 'sameEndShortStart',
  completelyOverlapped = 'completelyOverlapped',
}

const mergeDecoration = (decCandidate: Decoration, decoration: Decoration) => {
  let changed = false;
  const result = [];
  const mark = decCandidate.mark;

  // we only deal with decoration within the same node
  // so this is basically a block level update
  if (
    decCandidate.start.offset > decoration.start.offset &&
    decCandidate.end.offset < decoration.end.offset
  ) {
    changed = true;
    result.push({
      focus: decoration.start,
      anchor: decCandidate.start,
      mark,
    });

    result.push({
      focus: decCandidate.end,
      anchor: decoration.end,
      mark,
    });
  } else if (
    decCandidate.start.offset === decoration.start.offset &&
    decCandidate.end.offset < decoration.end.offset
  ) {
    changed = true;
    result.push({
      focus: decCandidate.end,
      anchor: decoration.end,
      mark,
    });
  } else if (
    decCandidate.end.offset === decoration.end.offset &&
    decCandidate.start.offset > decoration.start.offset
  ) {
    changed = true;
    result.push({
      focus: decoration.start,
      anchor: decCandidate.start,
      mark,
    });
  } else if (
    decCandidate.end.offset === decoration.end.offset &&
    decCandidate.start.offset === decoration.start.offset
  ) {
    changed = true;
  } else if (
    decCandidate.end.offset > decoration.end.offset &&
    decCandidate.start.offset >= decoration.start.offset &&
    decCandidate.start.offset < decoration.end.offset
  ) {
    changed = true;
    result.push({
      focus: decoration.start,
      anchor: decCandidate.end,
      mark,
    });
  } else if (
    decCandidate.end.offset <= decoration.end.offset &&
    decCandidate.end.offset >= decoration.start.offset &&
    decCandidate.start.offset < decoration.start.offset
  ) {
    changed = true;
    result.push({
      focus: decCandidate.start,
      anchor: decoration.end,
      mark,
    });
  } else if (
    decCandidate.end.offset > decoration.end.offset &&
    decCandidate.start.offset < decoration.start.offset
  ) {
    changed = true;
    result.push(decCandidate);
  } else {
    result.push(decoration);
  }

  return { changed, result };
};
