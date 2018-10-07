import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button/button';
import React from 'react';
import SVGInline from 'react-svg-inline';
import styled from 'styled-components';

import Plus from '../assets/plus_circle.svg';

// TODO: better way to type
const Fab = styled<any>(Button)`
  &&&& {
    position: fixed;
    bottom: 5%;
    right: 5%;
    z-index: 999;
    width: 4rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
`;

export default (props: ButtonProps) => (
  <Fab type="primary" shape="circle" {...props}>
    <SVGInline width="100%" height="100%" svg={Plus} />
  </Fab>
);
