import { Button, Form, Input, message } from "antd";
import * as React from "react";
import { compose, withHandlers, withStateHandlers } from "recompose";
import styled from "styled-components";

const Container = styled<any>(Form)`
	flex: 1;
	display: flex;
	flex-direction: column;
`;

const StyledButton = styled<any>(Button)`
	align-self: flex-end;
	width: 10rem;
`;

interface ManualUploadProps {
	onCompleteUpload: (data: { text: string; name: string }) => void;
}

interface ManualUploadEnhancedProps extends ManualUploadProps {
	valid: boolean;
	text: string;
	name: string;
	onChangeText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleUpload: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const TextArea = Input.TextArea;

const ManualUpload = ({
	onChangeText,
	onChangeName,
	handleUpload,
	text,
	name
}: ManualUploadEnhancedProps) => (
	<Container>
		<Form.Item required label="Document Name:">
			<Input
				placeholder="How would you name this corpus?"
				onChange={onChangeName}
				value={name}
			/>
		</Form.Item>
		<Form.Item required label="Document Text:">
			{/* Change textarea to rich text editor */}
			<TextArea
				autosize={{ minRows: 32, maxRows: 64 }}
				placeholder="Paste your text-to-be-coded here"
				onChange={onChangeText}
				value={text}
			/>
		</Form.Item>
		<StyledButton onClick={handleUpload} type="primary">
			Create Document
		</StyledButton>
	</Container>
);

const enhance = compose<ManualUploadProps, ManualUploadProps>(
	withStateHandlers(
		{ text: "", name: "" },
		{
			onChangeName: () => (e: React.ChangeEvent<HTMLInputElement>) => ({
				name: e.target.value
			}),
			onChangeText: () => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
				return {
					text: e.target.value
				};
			}
		}
	),
	// ways to access handler within another handler
	// https://github.com/acdlite/recompose/pull/401
	withHandlers({
		validate: ({ text, name }) => () => !!text && !!name
	}),
	withHandlers({
		handleUpload: ({ onCompleteUpload, text, name, validate }) => () => {
			console.log(text, name);
			if (validate()) {
				return onCompleteUpload({ text, name });
			}
			message.error("Name and Text are required!");
		}
	})
);

export default enhance(ManualUpload);
