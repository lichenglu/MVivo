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
  getCodeCounts,
  getSelectedTextFromEditor,
  removeInlineStylesFromSelection,
  removeInlineStylesOfBlocks,
} from '~/services/draft-utils';
import { CodeSnapshot } from '~/stores';
import { Colors } from '~/themes';

// components
import { AutoComplete } from './autoComplete';
import { UsedCodeTags } from './usedCodeTags';

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

// dev
import editor from '~/fixtures/editor.json';

const initialText = editor.initialText;

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
  dataSource: CodeSnapshot[];
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

  public componentDidUpdate(prevProps: WorkStationProps) {
    if (prevProps.codeList !== this.props.codeList) {
      this.setState({
        dataSource: [...this.codes],
      });
    }
  }

  public onEditorChange = (editorState: EditorState) => {
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
        code = codeList.find(c => c.id === id);
      }
      if (!code) {
        code = onCreateCode({ name: codeInput });
      }
      this.onMapTextToCode(code);
      if (code) {
        this.setState({
          codeInput: code.name,
        });
      }
    }
  };

  public onSearchCode = (inputVal: string) => {
    const hasName =
      this.codes.filter(code => code.name === inputVal).length === 1;
    const filteredCodes = this.codes.filter(code =>
      code.name.includes(inputVal)
    );
    const nextDataSource = hasName
      ? filteredCodes
      : filteredCodes
          // @ts-ignore
          .concat([inputVal && { name: inputVal, id: inputVal }])
          // @ts-ignore
          .filter(d => !!d);
    this.setState({
      dataSource: nextDataSource,
      codeInput: inputVal,
    });
  };

  get codes(): Array<CodeSnapshot & { count?: number }> {
    const { codeList } = this.props;
    if (!codeList) return [];

    let codeCounts = {};
    if (this.state) {
      const { editorState } = this.state;
      codeCounts = getCodeCounts(editorState);
    }

    return codeList.map(code => ({
      ...code,
      count: codeCounts[code.id] || 0,
    }));
  }

  get sortedCodes() {
    return this.codes.sort((a, b) => b.count - a.count);
  }

  public render() {
    const { editorState, dataSource } = this.state;
    console.log(this.codes);
    return (
      <Container>
        <Editor
          editorState={editorState}
          onChange={this.onEditorChange}
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
            placeholder="Type to search codes or create a new one"
            allowClear
          />
          <UsedCodeTags
            codes={this.sortedCodes}
            onClick={() => console.log('onClick')}
            onClose={() => console.log('onClose')}
          />
        </SideContainer>
      </Container>
    );
  }
}
