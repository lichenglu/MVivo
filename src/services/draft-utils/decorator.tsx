import { CompositeDecorator, ContentBlock, ContentState } from 'draft-js';
import React from 'react';
import styled from 'styled-components';

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
    return !!contentState.getEntity(entityKey);
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

export const codingDecorator = new CompositeDecorator([
  {
    strategy: bufferedCodeStrategy,
    component: BufferedCode,
  },
]);
