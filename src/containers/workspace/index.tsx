import { Button, notification } from "antd";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";

import { RootStore } from "../../stores/root-store";

// components
import CreateWSModal from "./components/createModal";
import EmptyView from "./components/emptyView";

interface HomeProps {
	rootStore: RootStore;
}

interface HomeState {
	wsModalVisible: boolean;
}

@inject("rootStore")
@observer
class Home extends React.Component<HomeProps, HomeState> {
	public state = {
		wsModalVisible: false
	};

	public onCreateWorkSpace = (data: any) => {
		const workSpace = this.props.rootStore.createWorkSpace(data);
		this.props.rootStore.setWorkSpace(workSpace.id);
		this.toggleWSModalFactory(false)();
		notification.open({
			description: `You have just created a workspace named ${
				workSpace.name
			}. It is also saved locally so that you can still see it when you refresh the browser`,
			message: "New workspace successfully created"
		});
	};

	public toggleWSModalFactory = (toggle: boolean) => () =>
		this.setState({ wsModalVisible: toggle });

	get codeBooks() {
		return this.props.rootStore.codeBookStore.codeBookList;
	}

	public render(): JSX.Element {
		const { wsModalVisible } = this.state;

		return (
			<React.Fragment>
				<Helmet>
					<title>Home</title>
				</Helmet>
				<CreateWSModal
					visible={wsModalVisible}
					codeBooks={this.codeBooks}
					onClose={this.toggleWSModalFactory(false)}
					onSubmit={this.onCreateWorkSpace}
				/>
				{this.props.rootStore.workSpaceStore.hasWorkSpace ? (
					<Button>Hello World</Button>
				) : (
					<EmptyView onClick={this.toggleWSModalFactory(true)} />
				)}
			</React.Fragment>
		);
	}
}

export default Home;
