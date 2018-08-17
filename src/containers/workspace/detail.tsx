import { notification } from "antd";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";

import { RootStore } from "~/stores/root-store";

// components
import Uploader from "./components/upload";

interface WorkSpaceProps extends RouteCompProps<{ id: string }> {
	rootStore: RootStore;
}

@inject("rootStore")
@observer
export class WorkSpaceDetail extends React.Component<WorkSpaceProps, {}> {
	public onCompleteUpload = (text: string) => {
		console.log(text);
	};

	get workspace() {
		const workspaceID = this.props.match.params.id;
		return this.props.rootStore.workSpaceStore.workSpaceBy(workspaceID);
	}

	get hasDocument() {
		if (!this.workspace) return false;
		if (!this.workspace.document) return false;
		return !!this.workspace.document.id;
	}

	public render(): JSX.Element | null {
		if (!this.workspace) return null;

		return (
			<React.Fragment>
				<Helmet>
					<title>WorkSpace Detail</title>
				</Helmet>
				{this.hasDocument ? (
					<p>Hello World</p>
				) : (
					<Uploader onCompleteUpload={this.onCompleteUpload} />
				)}
			</React.Fragment>
		);
	}
}
