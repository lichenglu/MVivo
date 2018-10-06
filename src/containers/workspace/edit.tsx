import { notification } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Helmet } from 'react-helmet';

import { RootStore } from '~/stores/root-store';

// components
import { EditForm } from './components/edit';

interface WorkSpaceEditProps extends RouteCompProps<{ id: string }> {
  rootStore: RootStore;
}

interface WorkSpaceEditState {}

@inject('rootStore')
@observer
export class WorkSpaceEditPanel extends React.Component<
  WorkSpaceEditProps,
  WorkSpaceEditState
> {
  public state = {};

  get workSpace() {
    const workSpaceID = this.props.match.params.id;
    return this.props.rootStore.workSpaceStore.workSpaceBy(workSpaceID);
  }

  get codeBooks() {
    return this.props.rootStore.codeBookStore.codeBookList;
  }

  public render(): JSX.Element {
    return (
      <React.Fragment>
        <Helmet>
          <title>WorkSpace - edit</title>
        </Helmet>

        <EditForm {...this.workSpace} codeBooks={this.codeBooks} />
      </React.Fragment>
    );
  }
}
