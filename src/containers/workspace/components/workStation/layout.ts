import React from 'react';
import styled from 'styled-components';

import { Colors } from '~/themes';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  height: calc(100vh - 24px - 24px - 64px);
  &&&& > .DraftEditor-root {
    padding-right: 1rem;
    flex: 0.8;
    max-height: 100%;
    overflow-y: auto;
    font-size: 1rem;
  }

  // Hacky way of using styles that react does not support for inline style
  // https://github.com/facebook/draft-js/issues/957#issuecomment-359076343
  &&&& div.public-DraftEditor-content [style*='stroke-dashoffset: 0'] {
    color: #fff;
    background-color: #adb5bd;
    &:hover {
      background-color: #868e96;
      transition: 0.3s;
    }
  }
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
