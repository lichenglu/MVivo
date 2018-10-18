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

export const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-item: center;
  & > * + * {
    margin-left: 15px;
  }
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
