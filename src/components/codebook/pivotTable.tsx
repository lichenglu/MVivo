import { sum as RSum } from 'ramda';
import React from 'react';
import ReactTable, { Column, TableProps } from 'react-table';
import 'react-table/react-table.css';

import { compose, pure, withProps } from 'recompose';
import styled from 'styled-components';

import { EditableText, EditableTextProps } from '~/components/editableText';

import { ColorGrid } from '../colorGrid';
import { CodeBookRow } from './index';

interface PivotTableProps<Record> extends TableProps<Record> {
  codes: Record[];
  columns: Array<Column<Record>>;
  rowKey: string;
  omittedColumns: Array<'count' | 'examples'>;
  onChangeDefinition: (data: EditableTextProps) => void;
}

const CodeNameContainer = styled.div`
  display: flex;
  align-items: center;
`;

const enhance = compose(
  withProps(
    ({
      onChangeDefinition,
      omittedColumns = [],
      ...rest
    }: PivotTableProps<CodeBookRow>) => {
      const columns: Array<Column<CodeBookRow>> = [
        {
          Header: 'Group',
          accessor: d => (d.parent ? d.parent.name : 'First Level Codes'),
          Cell: row => <span>{row.value}</span>,
          id: 'theme',
          maxWidth: 200,
        },
        {
          Header: 'Name',
          // accessor: ({ name, bgColor }) => name + bgColor,
          id: 'name',
          Cell: row => {
            return (
              row.original && (
                <CodeNameContainer>
                  <ColorGrid bgColor={row.original.bgColor} />
                  {row.original.name}
                </CodeNameContainer>
              )
            );
          },
          maxWidth: 200,
        },
        {
          Header: 'Definition',
          id: 'definition',
          Cell: row =>
            row.original && (
              <EditableText
                text={row.original.definition}
                onChangeText={onChangeDefinition}
                codeID={row.original.id}
                placeholder={'Input the code definition here'}
              />
            ),
        },
        {
          Header: 'Coded Texts',
          accessor: 'examples',
          id: 'examples',
          Cell: row =>
            row.value
              ? row.value.map((example: string, idx: number) => (
                  <p
                    key={`${idx}_${example.slice(0, 5)}`}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {example}
                  </p>
                ))
              : null,
        },
        {
          Header: 'Count',
          accessor: 'count',
          id: 'count',
          aggregate: values => {
            // count can be undefined if there is no example associated with the code
            return RSum(values.map((val: number | undefined) => val || 0));
          },
          Aggregated: row => {
            // You can even render the cell differently if it's an aggregated cell
            return <span>{row.value} examples</span>;
          },
          Cell: row => row.value || null,
          maxWidth: 100,
        },
      ];

      return {
        ...rest,
        columns,
      };
    }
  ),
  pure
);

const _PivotTable = ({
  codes,
  columns,
  rowKey,
}: Partial<PivotTableProps<CodeBookRow>>) => (
  <ReactTable
    columns={columns}
    data={codes}
    pivotBy={['theme']}
    defaultPageSize={10}
  />
);

export const PivotTable = enhance<PivotTableProps<CodeBookRow>>(_PivotTable);
