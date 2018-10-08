import { values } from 'mobx';
import { inject, observer } from 'mobx-react';
import { concat, mergeDeepWithKey } from 'ramda';
import * as React from 'react';
import { Helmet } from 'react-helmet';

import { Document, RootStore } from '~/stores/root-store';

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

const mergeCodeSummary = (key: string, l: any, r: any) => {
  if (key === 'examples') {
    return concat(l, r);
  }
  if (key === 'count') {
    return l + r;
  }
  return r;
};

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
    if (this.workSpace && this.workSpace.codeBook && this.workSpace.documents) {
      const summaries = values(this.workSpace.documents).map(
        (document: Document) => {
          return document.editorContentState
            ? getCodeSummary({
                value: document.editorContentState,
              })
            : {};
        }
      );

      const summary = summaries.reduce((cur, next) => {
        return mergeDeepWithKey(mergeCodeSummary, cur, next);
      }, {});

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
    text,
  }: {
    codeID: string;
    text: string;
  }) => {
    if (this.workSpace && this.workSpace.codeBook) {
      this.props.rootStore.codeBookStore.updateCodeOf(
        this.workSpace.codeBook.id,
        codeID,
        { definition: text }
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
