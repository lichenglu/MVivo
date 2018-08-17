import { Icon, message, Upload } from "antd";
import * as React from "react";
import styled from "styled-components";

const Dragger = Upload.Dragger;

function getBase64(text: Blob, callback: (res: FileReader["result"]) => void) {
	const reader = new FileReader();
	reader.addEventListener("load", () => callback(reader.result));
	reader.readAsText(text, "UTF-8");
}

interface UploaderProps {
	onCompleteUpload: (data: { text: string; name: string }) => void;
}

interface UploaderState {
	loading: boolean;
}

const StyledDragger = styled(Dragger)`
	&&&&& .anticon-inbox {
		font-size: 4rem;
	}

	@media (min-width: 500px) {
		&&&&& .anticon-inbox {
			font-size: 6rem;
		}
	}

	@media (min-width: 960px) {
		&&&&& .anticon-inbox {
			font-size: 8rem;
		}
	}
`;

export default class Uploader extends React.PureComponent<
	UploaderProps,
	UploaderState
> {
	public state = {
		loading: false
	};

	public handleChange = (info: AntUploadChangeParam) => {
		if (info.file.status === "uploading") {
			this.setState({ loading: true });
			return;
		}
		if (info.file.status === "done" && info.file.originFileObj) {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, (text: string) => {
				this.setState({
					loading: false
				});
				this.props.onCompleteUpload({
					text,
					name: info.file.originFileObj ? info.file.originFileObj.name : "N/A"
				});
			});
		} else if (status === "error") {
			message.error(`${info.file.name} file upload failed.`);
		}
	};

	public render() {
		return (
			<StyledDragger
				name="file"
				action="//jsonplaceholder.typicode.com/posts/"
				onChange={this.handleChange}
			>
				<p className="ant-upload-drag-icon">
					<Icon type="inbox" />
				</p>
				<p className="ant-upload-text">
					Click or drag file to this area to upload
				</p>
				<p className="ant-upload-hint">
					Currently, the app only accepts text file with extension of ".txt"
				</p>
			</StyledDragger>
		);
	}
}
