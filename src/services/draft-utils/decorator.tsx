import Color from 'color';
import { CompositeDecorator, ContentBlock, ContentState } from 'draft-js';
import React from 'react';
import styled from 'styled-components';

import { DraftDecorator } from '~/lib/constants';

export type Strategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => void;

export const bufferedCodeStrategy: Strategy = (
  contentBlock,
  callback,
  contentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    if (entityKey === null) {
      return false;
    }
    const entity = contentState.getEntity(entityKey);
    return entity.getType() === DraftDecorator.BUFFERED_CODE;
  }, callback);
};

export const normalCodeStrategy: Strategy = (
  contentBlock,
  callback,
  contentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    if (entityKey === null) {
      return false;
    }
    const entity = contentState.getEntity(entityKey);
    return entity.getType() === DraftDecorator.CODE;
  }, callback);
};

export interface DecaratorComponentProps {
  contentState: ContentState;
  children: any;
  entityKey: string;
  offsetkey: string;
}

const BufferedCodeText = styled.span`
  background-color: #afb2b7;
  color: #fff;
  &:hover {
    background-color: #a0a0a0;
    transition: 0.3s;
  }
`;
export const BufferedCode = (props: DecaratorComponentProps) => {
  return (
    <BufferedCodeText data-offset-key={props.offsetkey}>
      {props.children}
    </BufferedCodeText>
  );
};

export interface NormalCodeTextProps {
  bgColor: string;
  codeID: string;
}

const NormalCodeText = styled.span<NormalCodeTextProps>`
  background-color: ${({ bgColor }) => bgColor};
  color: #fff;
  transition: 0.3s;
  &:hover {
    background-color: ${({ bgColor }) =>
      Color(bgColor)
        .darken(0.3)
        .toString()};
  }
  &:focus {
    background-color: ${({ bgColor }) =>
      Color(bgColor)
        .darken(0.3)
        .toString()};
  }
`;
export const NormalCode = (props: DecaratorComponentProps) => {
  const entity = props.contentState.getEntity(props.entityKey);
  const data: NormalCodeTextProps = entity.getData();
  return (
    <NormalCodeText data-offset-key={props.offsetkey} {...data}>
      {props.children}
    </NormalCodeText>
  );
};

export const codingDecorator = new CompositeDecorator([
  {
    strategy: bufferedCodeStrategy,
    component: BufferedCode,
  },
  {
    strategy: normalCodeStrategy,
    component: NormalCode,
  },
]);
