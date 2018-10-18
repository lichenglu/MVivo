import isHotkey from 'is-hotkey';
import { Change } from 'slate';
import { MARKS } from '../utils/constants';
import { RenderRichText } from './renderRichText';

interface RichTextOptions {
  enableHotKeys?: boolean;
}

export default function RichText({ enableHotKeys = true }: RichTextOptions) {
  return {
    ...RenderRichText(),
    onKeyDown(event: KeyboardEvent, change: Change, next: Function) {
      if (!enableHotKeys) return next();
      if (isHotkey('mod+b', event)) {
        change.toggleMark(MARKS.Bold);
      }
      if (isHotkey('mod+i', event)) {
        change.toggleMark(MARKS.Italic);
      }
      if (isHotkey('mod+u', event)) {
        change.toggleMark(MARKS.Underlined);
      }
      next();
    },
  };
}
