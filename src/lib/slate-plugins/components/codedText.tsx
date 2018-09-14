import Color from 'color';
import { inject } from 'mobx-react';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { trimText } from '~/lib/utils';
import { RootStore } from '~/stores/root-store';

export interface CodedTextContainerProps {
  bgColor: string;
  selected: boolean;
}

export const CodedTextContainer = styled.span<CodedTextContainerProps>`
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

export const CodeName = styled.span`
  font-size: 0.6rem;
  cursor: not-allowed;
`;

export interface CodedTextProps {
  selected: boolean;
  codeIDs: string[];
  attributes: object;
  children: ReactNode;
  onClick?: () => void;
  onClickSummary?: (e: React.MouseEvent<HTMLElement>) => void;
  rootStore?: RootStore;
  mixBgColor?: boolean;
}

export const CodedTextComponent = inject('rootStore')(
  ({
    codeIDs,
    rootStore,
    attributes,
    selected,
    onClick,
    onClickSummary,
    mixBgColor,
    children,
  }: CodedTextProps) => {
    if (!rootStore) return null;

    const codes = codeIDs
      .map(id => rootStore.codeBookStore.codes.get(id))
      .filter(c => !!c);
    const primaryCode = codes[0];

    if (!primaryCode) {
      console.warn(`There is no code attached to this inline.`);
      return null;
    }

    let bgColor;
    if (mixBgColor) {
      bgColor = codes
        .slice(1)
        .reduce((cur, next) => {
          return next ? cur.mix(Color(next.bgColor)) : cur;
        }, Color(primaryCode.bgColor))
        .toString();
    } else {
      bgColor = primaryCode.bgColor;
    }

    return (
      <CodedTextContainer
        {...attributes}
        bgColor={bgColor}
        selected={selected}
        onClick={onClick}
      >
        <CodeName onClick={onClickSummary}>{`[${trimText(
          codes.map(c => c && c.name).join(', '),
          'middle',
          30
        )}]`}</CodeName>
        {children}
      </CodedTextContainer>
    );
  }
);
