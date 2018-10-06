import { Avatar, Card, Dropdown, Icon, Menu } from 'antd';
import Color from 'color';
import React from 'react';
import { Link } from 'react-router-dom';
import { compose, withHandlers } from 'recompose';
import styled from 'styled-components';

import { CodeBookSnapshot } from '~/stores';
import { Colors, Styles } from '~/themes';

interface CodeBookCardProps {
  data: CodeBookSnapshot;
  onEdit?: (params: any) => void;
  onSelectExtraAction?: (
    params: AntClickParam & { codeBookID: string }
  ) => void;
  handleAction?: (params: AntClickParam & { codeBookID: string }) => void;
}

const Container = styled.div`
  display: flex;
  flex: 1;
  width: calc(100% - 1rem);
  margin-bottom: 1rem;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  float: left;
  ${Styles.hoverWithShadow()};

  @media (min-width: 500px) {
    flex: 0.5;
    width: calc(50% - 1rem);
  }

  @media (min-width: 960px) {
    flex: 0.25;
    width: calc(25% - 1rem);
  }
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

const CardCover = styled.div`
  pointer: cursor;
`;

const actions = [
  { key: 'share', text: 'Share' },
  { key: 'delete', text: 'Delete', important: true },
];

const CodeBookCard = ({ data, onEdit, handleAction }: CodeBookCardProps) => (
  <Container>
    <Card
      cover={
        <CardCover>
          <Link to={`/codebook/${data.id}`}>
            <img
              alt="cover image"
              src="https://source.unsplash.com/800x450/?research"
              style={{ width: '100%', height: '100%' }}
            />
          </Link>
        </CardCover>
      }
      actions={[
        <Icon key="edit" type="edit" onClick={onEdit} />,
        <Dropdown
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
        </Dropdown>,
      ]}
    >
      <Card.Meta
        // TODO: use different images according to ws's importance
        // avatar={
        // 	<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        // }
        title={data.name}
        description={data.description || 'No description'}
      />
    </Card>
  </Container>
);

const enhance = compose<CodeBookCardProps, CodeBookCardProps>(
  withHandlers({
    handleAction: ({ data, onSelectExtraAction }) => (
      params: AntClickParam
    ) => {
      if (!onSelectExtraAction) return;
      onSelectExtraAction({ ...params, codeBookID: data.id });
    },
  })
);

export default enhance(CodeBookCard);
