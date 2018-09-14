import { Change } from 'slate';
import { Editor, RenderMarkProps, RenderNodeProps } from 'slate-react';

export interface SlatePlugin {
  onChange?: (change: Change) => void;
  /**
   * Note: This is not Slate's internal selection representation (although it mirrors it).
   * If you want to get notified when Slate's selection changes, use the onChange property of the <Editor>.
   * This handler is instead meant to give you lower-level access to the DOM selection handling,
   * which is not always triggered as you'd expect.
   */
  onSelect?: (event: Event, change: Change, editor: Editor) => Change;
  renderMark?: (props: RenderMarkProps) => any;
  renderNode?: (props: RenderNodeProps) => any;
}

export * from './bufferedText';
export { default as BufferedText } from './bufferedText';
export * from './codedText';
export { default as CodedText } from './codedText';
export { default as SoftBreak } from './softbreak';
