import { values } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Helmet } from 'react-helmet';

import { RootStore } from '~/stores/root-store';

// components
import { APATable, CheckList, PivotTable } from '~/components/codebook';

interface CodeBookEditProps extends RouteCompProps<{ id: string }> {
  rootStore: RootStore;
}

interface CodeBookEditState {
  checkedCodes: string[];
  showAPA: boolean;
}

@inject('rootStore')
@observer
export class CodeBookEdit extends React.Component<
  CodeBookEditProps,
  CodeBookEditState
> {
  public state = {
    checkedCodes: this.codeList.map(c => c.id),
    showAPA: false,
  };

  get codeBook() {
    const codebookID = this.props.match.params.id;
    return this.props.rootStore.codeBookStore.codeBookBy(codebookID);
  }

  get codeList() {
    if (this.codeBook && this.codeBook.codes) {
      return this.codeBook.codeList;
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
    if (this.codeBook) {
      this.props.rootStore.codeBookStore.updateCodeOf(
        this.codeBook.id,
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
          <title>CodeBook - edit</title>
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
            omittedColumns={['count', 'examples']}
            onChangeDefinition={this.onChangeDefinition}
          />
        )}
        {showAPA && (
          <APATable
            omittedColumns={['count', 'examples']}
            rows={this.filteredCodes}
          />
        )}
      </React.Fragment>
    );
  }
}
