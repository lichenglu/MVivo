// Cannot use typescript because of a lack of typing
import {
  ContentBlock,
  ContentState,
  convertToRaw,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import React from 'react';

import {
  codingDecorator,
  createNormalCode,
  getCodeCounts,
  getEntitiesFromBlocks,
  getSelectedTextFromEditor,
  getSelectionEntity,
  removeInlineStylesFromSelection,
  removeInlineStylesOfBlocks,
} from '~/services/draft-utils';
import { CodeSnapshot } from '~/stores';

// components
import { AutoComplete } from './autoComplete';
import { Container, SideContainer } from './layout';
import { UsedCodeTags } from './usedCodeTags';

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
  onUpdateEditorContent: (contentState: ContentState) => void;
  editorContent?: ContentState | null;
}

interface WorkStationState {
  editorState: EditorState;
  codeInput: string;
  dataSource: CodeSnapshot[];
  currentEntityKey?: string;
}

// TODO:
// 1. Solve jumping cursor
// 2. Autocomplete value
export class WorkStation extends React.Component<
  WorkStationProps,
  WorkStationState
> {
  constructor(props: WorkStationProps) {
    super(props);

    let editorState = EditorState.createEmpty(codingDecorator);
    if (props.editorContent) {
      editorState = EditorState.createWithContent(
        props.editorContent,
        codingDecorator
      );
    }
    this.state = {
      editorState,
      codeInput: '',
      dataSource: this.codes,
    };
  }

  private editor: Editor | null;

  public componentDidUpdate(prevProps: WorkStationProps) {
    if (prevProps.codeList !== this.props.codeList) {
      this.setState({
        dataSource: [...this.codes],
      });
    }
  }

  public onEditorChange = (editorState: EditorState) => {
    const { text } = getSelectedTextFromEditor(editorState);
    if (text && text.trim().length > 5) {
      this.onSelectText(editorState);
    } else if (!text.trim()) {
      this.onClickText(editorState);
    }

    if (
      editorState.getCurrentContent() !==
      this.state.editorState.getCurrentContent()
    ) {
      this.setState({ editorState });
    }
  };

  public onSelectText = (editorState: EditorState) => {
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
  };

  public onClickText = (editorState: EditorState) => {
    const contentState = editorState.getCurrentContent();
    const targetEntity = getSelectionEntity(editorState);

    const allEntities = getEntitiesFromBlocks(editorState).map(
      e => e.entityKey
    );
    let nextContentState = contentState;
    const selection = editorState.getSelection();
    for (const entityKey of allEntities) {
      nextContentState = nextContentState.mergeEntityData(entityKey, {
        selected: entityKey === targetEntity,
      });
      nextContentState = Modifier.applyEntity(
        nextContentState,
        selection,
        entityKey
      );
    }

    const nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'apply-entity'
    );

    this.setState(
      {
        // Inspired by
        // https://github.com/facebook/draft-js/issues/1047#issuecomment-290568584
        editorState: nextEditorState,
        currentEntityKey: targetEntity,
      },
      () => {
        this.setState({
          dataSource: this.excludedCodes,
        });
      }
    );
  };

  public logState = () => {
    const content = this.state.editorState.getCurrentContent();
    console.log(convertToRaw(content));
  };

  public onMapBufferedTextToCode = (code: CodeSnapshot | null) => {
    if (!code) {
      console.warn(
        '[onMapBufferedTextToCode] No code is passed in when associating text with a code'
      );
      return;
    }

    const { editorState } = this.state;

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = createNormalCode(contentState, {
      bgColor: code.bgColor,
      codeIDs: [code.id],
      selected: false,
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

    // TODO: Refactor to auto save
    this.props.onUpdateEditorContent(cleanEditorState.getCurrentContent());

    this.setState({
      editorState: EditorState.moveSelectionToEnd(cleanEditorState),
    });
  };

  public onAddCodeToSelectedEntity = (code?: CodeSnapshot) => {
    const { currentEntityKey, editorState } = this.state;

    if (!currentEntityKey || !this.currentCodes || !code) return;
    if (this.currentCodes.find(c => c.id === code.id)) {
      console.warn(
        `[onAddCodeToSelectedEntity] you are trying to add code ${
          code.name
        } to an entity. But this code already exists in the entity`
      );
      return;
    }

    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    let nextContentState = contentState.mergeEntityData(currentEntityKey, {
      codeIDs: this.currentCodes.map(c => c.id).concat([code.id]),
    });
    nextContentState = Modifier.applyEntity(
      nextContentState,
      selection,
      currentEntityKey
    );

    const nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'apply-entity'
    );

    // TODO: Refactor to auto save
    this.props.onUpdateEditorContent(nextEditorState.getCurrentContent());

    this.setState(
      {
        editorState: nextEditorState,
      },
      () => {
        this.setState({
          dataSource: this.excludedCodes,
        });
      }
    );
  };

  public onSelectCode = (id: string, option: AntAutoCompleteOption) => {
    const { codeList, onCreateCode } = this.props;
    const { codeInput, currentEntityKey } = this.state;

    if (id.trim()) {
      let code;
      if (codeList) {
        code = codeList.find(c => c.id === id);
      }
      if (!code) {
        code = onCreateCode({ name: codeInput });
      }
      currentEntityKey
        ? this.onAddCodeToSelectedEntity(code)
        : this.onMapBufferedTextToCode(code);
      if (code) {
        console.log(code);
        this.setState({
          codeInput: code.name,
        });
      }
    }
  };

  public onSearchCode = (inputVal: string) => {
    const { dataSource } = this.state;
    const containsCode =
      this.codes.filter(code => code.name === inputVal).length === 1;
    const filteredCodes = this.excludedCodes.filter(code => {
      const included = code.name.includes(inputVal);
      return included;
    });
    const nextDataSource = containsCode
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

  // all the codes but those codes that the current selected
  // entity contains
  get excludedCodes() {
    return this.codes.filter(
      code =>
        !this.currentCodes
          ? true
          : !this.currentCodes.find(c => c.id === code.id)
    );
  }

  get currentCodes() {
    const { currentEntityKey, editorState } = this.state;

    if (!currentEntityKey) return null;

    const contentState = editorState.getCurrentContent();
    const { codeIDs } = contentState.getEntity(currentEntityKey).getData();

    return this.codes.filter(c => codeIDs.includes(c.id));
  }

  public render() {
    const { editorState, dataSource, currentEntityKey, codeInput } = this.state;

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
            codes={currentEntityKey ? this.currentCodes : this.sortedCodes}
            onClick={() => console.log('onClick')}
            onClose={() => console.log('onClose')}
          />
        </SideContainer>
      </Container>
    );
  }
}
