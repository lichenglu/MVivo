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
    renderNode: (props, next) => {
      const { node, parent, attributes, children, editor, isSelected } = props;

      if (node instanceof Inline && node.get('type') === type) {
        const data = node.get('data');
        const codeIDs: string[] = data.get('codeIDs');

        const handleSummaryClick = (e: React.MouseEvent<HTMLElement>) => {
          e.stopPropagation();
          editor.change(change => {
            change.moveToRangeOfNode(node).moveToEnd();
          });
        };

        return (
          <CodedTextComponent
            attributes={attributes}
            selected={isSelected}
            codeIDs={codeIDs}
            node={node}
            parent={parent}
            onClick={e => {
              e.stopPropagation();
              onClickCodedText && onClickCodedText({ node, codeIDs });
            }}
            onClickSummary={handleSummaryClick}
            children={children}
            mixBgColor={mixBgColor}
          />
        );
      }
      return next();
    },
  };
}
