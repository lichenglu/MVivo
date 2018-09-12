import React from 'react';
import { Inline, Node } from 'slate';

import { CodedTextComponent } from '../components';

import { SlatePlugin } from '~/lib/slate-plugins';

export interface CodedTextProps {
  bgColor: string;
  selected: boolean;
}

interface RenderCodedTextOptions {
  type: string;
  onClickCodedText?: (data: { node: Node; codeIDs: string[] }) => void;
  mixBgColor?: boolean;
}

export function RenderCodedText({
  type,
  onClickCodedText,
  mixBgColor,
}: RenderCodedTextOptions): SlatePlugin {
  return {
    renderNode: props => {
      const { node, attributes, children, editor, isSelected } = props;

      if (node instanceof Inline && node.get('type') === type) {
        const data = node.get('data');
        const codeIDs: string[] = data.get('codeIDs');

        return (
          <CodedTextComponent
            attributes={attributes}
            selected={isSelected}
            codeIDs={codeIDs}
            onClick={() => {
              onClickCodedText && onClickCodedText({ node, codeIDs });
            }}
            children={children}
            mixBgColor={mixBgColor}
          />
        );
      }
    },
  };
}
