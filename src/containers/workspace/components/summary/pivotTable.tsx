import { Input, Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import React from 'react';
import { withProps } from 'recompose';

import { CodeSnapshot } from '~/stores';

import { Definition } from './definitionEdit';

interface PivotTableProps
  extends TableProps<CodeSnapshot & { count: number; examples: string[] }> {
  codes: Array<CodeSnapshot & { count: number; examples: string[] }>;
  columns: object[];
  rowKey: string;
  onChangeDefinition: (data: { codeID: string; definition: string }) => void;
}

const enhance = withProps(({ onChangeDefinition, ...rest }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Definition',
      dataIndex: 'definition',
      key: 'definition',
      width: '25%',
      render: (
        definition: string,
        record: CodeSnapshot & { count: number; examples: string[] }
      ) => (
        <Definition
          definition={definition}
          onChangeDefinition={onChangeDefinition}
          codeID={record.id}
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
    columns,
  };
});

const _PivotTable = ({ codes, columns, rowKey }: Partial<PivotTableProps>) => (
  <Table
    columns={columns}
    dataSource={codes}
    rowKey={rowKey}
    pagination={false}
  />
);

export const PivotTable = enhance<any>(_PivotTable);
