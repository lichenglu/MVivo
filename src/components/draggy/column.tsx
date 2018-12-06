import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { Colors } from '~/themes';

import { DraggableCard, DraggableCardData } from './card';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 8px;
  border: solid 1px ${Colors.borderGray.toString()};
  border-radius: 5px;
  width: 18rem;
  overflow-y: hidden;
`;

const Header = styled.div<{ isDragging: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 2.5rem;
  border-bottom: solid 1px ${Colors.borderGray.toString()};
  background-color: ${({ isDragging }) =>
    isDragging ? Colors.surfGreen : '#fff'};
  color: ${({ isDragging }) => (isDragging ? '#fff' : 'none')};
`;

const Title = styled.p`
  width: 100%;
  margin: auto;
  flex: 1;
`;

const ContentContainer = styled.div`
  max-height: calc(100vh - 64px - 49px - 100px);
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
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
      <Draggable draggableId={title} index={+index}>
        {(dragProvided, snapshot) => (
          <Container
            ref={dragProvided.innerRef}
            {...dragProvided.dragHandleProps}
            {...dragProvided.draggableProps}
          >
            <Header isDragging={snapshot.isDragging}>
              <Title>{title}</Title>
            </Header>
            <Droppable droppableId={id.toString()}>
              {provided => (
                <ContentContainer
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {children.map((child, idx) => (
                    <DraggableCard data={child} key={idx} index={idx} />
                  ))}
                  {provided.placeholder}
                </ContentContainer>
              )}
            </Droppable>
          </Container>
        )}
      </Draggable>
    );
  }
}
