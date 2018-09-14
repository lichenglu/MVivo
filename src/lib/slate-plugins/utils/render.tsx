import React from 'react';
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
      mark: RenderMarkProps['mark'];
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
    renderMark: props => {
      const { mark, attributes, children, editor } = props;

      if (mark.get('type') === type) {
        const data = mark.get('data');
        const bgColor = data.get('bgColor');

        return (
          <Component
            hoverToEmphasize={hoverToEmphasize}
            bgColor={bgColor}
            mark={mark}
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
