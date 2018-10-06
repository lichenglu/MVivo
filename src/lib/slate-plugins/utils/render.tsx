import React from 'react';
import { Inline } from 'slate';
import { RenderMarkProps } from 'slate-react';

import { SlatePlugin } from '~/lib/slate-plugins';

import { Highlight } from '../components';

export interface RenderHighlightOptions {
  type: string;
  hoverToEmphasize?: boolean;
  AnchorComponent?: (props: RenderMarkProps) => JSX.Element;
  Component?: (
    props: {
      hoverToEmphasize: boolean;
      bgColor: string;
      inline: Inline;
      editor: RenderMarkProps['editor'];
      children?: RenderMarkProps['children'];
      attributes?: RenderMarkProps['attributes'];
    }
  ) => JSX.Element;
}

export function RenderHighlight({
  type,
  AnchorComponent,
  hoverToEmphasize = true,
  Component = props => <Highlight {...props} />,
}: RenderHighlightOptions): SlatePlugin {
  return {
    renderNode: props => {
      const { node, attributes, children, editor } = props;

      if (node instanceof Inline && node.get('type') === type) {
        const data = node.get('data');
        const bgColor = data.get('bgColor');

        return (
          <Component
            hoverToEmphasize={hoverToEmphasize}
            bgColor={bgColor}
            inline={node}
            editor={editor}
            attributes={attributes}
          >
            {AnchorComponent && <AnchorComponent {...props} />}
            {children}
          </Component>
        );
      }
    },
  };
}
