import { Breadcrumb } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';

import { RootStore } from '~/stores';

interface WorkSpaceDocBreadcrumbProps
  extends RouteCompProps<{ wsID: string; docID: string }> {
  rootStore: RootStore;
}

@inject('rootStore')
@observer
export class WorkSpaceDocBreadcrumb extends React.Component<
  WorkSpaceDocBreadcrumbProps,
  {}
> {
  get wsName() {
    const wsID = this.props.match.params.wsID;
    const ws = this.props.rootStore.workSpaceStore.workSpaceBy(wsID);
    return ws ? ws.name : 'Workspace of no name';
  }

  get docName() {
    const docID = this.props.match.params.docID;
    const doc = this.props.rootStore.workSpaceStore.documentBy(docID);
    return doc ? doc.name : 'Document of no name';
  }

  public render() {
    return <span>{this.docName}</span>;
  }
}
