import React from 'react';
import styled from 'styled-components';

import { WorkSpaceSnapshot } from '~/stores';

import WorkspaceCard from './workspaceCard';

const Container = styled.div`
  flex: 1;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

interface WorkSpaceListProps {
  workSpaces: WorkSpaceSnapshot[];
  onEdit?: (params: any) => void;
  onSelectExtraAction?: (
    params: AntClickParam & { workSpaceID: string }
  ) => void;
  onBookmark: (
    params: {
      workSpaceID: string;
      bookmarked: boolean;
    }
  ) => void;
}

export default ({
  workSpaces,
  onSelectExtraAction,
  onBookmark,
}: WorkSpaceListProps) => (
  <Container>
    {workSpaces.map(ws => (
      <WorkspaceCard
        key={ws.id}
        data={ws}
        onSelectExtraAction={onSelectExtraAction}
        onBookmark={onBookmark}
      />
    ))}
  </Container>
);
