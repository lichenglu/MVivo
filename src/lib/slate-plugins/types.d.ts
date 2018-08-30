import { Change } from 'slate';
import { RenderNodeProps } from 'slate-react';

declare interface SlatePlugin {
  onChange?: (change: Change) => void;
  renderNode?: (props: RenderNodeProps) => any;
}
