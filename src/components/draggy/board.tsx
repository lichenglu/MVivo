import React from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd-next';

import { Column, ColumnData } from './column';
import { ColumnAddition } from './columnAddition';

interface DraggyBoardProps {
  columns: ColumnData[];
  onDragEnd: (result: any) => void;
  onCreate: () => void;
}

const Container = styled.div`
  display: flex;
  padding: 8px;
  flex: 1;
  overflow-x: auto;
`;

export class DraggyBoard extends React.PureComponent<DraggyBoardProps, {}> {
  public render() {
    const { columns, onCreate, onDragEnd } = this.props;
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          {columns && <ColumnAddition onCreate={onCreate} />}
          {columns.map((column, idx) => (
            <Column data={column} index={idx} key={column.id} />
          ))}
        </Container>
      </DragDropContext>
    );
  }
}
