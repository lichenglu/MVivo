import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { routeConstants } from '~/lib/constants';

import { WorkSpace } from '~/containers/workspace/list';
import { DocumentManagement } from './documentManagement';
import { WorkSpaceEditPanel } from './edit';
import { Summary } from './summary';
import { WorkStationContainer } from './workStation';

export * from './components';

export default () => (
  <Switch>
    <Route exact={true} path={routeConstants.root} component={WorkSpace} />
    <Route
      exact={true}
      path={routeConstants.workspaceDocs}
      component={DocumentManagement}
    />
    <Route
      exact={true}
      path={routeConstants.workspaceSummary}
      component={Summary}
    />
    <Route
      exact={true}
      path={routeConstants.workStationEdit}
      component={WorkSpaceEditPanel}
    />
    <Route
      exact={true}
      path={routeConstants.workStation}
      component={WorkStationContainer}
    />
  </Switch>
);
