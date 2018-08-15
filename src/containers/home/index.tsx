import { Button } from "antd";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";

import { RootStore } from "../../stores/root-store";

interface HomeProps {
	rootStore: RootStore;
}
@inject("rootStore")
@observer
class Home extends React.Component<HomeProps> {
	public onCreateCodeBook = () => {
		this.props.rootStore.codeBookStore.createCodeBook({
			name: "test book"
		});
	};

	public render(): JSX.Element {
		console.log(this.props);
		return (
			<div>
				<Helmet>
					<title>Home</title>
				</Helmet>
				<Button onClick={this.onCreateCodeBook}>Hello World</Button>
			</div>
		);
	}
}

export default Home;
