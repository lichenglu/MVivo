// Cannot use typescript because of a lack of typing
import { Input } from 'antd';
import { convertToRaw, Editor, EditorState, Modifier } from 'draft-js';
import React from 'react';
import styled from 'styled-components';

import {
  codingDecorator,
  createEditorStateWithText,
  getSelectedTextFromEditor,
} from '~/services/draft-utils';
import { Colors } from '~/themes';

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

const initialText =
  'In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … ';

interface WorkStationState {
  editorState: EditorState;
}

export default class WorkStation extends React.Component<{}, WorkStationState> {
  public state = {
    editorState: createEditorStateWithText({
      text: initialText,
      decorator: codingDecorator,
    }),
  };

  private editor: Editor | null;

  public onChange = (editorState: EditorState) => {
    this.setState(
      {
        editorState,
      },
      () => this.onSelectText(this.state.editorState)
    );
  };

  public onSelectText = (editorState: EditorState) => {
    const { text } = getSelectedTextFromEditor(editorState);
    if (text) {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const contentStateWithEntity = contentState.createEntity(
        'BUFFERED_CODE',
        'MUTABLE',
        {}
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const updatedContentState = Modifier.applyEntity(
        contentStateWithEntity,
        selectionState,
        entityKey
      );
      this.setState({
        editorState: EditorState.push(
          editorState,
          updatedContentState,
          'apply-entity'
        ),
      });
    }
  };

  public logState = () => {
    const content = this.state.editorState.getCurrentContent();
    console.log(convertToRaw(content));
  };

  public render() {
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
