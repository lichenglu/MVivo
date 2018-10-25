import { Icon } from 'antd';
import Color from 'color';
import React from 'react';
import styled from 'styled-components';

import { Colors } from '~/themes';

interface ColumnAdditionProps {
  onCreate: () => void;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.5rem;
  border: solid 1px ${Colors.borderGray.toString()};
  border-radius: 5px;
  min-width: 200px;
  margin-right: 8px;
  cursor: pointer;

  &:hover {
    i {
      font-size: 1.6rem;
      color: ${Color(Colors.bloodOrange)
        .darken(0.2)
        .toString()};
    }
  }
`;

const Plus = styled(Icon)`
  font-size: 1.4rem;
  color: ${Colors.bloodOrange};
  transition: 0.2s;
`;

export class ColumnAddition extends React.PureComponent<
  ColumnAdditionProps,
  {}
> {
  public render() {
    const { onCreate } = this.props;
    return (
      <Container onClick={onCreate}>
        <Plus type="plus" theme="outlined" />
      </Container>
    );
  }
}
