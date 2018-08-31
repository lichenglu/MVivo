import Color from 'color';
import React from 'react';
import styled from 'styled-components';

import { SlatePlugin } from '~/lib/slate-plugins';
import { trimText } from '~/lib/utils';
import { CodeSnapshot } from '~/stores';

export interface CodedTextProps {
  bgColor: string;
  selected: boolean;
}

const CodedText = styled.span<CodedTextProps>`
  background-color: ${({ bgColor, selected }) =>
    selected
      ? Color(bgColor)
          .darken(0.3)
          .toString()
      : bgColor};
  color: #fff;
  transition: 0.3s;
  &:hover {
    background-color: ${({ bgColor }) =>
      Color(bgColor)
        .darken(0.3)
        .toString()};
    cursor: pointer;
  }
  &:focus {
    background-color: ${({ bgColor }) =>
      Color(bgColor)
        .darken(0.3)
        .toString()};
  }
`;

const CodeName = styled.span`
  font-size: 0.6rem;
  cursor: not-allowed;
`;

interface RenderCodedTextOptions {
  codeMap: Map<string, CodeSnapshot>;
  type: string;
}

export function RenderCodedText({
  type,
  codeMap,
}: RenderCodedTextOptions): SlatePlugin {
  return {
    renderNode: props => {
      const { node, attributes, children, isSelected } = props;
      if (node.get('type') === type) {
        const data = node.get('data');
        const codeIDs: string[] = data.get('codeIDs');

        const codes = codeIDs.map(id => codeMap.get(id)).filter(c => !!c);
        const primaryCode = codes[0];

        return primaryCode ? (
          <CodedText
            {...attributes}
            bgColor={primaryCode.bgColor}
            selected={isSelected}
          >
            <CodeName>{`[${trimText(
              codes.map(c => c && c.name).join(', ')
            )}]`}</CodeName>
            {children}
          </CodedText>
        ) : null;
      }
    },
  };
}
