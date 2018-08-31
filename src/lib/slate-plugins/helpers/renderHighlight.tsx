import Color from 'color';
import React from 'react';
import { RenderMarkProps } from 'slate-react';
import styled from 'styled-components';

import { SlatePlugin } from '~/lib/slate-plugins';

export interface HighlightProps {
  bgColor: string;
  hoverToEmphasize: boolean;
  tint?: string;
}

export const HighlightComponent = styled.span<HighlightProps>`
  background-color: ${({ bgColor }) => bgColor};
  transition: 0.3s;
  color: ${({ tint }) => tint || '#fff'};
  &:hover {
    background-color: ${({ bgColor, hoverToEmphasize }) =>
      hoverToEmphasize
        ? Color(bgColor)
            .darken(0.3)
            .toString()
        : bgColor};
  }
`;

export interface RenderHighlightOptions {
  type: string;
  hoverToEmphasize?: boolean;
  AnchorComponent?: (props: RenderMarkProps) => JSX.Element;
}

export function RenderHighlight({
  type,
  AnchorComponent,
  hoverToEmphasize = true,
}: RenderHighlightOptions): SlatePlugin {
  return {
    renderMark: props => {
      const { mark, attributes, children } = props;

      if (mark.get('type') === type) {
        const data = mark.get('data');
        const bgColor = data.get('bgColor');

        return (
          <HighlightComponent
            hoverToEmphasize={hoverToEmphasize}
            bgColor={bgColor}
            {...attributes}
          >
            {AnchorComponent && <AnchorComponent {...props} />}
            {children}
          </HighlightComponent>
        );
      }
    },
  };
}
