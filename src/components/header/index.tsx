import { Layout, Menu } from 'antd';
import React from 'react';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Icon from '../icon';

const { Header: AntHeader } = Layout;

const CustomHeader = styled(AntHeader)`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`;

const CustomMenu = styled(Menu)`
  line-height: 64px;
`;

const CustomIcon = styled(Icon)`
  float: left;
  margin-right: 50px;
`;

type HeaderProps = RouteProps & {
  items: Array<{ key: string; title: string; path: string }>;
};

class Header extends React.PureComponent<HeaderProps> {
  public state = {
    current: [],
  };

  get current() {
    const { items, location } = this.props;
    if (!items || !location) return [];

    return Object.values(this.props.items)
      .filter(item => {
        if (location.pathname === '/') return item.key === 'workspaces';
        return location.pathname.includes(item.key);
      })
      .map(item => item.key);
  }

  public render(): JSX.Element {
    const { items } = this.props;

    return (
      <CustomHeader>
        {/* <CustomIcon /> */}
        <CustomMenu mode="horizontal" selectedKeys={this.current}>
          {items.map(({ key, title, path }) => (
            <Menu.Item key={key}>
              <Link to={path}>{title}</Link>
            </Menu.Item>
          ))}
        </CustomMenu>
      </CustomHeader>
    );
  }
}

export default withRouter((props: any) => <Header {...props} />);
