import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { routeConstants } from '~/lib/constants';

import { WorkSpace } from '~/containers/workspace/list';
import { WorkSpaceDetail } from './detail';
import { WorkSpaceEditPanel } from './edit';
import { Summary } from './summary';

export * from './components';

export default () => (
  <Switch>
    <Route exact={true} path={routeConstants.root} component={WorkSpace} />
    <Route
      exact={true}
      path={routeConstants.workStation}
      component={WorkSpaceDetail}
    />
    <Route
      exact={true}
      path={routeConstants.workspaceSummary}
      component={Summary}
    />
    <Route
      exact={true}
      path={routeConstants.workspaceEdit}
      component={WorkSpaceEditPanel}
    />
  </Switch>
);
