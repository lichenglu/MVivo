import React from 'react';
import { RenderMarkProps } from 'slate-react';

import { SlatePlugin } from '~/lib/slate-plugins';

export interface RenderHighlightOptions {
  type: string;
  hoverToEmphasize?: boolean;
  AnchorComponent?: (props: RenderMarkProps) => JSX.Element;
  Component: (
    props: {
      hoverToEmphasize: boolean;
      bgColor: string;
    } & RenderMarkProps
  ) => JSX.Element;
}

export function RenderHighlight({
  type,
  AnchorComponent,
  hoverToEmphasize = true,
  Component,
}: RenderHighlightOptions): SlatePlugin {
  return {
    renderMark: props => {
      const { mark, attributes, children } = props;

      if (mark.get('type') === type) {
        const data = mark.get('data');
        const bgColor = data.get('bgColor');

        return (
          <Component
            hoverToEmphasize={hoverToEmphasize}
            bgColor={bgColor}
            {...attributes}
          >
            {AnchorComponent && <AnchorComponent {...props} />}
            {children}
          </Component>
        );
      }
    },
  };
}
