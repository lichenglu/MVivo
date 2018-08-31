import Color from 'color';
import React from 'react';
import styled from 'styled-components';

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
