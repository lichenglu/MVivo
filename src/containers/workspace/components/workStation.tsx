// Cannot use typescript because of a lack of typing
import { Input } from 'antd';
import {
  convertToRaw,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import randomColor from 'randomcolor';
import React from 'react';
import styled from 'styled-components';

import {
  codingDecorator,
  createBufferedCode,
  createEditorStateWithText,
  createNormalCode,
  getSelectedTextFromEditor,
  removeInlineStylesFromSelection,
  removeInlineStylesOfBlock,
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
    font-size: 1rem;
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
  'In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text …\n In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text …\n In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … In this editor a toolbar shows up once you select part of the text … ';

const colorPalette = randomColor({
  luminosity: 'light',
  format: 'rgb',
  count: 20,
});

const customStyleMap = {
  buffered: {
    color: '#fff',
    backgroundColor: '#afb2b7',
  },
};
interface WorkStationState {
  editorState: EditorState;
  codeInput: string;
}

export default class WorkStation extends React.Component<{}, WorkStationState> {
  public state = {
    editorState: createEditorStateWithText({
      text: initialText,
      decorator: codingDecorator,
    }),
    codeInput: '',
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
    if (text && text.trim().length > 5) {
      const selection = editorState.getSelection();
      const currentStyle = editorState.getCurrentInlineStyle();

      const cleanEditorState = removeInlineStylesFromSelection(editorState);
      // If the color is being toggled on, apply it.
      let nextEditorState = cleanEditorState;

      if (!currentStyle.has('buffered')) {
        nextEditorState = RichUtils.toggleInlineStyle(
          nextEditorState,
          'buffered'
        );
      }

      if (nextEditorState) {
        this.setState({
          editorState: EditorState.moveSelectionToEnd(nextEditorState),
        });
      }
    }
  };

  public logState = () => {
    const content = this.state.editorState.getCurrentContent();
    console.log(convertToRaw(content));
  };

  public onCreateNewCode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { editorState, codeInput } = this.state;

    if (codeInput.trim()) {
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = createNormalCode(contentState, {
        bgColor: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      });

      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const selectionKey = selection.getAnchorKey();
      const block = contentState.getBlockForKey(selectionKey);
      const blockKey = block.getKey();

      console.log(entityKey);
      let updatedContentState = contentStateWithEntity;
      block.findStyleRanges(
        character => {
          return character.getStyle().has('buffered');
        },
        (start, end) => {
          updatedContentState = Modifier.applyEntity(
            updatedContentState,
            new SelectionState({
              anchorOffset: start,
              anchorKey: blockKey,
              focusOffset: end,
              focusKey: blockKey,
            }),
            entityKey
          );
        }
      );

      const editorWithEntity = EditorState.push(
        editorState,
        updatedContentState,
        'apply-entity'
      );

      const cleanEditorState = removeInlineStylesOfBlock(
        editorWithEntity,
        customStyleMap
      );

      this.setState({
        editorState: EditorState.moveSelectionToEnd(cleanEditorState),
      });
    }
  };

  public onTypeCode = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ codeInput: e.target.value });

  public render() {
    this.logState();
    return (
      <Container>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          customStyleMap={customStyleMap}
          ref={element => {
            this.editor = element;
          }}
        />
        <SideContainer>
          <Input
            onPressEnter={this.onCreateNewCode}
            onChange={this.onTypeCode}
          />
        </SideContainer>
      </Container>
    );
  }
}
