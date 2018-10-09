import { inject, observer } from 'mobx-react';
import React from 'react';

import { RootStore } from '~/stores';

interface WorkSpaceBreadcrumbProps extends RouteCompProps<{ id: string }> {
  rootStore: RootStore;
}

@inject('rootStore')
@observer
export class WorkSpaceBreadcrumb extends React.Component<
  WorkSpaceBreadcrumbProps,
  {}
> {
  get wsName() {
    const wsID = this.props.match.params.id;
    const ws = this.props.rootStore.workSpaceStore.workSpaceBy(wsID);
    const suffix = this.props.match.path.split('/').pop();
    const name = ws ? ws.name : 'Workspace of no name';
    return `${name} (${suffix})`;
  }

  public render() {
    return <span>{this.wsName}</span>;
  }
}
