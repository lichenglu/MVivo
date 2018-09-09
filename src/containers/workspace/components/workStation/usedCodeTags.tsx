import { Tag } from 'antd';
import React from 'react';
import FlipMove from 'react-flip-move';
import { withHandlers } from 'recompose';
import styled from 'styled-components';

import { CodeSnapshot } from '~/stores';

const Container = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

const StyledTag = styled(Tag)`
  margin-bottom: 0.6rem;
`;

const EnhancedTag = withHandlers<any, any>({
  // @ts-ignore
  handleClose: ({ onClose, code }) => e => {
    e.stopPropagation();
    if (onClose) {
      onClose(code);
    }
  },
  // @ts-ignore
  handleClick: ({ onClick, code }) => () => {
    if (onClick) {
      onClick(code);
    }
  },
  // @ts-ignore
})(({ handleClose, handleClick, onClose, onClick, ...rest }) => (
  <StyledTag {...rest} onClick={handleClick} onClose={handleClose} />
));

interface UsedCodeTagsProps {
  codes: CodeSnapshot[] | null;
  onClose: (code: CodeSnapshot) => void;
  onClick: (code: CodeSnapshot) => void;
}

// TODO: Finish onClose and onClick fns
export const UsedCodeTags = ({
  codes,
  onClose,
  onClick,
}: UsedCodeTagsProps) => (
  <Container>
    {codes &&
      codes.slice(0, 5).map(code => (
        <EnhancedTag
          color={code.bgColor}
          onClose={onClose}
          onClick={onClick}
          code={code}
          key={code.id}
          closable
        >
          {code.name}
        </EnhancedTag>
      ))}
  </Container>
);
