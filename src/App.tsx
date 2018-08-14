import DevTools from 'mobx-react-devtools'
import * as React from 'react'
import {Helmet} from 'react-helmet'
import {BrowserRouter as Router, Route, RouteProps, withRouter} from 'react-router-dom'
import styled from 'styled-components'

// components
import Header from './components/header'

// containers
import Home from './containers/home'

const Container = styled.div`
  min-width: 100vw;
  min-height: 100vh;
`
const ContentContainer = styled.div`
  padding: 24px;
`

class App extends React.Component<RouteProps> {
  get items() {
    return [{key: 'home', title: 'Home'}]
  }

  public render(): JSX.Element {
    console.log(this.props.location)
    return (
      <Container>
        <Helmet titleTemplate="MVivo - %s" />
        <Header items={this.items} />
        <ContentContainer>
          <Router>
            <Route path="/" component={Home} exact={true} />
          </Router>
        </ContentContainer>
        <DevTools />
      </Container>
    )
  }
}

export default withRouter(props => <App {...props} />)
