import { Avatar, Card, Dropdown, Icon, Menu } from 'antd';
import Color from 'color';
import React from 'react';
import { Link } from 'react-router-dom';
import { compose, withHandlers } from 'recompose';
import styled from 'styled-components';

import { generateGradient } from '~/lib/colorPalette';
import { WorkSpaceSnapshot } from '~/stores';
import { Colors, Styles } from '~/themes';

interface WorkSpaceCardProps {
  data: WorkSpaceSnapshot;
  onEdit?: (params: any) => void;
  onSelectExtraAction?: (
    params: AntClickParam & { workSpaceID: string }
  ) => void;
  handleAction?: (params: AntClickParam & { workSpaceID: string }) => void;
  onBookmark: (
    params: {
      workSpaceID: string;
      bookmarked: boolean;
    }
  ) => void;
  handleBookmark?: (e: React.MouseEvent<any>) => void;
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

  &&&& {
    .ant-card {
      width: 100%;
      height: 100%;
    }
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

const CardCover = styled.div<{ cover: string }>`
  pointer: cursor;
  background: ${({ cover }) => cover};
  position: relative;

  min-width: 10rem;
  width: 100%;
  height: 100%;
  min-height: 12rem;
`;

const actions = [
  { key: 'summary', text: 'Summary' },
  { key: 'share', text: 'Share' },
  { key: 'delete', text: 'Delete', important: true },
];

const WordSpaceCard = ({
  data,
  onEdit,
  handleBookmark,
  handleAction,
}: WorkSpaceCardProps) => (
  <Container>
    <Card
      cover={
        <Link to={`/workspace/${data.id}/document`}>
          <CardCover cover={data.cover ? generateGradient(data.cover) : ''}>
            <Icon
              type="star"
              theme={data.bookmarked ? 'filled' : 'outlined'}
              onClick={handleBookmark}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: data.bookmarked ? 'yellow' : '#fff',
                fontSize: '1.5rem',
              }}
            />
          </CardCover>
        </Link>
      }
      actions={[
        <Link key="edit" to={`/workspace/${data.id}/edit`}>
          <Icon type="edit" onClick={onEdit} />
        </Link>,
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

const enhance = compose<WorkSpaceCardProps, WorkSpaceCardProps>(
  withHandlers({
    handleAction: ({ data, onSelectExtraAction }) => (
      params: AntClickParam
    ) => {
      if (!onSelectExtraAction) return;
      onSelectExtraAction({ ...params, workSpaceID: data.id });
    },
    handleBookmark: ({ data, onBookmark }) => (e: React.MouseEvent<any>) => {
      e.stopPropagation();
      e.preventDefault();
      if (!onBookmark) return;
      onBookmark({ workSpaceID: data.id, bookmarked: !data.bookmarked });
    },
  })
);

export default enhance(WordSpaceCard);
