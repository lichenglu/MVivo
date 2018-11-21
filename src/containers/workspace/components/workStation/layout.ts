import styled from 'styled-components';

import { Colors } from '~/themes';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  height: calc(100vh - 24px - 24px - 64px);

  @media (max-width: 750px) {
    flex-direction: column-reverse;
    height: auto;
  }
`;

export const SideContainer = styled.div`
  width: 20rem;
  padding: 1rem 0 0 1rem;
  border-left: solid 1px ${Colors.borderGray.toString()};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 750px) {
    width: 100%;
    max-height: 20rem;
    padding: 1rem;
    border: none;
  }
`;
