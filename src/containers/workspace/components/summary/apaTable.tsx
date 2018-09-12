import React from 'react';
import { withProps } from 'recompose';
import styled from 'styled-components';

import { CodeSnapshot } from '~/stores';

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

interface APATableProps {
  columns?: Array<{ title: string; dataIndex: string; key: string }>;
  rows: Array<CodeSnapshot & { count: number; examples: string[] }>;
}

const enhance = withProps(({ rows, columns }: APATableProps) => {
  const finalColumns = columns || [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Definition',
      dataIndex: 'definition',
      key: 'definition',
    },
    {
      title: 'Examples',
      dataIndex: 'examples',
      key: 'examples',
      render: (examples: string[]) =>
        examples.map((example, idx) => (
          <p key={`${example.slice(0, 10)}_${idx}`}>{example}</p>
        )),
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  let formattedRows: string[][] = [];
  for (const row of rows) {
    formattedRows = [
      ...formattedRows,
      finalColumns.map(column => {
        if (column.render) {
          return column.render(row[column.dataIndex]);
        }
        return row[column.dataIndex];
      }),
    ];
  }

  console.log(formattedRows);
  return {
    columns: finalColumns,
    rows: formattedRows,
  };
});

const _APATable = ({
  rows,
  columns,
}: {
  columns: APATableProps['columns'];
  rows: string[][];
}) => (
  <Table>
    <tr>
      {columns.map(column => (
        <th key={column.key}>{column.title}</th>
      ))}
    </tr>
    {rows.map((row, idx) => (
      <tr key={idx}>
        {row.map((value, valIdx) => (
          <td key={`${value}_${valIdx}`}>{value}</td>
        ))}
      </tr>
    ))}
  </Table>
);

export const APATable = enhance(_APATable);
