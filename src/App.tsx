import * as React from "react";
import { Helmet } from "react-helmet";
import { hot } from "react-hot-loader";
import { Route, RouteProps, withRouter } from "react-router-dom";
import styled from "styled-components";

// components
import Header from "./components/header";

// containers
import WorkSpace from "./containers/workspace";

const Container = styled.div`
	min-width: 100vw;
	min-height: 100vh;
`;
const ContentContainer = styled.div`
	padding: 24px;
`;

class App extends React.Component<RouteProps> {
	get items() {
		return [{ key: "home", title: "Home" }];
	}

	public render(): JSX.Element {
		console.log(this.props);
		return (
			<Container>
				<Helmet titleTemplate="MVivo - %s" />
				<Header items={this.items} />
				<ContentContainer>
					<Route path="/" component={WorkSpace} exact={true} />
				</ContentContainer>
			</Container>
		);
	}
}

export default hot(module)(withRouter(props => <App {...props} />));
