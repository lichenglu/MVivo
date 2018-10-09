import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import { Colors } from '~/themes';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PunchlineImg = styled.img`
  width: 20rem;
  height: auto;
`;

const Description = styled.p`
  font-size: 3rem;
  color: ${Colors.textLightGray};
`;

export default () => {
  return (
    <Container>
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      <Description>
        404! This is not the page you are looking for...
      </Description>
      <PunchlineImg
        src={'https://media.giphy.com/media/3oriO13KTkzPwTykp2/giphy.gif'}
        alt="404 not found"
      />
    </Container>
  );
};
