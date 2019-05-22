import { values } from 'mobx';
import { inject, observer } from 'mobx-react';
import { concat, mergeDeepWithKey } from 'ramda';
import * as React from 'react';
import { Helmet } from 'react-helmet';

import { Document, RootStore } from '~/stores/root-store';

import { getCodeSummary, migrateCodedInlines } from '~/lib/slate-plugins';

// components
import { Editor } from 'slate';
import { APATable, CheckList, PivotTable } from '~/components/codebook';

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
class Summary extends React.Component<SummaryProps, SummaryState> {
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
      this.workSpace.documentList.length > 0
    ) {
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
        const parent =
          this.props.rootStore.codeBookStore.getParentFromTree(code.id) || {};
        const { children, ...parentData } = parent;
        const firstLevelTheme = this.workSpace!.codeBook!.firstLevelTheme;

        return {
          ...code,
          ...summary[code.id],
          parent: parentData.id === firstLevelTheme!.id ? null : parentData,
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
    const { rootStore } = this.props;
    if (this.workSpace && this.workSpace.codeBook) {
      const {
        id: curCodeBookID,
        name: curCodeBookName,
      } = this.workSpace.codeBook;
      if (rootStore.isSharedCodeBook(curCodeBookID)) {
        if (
          confirm(
            'This codebook is shared by more than one workspace! Do you want to make a copy of this codebook so that the changes only apply to this project'
          )
        ) {
          // 1. make a copy of codebook
          const copy = rootStore.codeBookStore.copyCodeBookBy(curCodeBookID, {
            name: `Copied from ${curCodeBookName}`,
          });
          if (copy) {
            // 2. migrate coded texts
            const mapper = copy.codeList.reduce((cur, next) => {
              const delimiter = '_@';
              const newIDInArr = next.id.split(delimiter);
              const originalID = newIDInArr
                .slice(0, newIDInArr.length - 1)
                .join(delimiter);

              cur[originalID] = next.id;
              return cur;
            }, {});

            this.workSpace.documents.forEach(doc => {
              if (!doc || !doc.editorContentState) return;
              const { value } = migrateCodedInlines({
                editor: new Editor({ value: doc.editorContentState }),
                mapper,
              });
              this.props.rootStore.workSpaceStore.updateEditorState(
                doc.id,
                value
              );
            });

            this.workSpace.setCodeBook(copy);

            rootStore.codeBookStore.updateCodeOf(
              this.workSpace.codeBook.id,
              mapper[codeID],
              {
                definition: text,
              }
            );

            this.setState({
              checkedCodes: this.state.checkedCodes.map(c => mapper[c]),
            });
            return;
          }
        }
      }

      rootStore.codeBookStore.updateCodeOf(this.workSpace.codeBook.id, codeID, {
        definition: text,
      });
    }
  };

  public onChangeAPASwitch = (checked: boolean) =>
    this.setState({ showAPA: checked });

  public render(): JSX.Element | null {
    const { showAPA } = this.state;
    console.log(this.filteredCodes);
    return (
      <React.Fragment>
        <Helmet>
          <title>WorkSpace - summary</title>
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

export { Summary };
