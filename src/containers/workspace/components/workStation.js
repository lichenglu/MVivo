// Cannot use typescript because of a lack of typing
import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import * as React from "react";
import { Input } from "antd";
import Editor, { createEditorStateWithText } from "draft-js-plugins-editor";
import styled from "styled-components";

import { Colors } from "~/themes";

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-start;
	height: calc(100vh - 24px - 24px - 64px);
	&&&& > .DraftEditor-root {
		padding-right: 1rem;
		flex: 0.8;
		max-height: 100%;
		overflow-y: auto;
	}
`;

const SideContainer = styled.div`
	flex: 0.2;
	padding: 1rem 0 0 1rem;
	border-left: solid 1px ${Colors.borderGray.toString()};
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	height: 100%;
`;

const text =
	"In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … ";

export default class WorkStation extends React.Component {
	state = {
		editorState: createEditorStateWithText(text)
	};

	onChange = editorState => {
		this.setState({
			editorState
		});
	};

	render() {
		return (
			<Container>
				<Editor
					editorState={this.state.editorState}
					onChange={this.onChange}
					ref={element => {
						this.editor = element;
					}}
				/>

				<SideContainer>
					<Input />
				</SideContainer>
			</Container>
		);
	}
}
