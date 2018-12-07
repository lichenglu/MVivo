import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Scrollbar from '~/components/scrollbar';

import { Column, ColumnData } from './column';
import { ColumnAddition } from './columnAddition';

interface DraggyBoardProps {
  columns: ColumnData[];
  onDragEnd: (result: any) => void;
  onCreate: () => void;
}

const Container = styled(Scrollbar)`
  display: flex;
  padding: 8px;
  flex: 1;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex: 1;
`;

export class DraggyBoard extends React.PureComponent<DraggyBoardProps, {}> {
  public render() {
    const { columns, onCreate, onDragEnd } = this.props;
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          {columns && <ColumnAddition onCreate={onCreate} />}
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {provided => (
              <ColumnContainer
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {columns.map((column, idx) => (
                  <Column data={column} index={idx} key={column.id} />
                ))}
              </ColumnContainer>
            )}
          </Droppable>
        </Container>
      </DragDropContext>
    );
  }
}
