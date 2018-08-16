import { Button, Input, Modal, Select } from "antd";
import * as React from "react";
import styled from "styled-components";

import { CodeBookSnapshot } from "../../../stores";

interface CreateWSModalProps {
	visible: boolean;
	codeBooks: CodeBookSnapshot[];
	onClose: () => void;
	onSubmit: (
		data: { name: string; description: string; codeBookID?: string }
	) => void;
}

interface CreateWSModalState {
	name: string;
	description: string;
	codeBookID?: string;
}

const Option = Select.Option;
const TextArea = Input.TextArea;

// @ts-ignore
const NameInput = styled(Input)`
	&&&& {
		margin-bottom: 1em;
	}
`;

// @ts-ignore
const DescText = styled(TextArea)`
	&&&& {
		margin-bottom: 1em;
	}
`;

export default class CreateWSModal extends React.Component<
	CreateWSModalProps,
	CreateWSModalState
> {
	public state = {
		codeBookID: undefined,
		description: "",
		name: ""
	};

	public handleSubmit = () => {
		const { name, description, codeBookID } = this.state;
		this.props.onSubmit({ name, description, codeBookID });
	};

	public handleSelectCodeBook = (value: string) =>
		this.setState({ codeBookID: value });

	public handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		this.setState({ name: e.target.value });

	public handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
		this.setState({ description: e.target.value });

	public render() {
		const { visible, codeBooks, onClose } = this.props;
		const { codeBookID } = this.state;
		return (
			<Modal
				visible={visible}
				title="Create a new workspace"
				onOk={this.handleSubmit}
				onCancel={onClose}
				footer={[
					<Button key="back" onClick={onClose}>
						Return
					</Button>,
					<Button key="submit" type="primary" onClick={this.handleSubmit}>
						Submit
					</Button>
				]}
			>
				<NameInput
					placeholder="Input the new workspace name here"
					onChange={this.handleNameChange}
				/>
				<DescText
					placeholder="What is this workspace for?"
					autosize={{ minRows: 3, maxRows: 6 }}
					onChange={this.handleDescChange}
				/>
				<Select
					style={{ width: "50%" }}
					placeholder="Select existing code books"
					value={codeBookID}
					onSelect={this.handleSelectCodeBook}
				>
					{codeBooks.map(({ name, id }) => (
						<Option key={id} value={id}>
							{name}
						</Option>
					))}
				</Select>
			</Modal>
		);
	}
}
