import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { Colors } from '~/themes';

import { DraggableCard, DraggableCardData } from './card';
import { ColumnHeader } from './columnHeader';

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
  dragDisabled?: boolean;
}

export class Column extends React.PureComponent<ColumnProps, {}> {
  public render() {
    const {
      data,
      index,
      dropDisabled,
      dragDisabled,
      onTriggerAction,
    } = this.props;
    const { children, title, id } = data;

    return (
      <Draggable
        draggableId={title}
        index={+index}
        isDragDisabled={dragDisabled}
      >
        {(dragProvided, snapshot) => (
          <Container
            ref={dragProvided.innerRef}
            {...dragProvided.draggableProps}
          >
            <ColumnHeader
              title={title}
              isDragging={snapshot.isDragging}
              isDragDisabled={!!dragDisabled}
              handleAction={params =>
                onTriggerAction({ ...params, columnID: id })
              }
              {...dragProvided.dragHandleProps}
            />
            <Droppable
              droppableId={id.toString()}
              isDropDisabled={dropDisabled}
            >
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
