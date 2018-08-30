import Color from 'color';
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  EntityInstance,
} from 'draft-js';
import { inject, observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';

import { DraftDecorator } from '~/lib/constants';
import { trimText } from '~/lib/utils';
import { RootStore } from '~/stores/root-store';

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

export interface DecoratorComponentProps {
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
export const BufferedCode = (props: DecoratorComponentProps) => {
  return (
    <BufferedCodeText data-offset-key={props.offsetkey}>
      {props.children}
    </BufferedCodeText>
  );
};

export interface NormalCodeTextProps {
  bgColor: string;
  codeIDs: string[];
  selected: boolean;
}

const NormalCodeText = styled.span<NormalCodeTextProps>`
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

// TODO: think of a more elegant way to get rid of mobx injection
// so as to make the component dummy
export const NormalCode = inject('rootStore')(
  (
    props: DecoratorComponentProps & {
      rootStore: RootStore;
      currentEntity: EntityInstance;
    }
  ) => {
    const entity = props.contentState.getEntity(props.entityKey);
    const data: NormalCodeTextProps = entity.getData();
    const codes = data.codeIDs
      .map(id => props.rootStore.codeBookStore.codes.get(id))
      .filter(c => !!c);
    const primaryCode = codes[0];
    const selected = data.selected;

    return primaryCode ? (
      <NormalCodeText
        data-offset-key={props.offsetkey}
        bgColor={primaryCode.bgColor}
        codeIDs={data.codeIDs}
        selected={selected}
      >
        <CodeName>{`[${trimText(
          codes.map(c => c && c.name).join(', ')
        )}]`}</CodeName>
        {props.children}
      </NormalCodeText>
    ) : (
      props.children
    );
  }
);

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
