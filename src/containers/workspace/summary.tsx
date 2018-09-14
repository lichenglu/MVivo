import { notification, Switch } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Value } from 'slate';
import styled from 'styled-components';

import { RootStore } from '~/stores/root-store';

import { getCodeSummary } from '~/lib/slate-plugins';

// components
import { APATable, CheckList, PivotTable } from './components/summary';

interface SummaryProps extends RouteCompProps<{ id: string }> {
  rootStore: RootStore;
}

interface SummaryState {
  checkedCodes: string[];
  showAPA: boolean;
}

@inject('rootStore')
@observer
export class Summary extends React.Component<SummaryProps, SummaryState> {
  public state = {
    checkedCodes: this.codeList.map(c => c.id),
    showAPA: false,
  };

  get workSpace() {
    const workSpaceID = this.props.match.params.id;
    return this.props.rootStore.workSpaceStore.workSpaceBy(workSpaceID);
  }

  get codeList() {
    if (
      this.workSpace &&
      this.workSpace.codeBook &&
      this.workSpace.document &&
      this.workSpace.document.editorContentState
    ) {
      const editorState: Value = this.workSpace.document.editorContentState;
      const summary = getCodeSummary({ value: editorState });

      return this.workSpace.codeBook.codeList.map(code => {
        return {
          ...code,
          ...summary[code.id],
        };
      });
    }
    return [];
  }

  get filteredCodes() {
    const { checkedCodes } = this.state;
    return this.codeList.filter(c => checkedCodes.includes(c.id));
  }

  public onCheckCode = (checked: string[]) => {
    this.setState({ checkedCodes: checked });
  };

  public onChangeDefinition = ({
    codeID,
    definition,
  }: {
    codeID: string;
    definition: string;
  }) => {
    if (this.workSpace && this.workSpace.codeBook) {
      this.props.rootStore.codeBookStore.updateCodeOf(
        this.workSpace.codeBook.id,
        codeID,
        { definition }
      );
    }
  };

  public onChangeAPASwitch = (checked: boolean) =>
    this.setState({ showAPA: checked });

  public render(): JSX.Element | null {
    const { showAPA } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <title>WorkSpace Summary</title>
        </Helmet>

        <CheckList
          codes={this.codeList}
          onCheckCode={this.onCheckCode}
          onChangeAPASwitch={this.onChangeAPASwitch}
        />
        {!showAPA && (
          <PivotTable
            codes={this.filteredCodes}
            rowKey={'id'}
            onChangeDefinition={this.onChangeDefinition}
          />
        )}
        {showAPA && <APATable rows={this.filteredCodes} />}
      </React.Fragment>
    );
  }
}
