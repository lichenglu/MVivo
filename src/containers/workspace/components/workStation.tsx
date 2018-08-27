// Cannot use typescript because of a lack of typing
import {
  ContentBlock,
  convertToRaw,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import React from 'react';
import styled from 'styled-components';

import { colorPalette } from '~/lib/colorPalette';
import {
  codingDecorator,
  createBufferedCode,
  createEditorStateWithText,
  createNormalCode,
  getSelectedTextFromEditor,
  removeInlineStylesFromSelection,
  removeInlineStylesOfBlocks,
} from '~/services/draft-utils';
import { CodeSnapshot } from '~/stores';
import { Colors } from '~/themes';

// components
import { AutoComplete } from './autoComplete';

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

  // Hacky way of using styles that react does not support for inline style
  // https://github.com/facebook/draft-js/issues/957#issuecomment-359076343
  &&&& div.public-DraftEditor-content [style*='stroke-dashoffset: 0'] {
    color: #fff;
    background-color: #adb5bd;
    &:hover {
      background-color: #868e96;
      transition: 0.3s;
    }
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

const customStyleMap = {
  buffered: {
    strokeDashoffset: '0',
  },
};

interface WorkStationProps {
  codeList?: CodeSnapshot[];
  onCreateCode: (
    data: {
      name: string;
      definition?: string;
      bgColor?: string;
      tint?: string;
    }
  ) => CodeSnapshot | null;
}

interface WorkStationState {
  editorState: EditorState;
  codeInput: string;
  dataSource: AntDataSourceItemObject[];
}

export default class WorkStation extends React.Component<
  WorkStationProps,
  WorkStationState
> {
  public state = {
    editorState: createEditorStateWithText({
      text: initialText,
      decorator: codingDecorator,
    }),
    codeInput: '',
    dataSource: this.codes,
  };

  private editor: Editor | null;

  public componentDidUpdate(prevProps) {
    if (prevProps.codeList !== this.props.codeList) {
      this.setState({
        dataSource: [...this.codes],
      });
    }
  }

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
      let nextEditorState = cleanEditorState;

      // If the color is being toggled on, apply it.
      if (!currentStyle.has('buffered')) {
        nextEditorState = RichUtils.toggleInlineStyle(
          nextEditorState,
          'buffered'
        );
      }

      if (nextEditorState) {
        this.setState({
          editorState: nextEditorState,
        });
      }
    }
  };

  public logState = () => {
    const content = this.state.editorState.getCurrentContent();
    console.log(convertToRaw(content));
  };

  public onMapTextToCode = (code: CodeSnapshot | null) => {
    if (!code) {
      console.warn(
        '[onMapTextToCode] No code is passed in when associating text with a code'
      );
      return;
    }

    const { editorState } = this.state;

    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = createNormalCode(contentState, {
      bgColor: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      codeID: code.id,
    });

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    let updatedContentState = contentStateWithEntity;

    const blocks = contentState.getBlockMap();
    blocks.forEach((block: ContentBlock) => {
      const blockKey = block.getKey();
      block.findStyleRanges(
        character => {
          return character.getStyle().has('buffered');
        },
        (start, end) => {
          const bufferedSelection = new SelectionState({
            anchorOffset: start,
            anchorKey: blockKey,
            focusOffset: end,
            focusKey: blockKey,
          });
          updatedContentState = Modifier.applyEntity(
            updatedContentState,
            bufferedSelection,
            entityKey
          );
        }
      );
    });

    const editorWithEntity = EditorState.push(
      editorState,
      updatedContentState,
      'apply-entity'
    );

    const cleanEditorState = removeInlineStylesOfBlocks(editorWithEntity);

    this.setState({
      editorState: EditorState.moveSelectionToEnd(cleanEditorState),
    });
  };

  public onSelectCode = (id: string, option: AntAutoCompleteOption) => {
    const { codeList, onCreateCode } = this.props;
    const { codeInput } = this.state;
    if (id.trim()) {
      let code;
      if (codeList) {
        code = codeList.find(c => c.id === id || c.name === codeInput);
      }
      if (!code) {
        code = onCreateCode({ name: codeInput });
      }
      this.onMapTextToCode(code);
    }
  };

  public onSearchCode = (inputVal: string) => {
    this.setState({
      dataSource: [
        ...this.codes.filter(code => code.text.includes(inputVal)),
        inputVal && { text: inputVal, value: 'null' },
      ].filter(d => !!d),
      codeInput: inputVal,
    });
  };

  get codes(): Array<AntDataSourceItemObject & CodeSnapshot> {
    const { codeList } = this.props;
    if (!codeList) return [];
    return codeList.map(code => ({ ...code, value: code.id, text: code.name }));
  }

  public render() {
    this.logState();
    const { dataSource, codeInput } = this.state;

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
          <AutoComplete
            onSelect={this.onSelectCode}
            onSearch={this.onSearchCode}
            dataSource={dataSource}
            value={codeInput}
            allowClear
          />
        </SideContainer>
      </Container>
    );
  }
}
