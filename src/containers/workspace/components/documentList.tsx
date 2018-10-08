import { Icon } from 'antd';
import Color from 'color';
import React from 'react';
import styled from 'styled-components';

import { trimText } from '~/lib/utils';
import { DocumentSnapshot } from '~/stores';
import { Colors } from '~/themes';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const DocContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  margin-bottom: 0.6rem;
  margin-right: 0.3rem;
  margin-left: 0.3rem;

  width: calc(25% - 0.6rem);
  height: 5rem;

  @media (min-width: 500px) {
    width: calc(10% - 0.6rem);
  }
`;

const DocIcon = styled(Icon)`
  font-size: 4rem;
  margin-bottom: 6px;
  &:hover {
    color: ${Colors.surfGreenDark.toString()};
    transition: 0.2s;
  }
`;

const AddDocIcon = styled(DocIcon)`
  font-size: 4rem;
  color: ${Colors.paleRed};
  &:hover {
    color: ${Color(Colors.paleRed)
      .darken(0.2)
      .toString()};
    transition: 0.2s;
  }
`;

interface DocumentListProps {
  documents: DocumentSnapshot[] | null;
  onOpenFile: ({ document }: { document: DocumentSnapshot }) => void;
  onCreate: () => void;
}

export default ({ documents, onOpenFile, onCreate }: DocumentListProps) => (
  <Container>
    {documents &&
      documents
        .map(doc => (
          <DocContainer
            key={doc.id}
            onClick={() => onOpenFile({ document: doc })}
          >
            <DocIcon type="file-text" theme="outlined" />
            <span>{trimText(doc.name, 'tail', 16)}</span>
          </DocContainer>
        ))
        .concat([
          <DocContainer key="doc_creation" onClick={onCreate}>
            <AddDocIcon type="file-add" theme="outlined" />
            <span>Add a document</span>
          </DocContainer>,
        ])}
    {!documents && <p>No document</p>}
  </Container>
);
