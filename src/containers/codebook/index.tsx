import { notification } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Helmet } from 'react-helmet';

import { RootStore } from '~/stores/root-store';

// components
import Fab from '~/components/fab';
import CreateCBModal from '~/containers/codebook/components/createModal';
import EmptyView from '~/containers/codebook/components/emptyView';
import CodebookList from '~/containers/codebook/components/codebookList';

interface CodeBookProps {
  rootStore: RootStore;
}

interface CodeBookState {
  cbModalVisible: boolean;
}

@inject('rootStore')
@observer
export class CodeBook extends React.Component<CodeBookProps, CodeBookState> {
  public state = {
    wsModalVisible: false,
  };

  public onCreateCodeBook = (data: any) => {
    const codeBook = this.props.rootStore.createCodeBook(data);
    this.props.rootStore.setWorkSpaceBy(workSpace.id);
    this.toggleWSModalFactory(false)();
    notification.open({
      description: `You have just created a codebook named ${
        codeBook.name
      }. It is also saved locally so that you can still see it when you refresh the browser`,
      message: 'New codebook successfully created',
    });
  };

  public onSelectExtraAction = (
    params: AntClickParam & { codeBookID: string }
  ) => {
    switch (params.key) {
      case 'delete':
        this.props.rootStore.deleteCodeBookBy(params.codeBookID);
        break;
      case 'share':
        break;
      default:
        break;
    }
  };

  public toggleCBModalFactory = (toggle: boolean) => () =>
    this.setState({ cbModalVisible: toggle });

  get codeBooks() {
    return this.props.rootStore.codeBookStore.codeBookList;
  }

  get hasCodeBook() {
    return this.props.rootStore.codeBookStore.hasCodeBook;
  }

  public render(): JSX.Element {
    const { cbModalVisible } = this.state;

    return (
      <React.Fragment>
        <Helmet>
          <title>CodeBook</title>
        </Helmet>
        {this.hasCodeBook && <Fab onClick={this.toggleCBModalFactory(true)} />}
        <CreateCBModal
          visible={cbModalVisible}
          codeBooks={this.codeBooks}
          onClose={this.toggleCBModalFactory(false)}
          onSubmit={this.onCreateCodeBook}
        />
        {this.hasCodeBook ? (
          <CodebookList
            codeBooks={this.codeBooks}
            onSelectExtraAction={this.onSelectExtraAction}
          />
        ) : (
          <EmptyView onClick={this.toggleCBModalFactory(true)} />
        )}
      </React.Fragment>
    );
  }
}
