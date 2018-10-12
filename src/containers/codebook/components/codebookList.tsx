import React from 'react';
import styled from 'styled-components';

import { CodeBookSnapshot } from '~/stores';

import CodebookCard from './codebookCard';

const Container = styled.div`
  flex: 1;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

interface CodeBookListProps {
  codeBooks: CodeBookSnapshot[];
  onEdit?: (params: any) => void;
  onSelectExtraAction?: (
    params: AntClickParam & { codeBookID: string }
  ) => void;
}

export default ({
  codeBooks,
  onSelectExtraAction,
  onEdit,
}: CodeBookListProps) => (
  <Container>
    {codeBooks.map(codebook => (
      <CodebookCard
        key={codebook.id}
        data={codebook}
        onEdit={onEdit}
        onSelectExtraAction={onSelectExtraAction}
      />
    ))}
  </Container>
);
