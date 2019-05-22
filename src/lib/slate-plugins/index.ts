import { Change } from 'slate';
import { Editor, RenderMarkProps, RenderNodeProps } from 'slate-react';

interface RenderEditorProps {
  editor: Editor;
}

export interface SlatePlugin {
  onChange?: (change: Change) => void;
  /**
   * Note: This is not Slate's internal selection representation (although it mirrors it).
   * If you want to get notified when Slate's selection changes, use the onChange property of the <Editor>.
   * This handler is instead meant to give you lower-level access to the DOM selection handling,
   * which is not always triggered as you'd expect.
   */
  onSelect?: (event: Event, change: Change, next: Function) => Change;
  renderMark?: (props: RenderMarkProps, next: Function) => any;
  renderNode?: (props: RenderNodeProps, next: Function) => any;
  renderEditor?: (props: RenderEditorProps, next: Function) => any;
}

export * from './bufferedText';
export { default as BufferedText } from './bufferedText';
export * from './codedText';
export { default as AutoCode } from './autocode';
export { default as CodedText } from './codedText';
export { default as SoftBreak } from './softbreak';
export { default as RichText } from './richText';
export { default as HoverMenu } from './hoverMenu';
export * from './utils/serialize';
