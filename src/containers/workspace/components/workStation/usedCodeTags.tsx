import { Tag } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { CodeSnapshot } from '~/stores';

const Container = styled.div`
  margin-top: 1rem;
`;

const StyledTag = styled(Tag)`
  margin-bottom: 0.6rem;
`;

interface UsedCodeTagsProps {
  codes: CodeSnapshot[];
  onClose: (id: string) => void;
  onClick: (id: string) => void;
}

// TODO: Finish onClose and onClick fns
export const UsedCodeTags = ({
  codes,
  onClose,
  onClick,
}: UsedCodeTagsProps) => (
  <Container>
    {codes.slice(0, 5).map(code => (
      <StyledTag
        color={code.bgColor}
        onClose={onClose.bind(null, code.id)}
        onClick={onClick.bind(null, code.id)}
        key={code.id}
        closable
      >
        {code.name}
      </StyledTag>
    ))}
  </Container>
);
