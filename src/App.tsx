import React from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

// components
import Header from './components/header';

// containers
import WorkSpace from './containers/workspace';

// utils
import { routeConstants } from './lib/constants';

const Container = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
const ContentContainer = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

class App extends React.Component {
  get items() {
    return [
      { key: 'workspaces', title: 'Work Spaces', path: routeConstants.root },
      { key: 'codebooks', title: 'Code Books', path: routeConstants.codebooks },
    ];
  }

  public render(): JSX.Element {
    return (
      <Container>
        <Helmet titleTemplate="MVivo - %s" />
        <Header items={this.items} />
        <ContentContainer>
          <Route path={routeConstants.root} component={WorkSpace} />
        </ContentContainer>
      </Container>
    );
  }
}

export default App;
