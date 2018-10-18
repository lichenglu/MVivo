import { Icon as AntIcon } from 'antd';
import styled from 'styled-components';

export const Button = styled.span<{ reversed?: boolean; active: boolean }>`
  cursor: pointer;
  color: ${props =>
    props.reversed
      ? props.active
        ? 'white'
        : '#aaa'
      : props.active
        ? 'black'
        : '#ccc'};
`;

export const Icon = styled(AntIcon)`
  font-size: 18px;
  vertical-align: text-bottom;
`;

export const Menu = styled.div<{ position?: 'top' | 'bottom' }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-item: center;
  & > * + * {
    margin-left: 15px;
  }

  ${props =>
    props.position === 'top'
      ? `
    &:after {
      top: 100%;
      left: 50%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-top-color: #151515;
      border-width: 5px;
      margin-left: -5px;
    }
  `
      : `
    &:after {
      bottom: 100%;
      left: 50%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-bottom-color: #151515;
      border-width: 5px;
      margin-left: -5px;
    }
  `};
`;

export const Divider = styled.div<{ reversed?: boolean }>`
  flex: 1;
  border: 0.5px solid;
  border-color: ${props => (props.reversed ? 'black' : 'white')};
`;

export const Toolbar = styled(Menu)`
  position: relative;
  padding: 1px 18px 17px;
  margin: 0 -20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`;
