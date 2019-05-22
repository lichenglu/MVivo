import React from 'react';
import { Change, Inline, Value } from 'slate';
import { Editor, EditorProps } from 'slate-react';

import { CodeSnapshot } from '~/stores';

// styles
import './workStation.less';

// components
import { AutoComplete } from './autoComplete';
import { Container, SideContainer } from './layout';
import { UsedCodeTags } from './usedCodeTags';

// slate-plugins
import {
  BufferedText,
  CodedText,
  getCodeSummary,
  HoverMenu,
  RichText,
  SoftBreak,
  updateCodeForBlocks,
  updateSelectedCode,
} from '~/lib/slate-plugins';
import { INLINES } from '~/lib/slate-plugins/utils/constants';

interface WorkStationProps {
  codeList?: CodeSnapshot[];
  codeMap?: Map<string, CodeSnapshot>;
  onCreateCode: (data: {
    name: string;
    definition?: string;
    bgColor?: string;
    tint?: string;
  }) => CodeSnapshot | null;
  onDeleteCode: (codeID: string) => boolean;
  onUpdateEditorContent: (contentState: Value) => void;
  plugins?: object[];
  editorState?: Value | null;
  editorConfigs?: EditorProps;
  allowCoding?: boolean;
  allowEditing?: boolean;
}

interface WorkStationState {
  editorState: Value;
  codeInput: string;
  dataSource: CodeSnapshot[];
  hasSelectedCodedInline: boolean;
  currentInlineCodeIDs: string[];
  allowCoding: boolean;
  allowEditing: boolean;
}

export class WorkStation extends React.PureComponent<
  WorkStationProps,
  WorkStationState
> {
  public static defaultProps = {
    allowCoding: true,
    allowEditing: true,
  };

  public plugins: object[] = [];
  private editor: Editor | null;

  constructor(props: WorkStationProps) {
    super(props);

    let editorState = Value.create({});
    if (props.editorState) {
      editorState = props.editorState;
    }

    this.state = {
      editorState,
      codeInput: '',
      dataSource: this.codes,
      hasSelectedCodedInline: false,
      currentInlineCodeIDs: [],
      allowCoding: true,
      allowEditing: true,
    };

    this.plugins = this.computePlugins(this.props);
  }

  public componentDidUpdate(prevProps: WorkStationProps) {
    if (prevProps.codeList !== this.props.codeList) {
      this.setState({
        dataSource: [...this.codes],
      });
    }

    if (prevProps.allowCoding !== this.props.allowCoding) {
      this.plugins = this.computePlugins(this.props);
    }
  }

  public computePlugins = (props: WorkStationProps) => {
    return [
      BufferedText({ clearOnEscape: true }),
      CodedText({
        onClickCodedText: this.onClickCodedText,
        mixBgColor: true,
      }),
      SoftBreak({ shift: true }),
      RichText({}),
      props.allowCoding ? HoverMenu({}) : null,
      ...(props.plugins ? props.plugins : []),
    ].filter(p => !!p);
  };

  public onChangeEditor = ({ value }: Change) => {
    this.setState({ editorState: value }, () => {
      this.setState({
        hasSelectedCodedInline: this.state.editorState.inlines.some(
          i => i.get('type') === INLINES.CodedText
        ),
      });
    });
    this.props.onUpdateEditorContent(value);
  };

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
      if (code) {
        this.onSelectCode(code);
        this.setState({
          codeInput: code.name,
        });
      }
    }
  };

  public onSelectCode = (code: CodeSnapshot) => {
    const { hasSelectedCodedInline } = this.state;
    // If there are coded inlines selected
    // then we only apply the new code to that selection
    const updateFn = hasSelectedCodedInline
      ? updateSelectedCode
      : updateCodeForBlocks;

    updateFn({
      codeID: code.id,
      action: 'add',
      editor: this.editor!,
    });
  };

  public onDeleteCode = (code: CodeSnapshot) => {
    const { hasSelectedCodedInline } = this.state;
    // If there are coded inlines selected
    // then we only remove the code from that selection
    const updateFn = hasSelectedCodedInline
      ? updateSelectedCode
      : updateCodeForBlocks;

    updateFn({
      codeID: code.id,
      action: 'delete',
      editor: this.editor!,
    });

    if (!hasSelectedCodedInline) {
      this.props.onDeleteCode(code.id);
    }
  };

  public onSearchCode = (inputVal: string) => {
    const containsCode =
      this.codes.filter(code => code.name === inputVal).length === 1;
    const filteredCodes = this.excludedCodes.filter(code => {
      if (!inputVal) return true;
      const included = code.name.toLowerCase().includes(inputVal.toLowerCase());
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

  public onClickCodedText = ({
    codeIDs,
  }: {
    node: Inline;
    codeIDs: string[];
  }) => {
    this.setState({ currentInlineCodeIDs: codeIDs });
  };

  get codes(): Array<CodeSnapshot & { count?: number }> {
    const { codeList } = this.props;
    if (!codeList) return [];

    let codeSummary = {};
    if (this.state) {
      const { editorState } = this.state;
      codeSummary = getCodeSummary({ value: editorState });
    }

    return codeList.map(code => ({
      ...code,
      count: (codeSummary[code.id] && codeSummary[code.id].count) || 0,
    }));
  }

  get sortedCodes() {
    return this.codes.sort((a, b) => {
      if (a && b && a.count && b.count) {
        return b.count - a.count;
      } else {
        return 1;
      }
    });
  }

  get currentCodes() {
    const { currentInlineCodeIDs, hasSelectedCodedInline } = this.state;

    if (!hasSelectedCodedInline) return null;

    return this.codes.filter(c => currentInlineCodeIDs.includes(c.id));
  }

  // all the codes but those codes that the current selected
  // entity contains
  get excludedCodes() {
    return this.codes.filter(code =>
      !this.currentCodes ? true : !this.currentCodes.find(c => c.id === code.id)
    );
  }

  public render() {
    const { editorState, dataSource, hasSelectedCodedInline } = this.state;
    const { editorConfigs, allowCoding } = this.props;
    return (
      <Container>
        <Editor
          value={editorState}
          plugins={this.plugins}
          className={'slate-editor'}
          ref={element => {
            this.editor = element;
          }}
          onChange={this.onChangeEditor}
          style={!allowCoding ? { maxHeight: 'none' } : {}}
          {...editorConfigs}
        />

        {allowCoding && (
          <SideContainer>
            <AutoComplete
              onSelect={this.onSelectOption}
              onSearch={this.onSearchCode}
              onFocus={() => this.onSearchCode('')}
              dataSource={dataSource}
              placeholder="Type to search codes or create a new one"
              allowClear
            />
            <UsedCodeTags
              codes={
                hasSelectedCodedInline ? this.currentCodes : this.sortedCodes
              }
              onClick={this.onSelectCode}
              onClose={this.onDeleteCode}
            />
          </SideContainer>
        )}
      </Container>
    );
  }
}
