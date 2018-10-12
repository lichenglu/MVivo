import { Button } from 'antd';
import React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';

import { export2Word } from '~/lib/utils';
import { CodeBookRow } from './index';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  & #apa-table {
    width: 100%;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  border: 2px solid black;
  border-right: none;
  border-left: none;

  font-size: 12px;

  & th {
    border-top: 2px solid black;
    border-bottom: 1px solid black;
    border-right: none;
    border-left: none;
    font-weight: 500;
  }

  & td {
    border: none;
  }
`;

const ExportBtn = styled<any>(Button)`
  margin-bottom: 1rem;
`;

interface Column {
  title: string;
  dataIndex: string;
  key: string;
  style?: object;
}

type Row = Array<{ value: any; style?: object }>;
interface APATableProps {
  columns?: Column[];
  rows: CodeBookRow[];
  omittedColumns?: Array<'count' | 'examples'>;
}

const enhance = withProps(
  ({ rows, columns, omittedColumns = [] }: APATableProps) => {
    const finalColumns =
      columns ||
      [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Definition',
          dataIndex: 'definition',
          key: 'definition',
          style: { width: '15%' },
        },
        {
          title: 'Examples',
          dataIndex: 'examples',
          key: 'examples',
          render: (examples?: string[]) =>
            examples &&
            examples.map((example, idx) => (
              <p key={`${example.slice(0, 10)}_${idx}`}>{example}</p>
            )),
          style: { width: '30%' },
        },
        {
          title: 'Count',
          dataIndex: 'count',
          key: 'count',
          style: { textAlign: 'center' },
        },
      ].filter(column => !omittedColumns.includes(column.dataIndex));

    let formattedRows: Row[] = [];
    for (const row of rows) {
      const newRow = finalColumns.map(column => {
        return {
          value: column.render
            ? column.render(row[column.dataIndex])
            : row[column.dataIndex],
          style: column.style,
        };
      });
      formattedRows = [...formattedRows, newRow];
    }

    return {
      columns: finalColumns,
      rows: formattedRows,
      exportToWord: () =>
        export2Word({
          element: document.getElementById('docx'),
          containerID: 'apa-table',
          docName: 'APA Table',
        }),
    };
  }
);

const _APATable = ({
  rows,
  columns,
  exportToWord,
}: {
  columns: Column[];
  rows: Row[];
  exportToWord: () => void;
}) => (
  <Container id="docx">
    <ExportBtn onClick={exportToWord}>Export Word</ExportBtn>
    <div id="apa-table">
      <Table>
        <tbody>
          <tr>
            {columns.map(column => (
              <th key={column.key} style={column.style}>
                {column.title}
              </th>
            ))}
          </tr>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map(({ value, style }, valIdx) => (
                <td key={`${value}_${valIdx}`} style={style}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </Container>
);

export const APATable = enhance(_APATable);
