import { Dropdown, Icon, Menu } from 'antd';
import Color from 'color';
import React from 'react';
import styled from 'styled-components';

import { Colors } from '~/themes';

const Header = styled.div<{ isDragging: boolean; isDragDisabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 2.5rem;
  position: relative;

  border-bottom: solid 1px ${Colors.borderGray.toString()};
  background-color: ${({ isDragging }) =>
    isDragging ? Colors.blueGray.toString() : Colors.ivoryWhite};
  color: ${({ isDragging }) => (isDragging ? Colors.ivoryWhite : 'none')};

  transition: background-color 0.2s ease, color 0.1s ease;
  &:hover {
    background-color: ${Colors.blueGray.toString()};
    color: ${Colors.ivoryWhite};
    cursor: ${({ isDragDisabled }) =>
      isDragDisabled ? 'not-allowed' : 'grab'};
  }
`;

const Title = styled.p`
  width: 100%;
  margin: auto;
  flex: 1;
`;

const Action = styled.a<{ important?: boolean }>`
  &&&& {
    color: ${props => (props.important ? Colors.paleRed : Colors.blue)};
  }
  &:hover {
    color: ${props =>
      props.important
        ? Color(Colors.paleRed)
            .darken(0.4)
            .toString()
        : Color(Colors.blue)
            .darken(0.4)
            .toString()};
    transition: 0.5s;
  }
`;

const StyledDropdown = styled(Dropdown)`
  position: absolute;
  right: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.2 ease;
  &:hover {
    color: #f8f8f8;
    font-size: 1.4rem;
  }
`;

const defaultActions = [{ key: 'delete', text: 'Delete', important: true }];

interface ColumnHeaderProps {
  isDragging: boolean;
  title: string;
  handleAction: (params: AntClickParam) => void;
  editable: boolean;
  actions?: Array<{ key: string; text: string; important?: boolean }>;
  isDragDisabled?: boolean;
}

export const ColumnHeader = ({
  isDragging,
  isDragDisabled,
  title,
  actions = defaultActions,
  handleAction,
  editable,
  ...rest
}: ColumnHeaderProps) => (
  <Header isDragging={isDragging} isDragDisabled={isDragDisabled} {...rest}>
    <Title>{title}</Title>
    {editable && (
      <StyledDropdown
        key="ellipsis"
        placement="bottomCenter"
        overlay={
          <Menu onClick={handleAction}>
            {actions.map(action => (
              <Menu.Item key={action.key}>
                <Action important={action.important}>{action.text}</Action>
              </Menu.Item>
            ))}
          </Menu>
        }
        trigger={['click']}
      >
        <Icon type="ellipsis" />
      </StyledDropdown>
    )}
  </Header>
);
