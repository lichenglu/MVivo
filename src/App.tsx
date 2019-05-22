import React from 'react';
import { Helmet } from 'react-helmet';
import { hot, setConfig } from 'react-hot-loader';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

// components
import NotFound from './components/404';
import { breadcrumbRoutes, Breadcrumbs } from './components/breadcrumb';
import Header from './components/header';

// containers
import CodeBook from './containers/codebook';
import WorkSpace from './containers/workspace';

// utils
import { routeConstants } from './lib/constants';

const Container = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  max-width: 100vw;
  // max-height: 100vh;
  display: flex;
  flex-direction: column;
`;
const ContentContainer = styled.div`
  padding: 24px;
  padding-top: 0;
  flex: 1;
  display: flex;
  flex-direction: column;

  &&&& {
    .ant-breadcrumb {
      padding-top: 12px;
      padding-bottom: 16px;
      padding-left: 10px;
    }
  }
`;

setConfig({
  // set this flag to support SFC if patch is not landed
  pureSFC: true,
});

class App extends React.Component {
  get navItems() {
    return [
      { key: 'workspaces', title: 'Work Spaces', path: routeConstants.root },
      { key: 'codebooks', title: 'Code Books', path: routeConstants.codebooks },
    ];
  }

  public render(): JSX.Element {
    return (
      <Container>
        <Helmet titleTemplate="MVivo - %s" />
        <Header items={this.navItems} />
        <ContentContainer>
          <Breadcrumbs breadcrumbs={this.props.breadcrumbs} />
          <Switch>
            <Route path={routeConstants.root} component={WorkSpace} />
            <Route path={routeConstants.codebooks} component={CodeBook} />
            <Redirect from="/" to={routeConstants.root} exact={true} />
            <Route path="*" component={NotFound} />
          </Switch>
        </ContentContainer>
      </Container>
    );
  }
}

const AppWithBreadcrumbs = withBreadcrumbs(breadcrumbRoutes)(App);
export default hot(module)(AppWithBreadcrumbs);
