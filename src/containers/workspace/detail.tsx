import { message, notification } from "antd";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import { RootStore } from "~/stores/root-store";

// components
import ManualUpload from "./components/manualUpload";
import Uploader from "./components/upload";

interface WorkSpaceDetailProps extends RouteCompProps<{ id: string }> {
	rootStore: RootStore;
}

interface WorkSpaceDetailState {
	manualInputDocument: boolean;
}

const UploadContainer = styled.div`
	width: 100%;
	height: 80%
	margin: auto;
	display: flex;
	flex-direction: column;
	flex: 0.1;

	@media (min-width: 500px) {
		width: 80%;
	}

	@media (min-width: 960px) {
		width: 50%;
		height: 50%;
	}
`;

const Switch = styled.a`
	margin-top: 0.5rem;
	display: block;
	align-self: flex-end;
`;

// TODO:
// 1. Asked to upload text file if not available
// 2. Add more text file, unlink text file
// 3. Link/unlink more code book
// 4. Update workSpace info
@inject("rootStore")
@observer
export class WorkSpaceDetail extends React.Component<
	WorkSpaceDetailProps,
	WorkSpaceDetailState
> {
	public state = {
		manualInputDocument: false
	};

	public onCompleteUpload = (data: { text: string; name: string }) => {
		if (this.workSpace) {
			const documentT = this.props.rootStore.workSpaceStore.createDocument(
				data
			);
			this.workSpace.setDocument(documentT);
			notification.success({
				description: "Now you are all set to start coding!",
				message: "Document uploaded!"
			});
		} else {
			message.error(`Failed to add document because work space is not found`);
		}
	};

	public onSwitchUploadMode = () =>
		this.setState({ manualInputDocument: !this.state.manualInputDocument });

	get workSpace() {
		const workSpaceID = this.props.match.params.id;
		return this.props.rootStore.workSpaceStore.workSpaceBy(workSpaceID);
	}

	get hasDocument() {
		if (!this.workSpace) return false;
		if (!this.workSpace.document) return false;
		return !!this.workSpace.document.id;
	}

	public render(): JSX.Element | null {
		// if (!this.workSpace) return null;
		const { manualInputDocument } = this.state;

		return (
			<React.Fragment>
				<Helmet>
					<title>WorkSpace Detail</title>
				</Helmet>
				{this.hasDocument ? (
					<p>Hello World</p>
				) : (
					<UploadContainer>
						{!manualInputDocument && (
							<Uploader onCompleteUpload={this.onCompleteUpload} />
						)}
						<Switch onClick={this.onSwitchUploadMode}>
							{manualInputDocument ? "Upload file?" : "Copy and paste?"}
						</Switch>
						{manualInputDocument && (
							<ManualUpload onCompleteUpload={this.onCompleteUpload} />
						)}
					</UploadContainer>
				)}
			</React.Fragment>
		);
	}
}
