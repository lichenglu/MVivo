import Color from 'color';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { ColorGrid } from '../colorGrid';

import { Colors } from '~/themes';

import { trimText } from '~/lib/utils';

const Container = styled.div<{ isDragging: boolean; bgColor?: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5rem;
  margin-bottom: 8px;
  border: solid 1px ${Colors.borderGray.toString()};
  border-radius: 5px;
  width: 100%;
  background-color: ${({ isDragging, bgColor }) =>
    isDragging
      ? Color(bgColor)
          .lighten(0.5)
          .toString()
      : '#fff'};
  transition: 0.2s;
  box-shadow: ${({ isDragging }) =>
    isDragging ? `0px 0.5px 0.5px 0.5px ${Colors.shadowGray}` : null};
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Description = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 0.5rem;
`;

export interface DraggableCardData {
  id: string | number;
  content: string;
  description?: string;
  color?: string;
}

interface DraggableCardProps {
  data: DraggableCardData;
  index: number;
}

export class DraggableCard extends React.PureComponent<DraggableCardProps, {}> {
  public render() {
    const { data, index } = this.props;
    const { id, color, content, description } = data;

    return (
      <Draggable draggableId={id.toString()} index={index}>
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            bgColor={color}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Title>
              {color && <ColorGrid bgColor={color} />}
              {content}
            </Title>

            {description && (
              <Description>{trimText(description, 'tail', 100)}</Description>
            )}
          </Container>
        )}
      </Draggable>
    );
  }
}
