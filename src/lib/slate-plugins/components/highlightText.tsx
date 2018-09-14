import Color from 'color';
import React from 'react';
import { RenderMarkProps } from 'slate-react';
import styled from 'styled-components';

export interface HighlightContainerProps {
  hoverToEmphasize: boolean;
  bgColor: string;
  tint?: string;
}
export interface HighlightProps extends HighlightContainerProps {
  mark: RenderMarkProps['mark'];
  editor: RenderMarkProps['editor'];
  children?: RenderMarkProps['children'];
  attributes?: RenderMarkProps['attributes'];
}

const HighlightContainer = styled.span<HighlightContainerProps>`
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

export const Highlight = ({
  hoverToEmphasize,
  bgColor,
  tint,
  mark,
  editor,
  attributes,
  children,
}: HighlightProps) => (
  <HighlightContainer {...{ hoverToEmphasize, bgColor, tint }} {...attributes}>
    {children}
  </HighlightContainer>
);
