import { notification } from "antd";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";

import { RootStore } from "~/stores/root-store";

// components
import Fab from "~/components/fab";
import CreateWSModal from "./components/createModal";
import EmptyView from "./components/emptyView";
import WorkspaceList from "./components/workspaceList";

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
		this.props.rootStore.setWorkSpaceBy(workSpace.id);
		this.toggleWSModalFactory(false)();
		notification.open({
			description: `You have just created a workspace named ${
				workSpace.name
			}. It is also saved locally so that you can still see it when you refresh the browser`,
			message: "New workspace successfully created"
		});
	};

	public onSelectExtraAction = (
		params: AntClickParam & { workSpaceID: string }
	) => {
		switch (params.key) {
			case "delete":
				this.props.rootStore.deleteWorkSpaceBy(params.workSpaceID);
				break;
			case "share":
				break;
			default:
				break;
		}
	};

	public toggleWSModalFactory = (toggle: boolean) => () =>
		this.setState({ wsModalVisible: toggle });

	get codeBooks() {
		return this.props.rootStore.codeBookStore.codeBookList;
	}

	get workspaces() {
		return this.props.rootStore.workSpaceStore.workSpaceList;
	}

	get hasWorkSpace() {
		return this.props.rootStore.workSpaceStore.hasWorkSpace;
	}

	public render(): JSX.Element {
		const { wsModalVisible } = this.state;

		return (
			<React.Fragment>
				<Helmet>
					<title>Home</title>
				</Helmet>
				{this.hasWorkSpace && <Fab onClick={this.toggleWSModalFactory(true)} />}
				<CreateWSModal
					visible={wsModalVisible}
					codeBooks={this.codeBooks}
					onClose={this.toggleWSModalFactory(false)}
					onSubmit={this.onCreateWorkSpace}
				/>
				{this.hasWorkSpace ? (
					<WorkspaceList
						workspaces={this.workspaces}
						onSelectExtraAction={this.onSelectExtraAction}
					/>
				) : (
					<EmptyView onClick={this.toggleWSModalFactory(true)} />
				)}
			</React.Fragment>
		);
	}
}

export default Home;
