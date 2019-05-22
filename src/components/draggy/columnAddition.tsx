import { Icon } from 'antd';
import Color from 'color';
import React from 'react';
import styled from 'styled-components';

import { Colors } from '~/themes';

interface ColumnAdditionProps {
  onCreate: (
    data?: {
      name?: string;
      definition?: string;
    }
  ) => void;
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
  background-color: ${Colors.ivoryWhite};

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
  public handleCreateTheme = () => {
    this.props.onCreate();
  };

  public render() {
    return (
      <Container onClick={this.handleCreateTheme}>
        <Plus type="plus" theme="outlined" />
      </Container>
    );
  }
}
