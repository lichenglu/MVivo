import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd-next';

import { Colors } from '~/themes';

import { DraggableCard, DraggableCardData } from './card';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5rem;
  margin-right: 8px;
  border: solid 1px ${Colors.borderGray.toString()};
  border-radius: 5px;
  min-width: 230px;
`;

const Title = styled.p`
  text-align: center;
  border-bottom: solid 1px ${Colors.borderGray.toString()};
  padding-bottom: 0.5rem;
  width: 100%;
`;

export interface ColumnData {
  id: string | number;
  title: string;
  children: DraggableCardData[];
}

interface ColumnProps {
  data: ColumnData;
  index: string | number;
}

export class Column extends React.PureComponent<ColumnProps, {}> {
  public render() {
    const { data, index } = this.props;
    const { children, title, id } = data;

    return (
      <Droppable droppableId={id}>
        {provided => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            <Title>{title}</Title>
            {children.map((child, idx) => (
              <DraggableCard data={child} key={child.id} index={idx} />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );
  }
}
