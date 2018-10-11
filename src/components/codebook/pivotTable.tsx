import { Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';

import { EditableText, EditableTextProps } from '~/components/editableText';

import { ColorGrid } from '../colorGrid';
import { CodeBookRow } from './index';

interface PivotTableProps<Record> extends TableProps<Record> {
  codes: Record[];
  columns: Array<ColumnProps<Record>>;
  rowKey: string;
  omittedColumns: Array<'count' | 'examples'>;
  onChangeDefinition: (data: EditableTextProps) => void;
}

const CodeNameContainer = styled.div`
  display: flex;
  align-items: center;
`;

const enhance = withProps(
  ({
    onChangeDefinition,
    omittedColumns = [],
    ...rest
  }: PivotTableProps<CodeBookRow>) => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name: string, record: CodeBookRow) => (
          <CodeNameContainer>
            <ColorGrid bgColor={record.bgColor} />
            {name}
          </CodeNameContainer>
        ),
      },
      {
        title: 'Definition',
        dataIndex: 'definition',
        key: 'definition',
        width: '25%',
        render: (definition: string, record: CodeBookRow) => (
          <EditableText
            text={definition}
            onChangeText={onChangeDefinition}
            codeID={record.id}
            placeholder={'Input the code definition here'}
          />
        ),
      },
      {
        title: 'Coded Texts',
        dataIndex: 'examples',
        key: 'examples',
        render: (examples: string[]) => (
          <React.Fragment>
            {examples.map((example, idx) => (
              <p key={idx}>{example}</p>
            ))}
          </React.Fragment>
        ),
        width: '40%',
      },
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
      },
    ];

    return {
      ...rest,
      columns: columns.filter(
        column => !omittedColumns.includes(column.dataIndex)
      ),
    };
  }
);

const _PivotTable = ({
  codes,
  columns,
  rowKey,
}: Partial<PivotTableProps<CodeBookRow>>) => (
  <Table
    columns={columns}
    dataSource={codes}
    rowKey={rowKey}
    pagination={false}
  />
);

export const PivotTable = enhance<PivotTableProps<CodeBookRow>>(_PivotTable);
