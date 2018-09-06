import React from 'react';

import { CodedTextComponent } from '../components';

import { SlatePlugin } from '~/lib/slate-plugins';
import { CodeSnapshot } from '~/stores';

export interface CodedTextProps {
  bgColor: string;
  selected: boolean;
}

interface RenderCodedTextOptions {
  codeMap: Map<string, CodeSnapshot>;
  type: string;
}

export function RenderCodedText({ type }: RenderCodedTextOptions): SlatePlugin {
  return {
    renderNode: props => {
      const { node, attributes, children, isSelected } = props;
      if (node.get('type') === type) {
        const data = node.get('data');
        const codeIDs: string[] = data.get('codeIDs');

        return (
          <CodedTextComponent
            attributes={attributes}
            selected={isSelected}
            codeIDs={codeIDs}
            children={children}
          />
        );
      }
    },
  };
}
