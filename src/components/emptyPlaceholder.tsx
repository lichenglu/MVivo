import React from 'react';
import SVGInline from 'react-svg-inline';
import styled from 'styled-components';

import { Colors } from '../themes';

import Plus from '../assets/plus.svg';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Description = styled.p`
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: ${Colors.textLightGray};
  font-weight: 300;
`;

const IconContainer = styled.div`
  width: 12rem;
  height: 12rem;
  cursor: pointer;
`;

const CustIcon = styled(SVGInline)`
  width: 100%;
  height: 100%;
  &:hover {
    & path {
      fill: ${Colors.surfGreen};
      transition: 0.5s;
    }
  }
`;

interface EmptyPlaceholderProps {
  description: string;
  Icon?: new () => React.Component<any, any>;
  onClick?: () => void;
}

export default ({ description, Icon, onClick }: EmptyPlaceholderProps) => (
  <Container>
    <Description>{description}</Description>
    <IconContainer onClick={onClick}>
      {!Icon && <CustIcon svg={Plus} />}
      {Icon && <Icon style={{ width: '100%', height: '100%' }} />}
    </IconContainer>
  </Container>
);
