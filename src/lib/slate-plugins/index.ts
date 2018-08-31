import { Change } from 'slate';
import { RenderMarkProps, RenderNodeProps } from 'slate-react';

export interface SlatePlugin {
  onChange?: (change: Change) => void;
  renderNode?: (props: RenderNodeProps) => any;
  renderMark?: (props: RenderMarkProps) => any;
}

export * from './helpers';
export * from './features';
