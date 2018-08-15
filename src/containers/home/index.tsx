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
		const workSpace = this.props.rootStore.createWorkSpace({
			name: "WorkSpace 1"
		});
		this.props.rootStore.setWorkSpace(workSpace.id);
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
