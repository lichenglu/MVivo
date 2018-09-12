import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { routeConstants } from '~/lib/constants';

import { WorkSpaceDetail } from './detail';
import { Summary } from './summary';
import { WorkSpace } from './workSpace';

export * from './components';

export default () => (
  <Switch>
    <Route exact={true} path={routeConstants.root} component={WorkSpace} />
    <Route
      exact={true}
      path={routeConstants.workspaceDetail}
      component={Summary}
    />
  </Switch>
);
