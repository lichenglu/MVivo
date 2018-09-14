import React from 'react';
import styled from 'styled-components';

import { Colors } from '~/themes';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  height: calc(100vh - 24px - 24px - 64px);
`;

export const SideContainer = styled.div`
  flex: 0.2;
  padding: 1rem 0 0 1rem;
  border-left: solid 1px ${Colors.borderGray.toString()};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
`;
