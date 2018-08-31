import React from 'react';
import { Change, Value } from 'slate';
import { Editor } from 'slate-react';

import { CodeSnapshot } from '~/stores';

// components
import { AutoComplete } from './autoComplete';
import { Container, SideContainer } from './layout';
import { UsedCodeTags } from './usedCodeTags';

// slate-plugins
import {
  BufferedText,
  CodedText,
  updateCodeForBlocks,
} from '~/lib/slate-plugins';

interface WorkStationProps {
  codeList?: CodeSnapshot[];
  codeMap?: Map<string, CodeSnapshot>;
  onCreateCode: (
    data: {
      name: string;
      definition?: string;
      bgColor?: string;
      tint?: string;
    }
  ) => CodeSnapshot | null;
  onUpdateEditorContent: (contentState: Value) => void;
  editorState?: Value | null;
}

interface WorkStationState {
  editorState: Value;
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
  public plugins = [BufferedText(), CodedText({ codeMap: new Map() })];
  private editor: Editor | null;

  constructor(props: WorkStationProps) {
    super(props);

    let editorState = Value.create();
    if (props.editorState) {
      editorState = props.editorState;
    }
    this.state = {
      editorState,
      codeInput: '',
      dataSource: this.codes,
    };
  }

  public componentDidUpdate(prevProps: WorkStationProps) {
    if (prevProps.codeList !== this.props.codeList) {
      this.setState({
        dataSource: [...this.codes],
      });
    }
  }

  public onChangeEditor = ({ value }: Change) =>
    this.setState({ editorState: value });

  public onSelectOption = (id: string, option: AntAutoCompleteOption) => {
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
      this.onSelectCode(code);
      if (code) {
        console.log(code);
        this.setState({
          codeInput: code.name,
        });
      }
    }
  };

  public onSelectCode = (code: CodeSnapshot | null) => {
    const { currentEntityKey } = this.state;
    const change = updateCodeForBlocks({
      codeID: code.id,
      action: 'add',
      value: this.state.editorState,
    });
    if (change) {
      this.onChangeEditor(change);
    }
    // Either map to buffered or add code to selected node
  };

  public onDeleteCode = (code: CodeSnapshot) => {
    console.log(code, 'onDeleteCode');
    // either delete code in codebook (alert) or delete code of selected node
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
      // codeCounts = getCodeCounts(editorState);
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

  public render() {
    const { editorState, dataSource, currentEntityKey, codeInput } = this.state;

    return (
      <Container>
        <Editor
          value={editorState}
          plugins={this.plugins}
          className={'slate-editor'}
          ref={element => {
            this.editor = element;
          }}
          style={{
            paddingRight: '1rem',
            flex: '0.8',
            maxHeight: '100%',
            overflowY: 'auto',
            fontSize: '1rem',
          }}
          onChange={this.onChangeEditor}
        />

        <SideContainer>
          <AutoComplete
            onSelect={this.onSelectOption}
            onSearch={this.onSearchCode}
            dataSource={dataSource}
            placeholder="Type to search codes or create a new one"
            allowClear
          />
          {/* <UsedCodeTags
            codes={this.sortedCodes}
            onClick={this.onSelectCode}
            onClose={this.onDeleteCode}
          /> */}
        </SideContainer>
      </Container>
    );
  }
}
