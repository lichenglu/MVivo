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
    isDragging ? Colors.blueGray.toString() : Colors.ivoryWhite};
  color: ${({ isDragging }) => (isDragging ? Colors.ivoryWhite : 'none')};
  transition: background-color 0.2s ease, color 0.1s ease;
  &:hover {
    background-color: ${Colors.blueGray.toString()};
    color: ${Colors.ivoryWhite};
  }
`;

const Title = styled.p`
  width: 100%;
  margin: auto;
  flex: 1;
`;

const ContentContainer = styled.div<{
  isDraggingOver: boolean;
  isDropDisabled: boolean;
}>`
  max-height: calc(100vh - 64px - 49px - 100px);
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;

  transition: background-color 0.1s ease, opacity 0.1s ease;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
  background-color: ${({ isDraggingOver }) =>
    isDraggingOver
      ? Colors.blueGray.lighten(0.4).toString()
      : Colors.background};
`;

export interface ColumnData {
  id: string | number;
  title: string;
  children: DraggableCardData[];
}

interface ColumnProps {
  data: ColumnData;
  index: string | number;
  dropDisabled?: boolean;
}

export class Column extends React.PureComponent<ColumnProps, {}> {
  public render() {
    const { data, index, dropDisabled } = this.props;
    const { children, title, id } = data;

    return (
      <Draggable draggableId={title} index={+index}>
        {(dragProvided, snapshot) => (
          <Container
            ref={dragProvided.innerRef}
            {...dragProvided.draggableProps}
          >
            <Header
              isDragging={snapshot.isDragging}
              {...dragProvided.dragHandleProps}
            >
              <Title>{title}</Title>
            </Header>
            <Droppable droppableId={id.toString()}>
              {(provided, dropSnapshot) => (
                <ContentContainer
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={dropSnapshot.isDraggingOver}
                  isDropDisabled={!!dropDisabled}
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
