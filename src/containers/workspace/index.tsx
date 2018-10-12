import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';

import { Loading } from '~/components/loading';
import { routeConstants } from '~/lib/constants';

// import { DocumentManagement } from './documentManagement';
// import { WorkSpaceEditPanel } from './edit';
// import { WorkSpace } from './list';
// import { Summary } from './summary';
// import { WorkStationContainer } from './workStation';

const WorkSpaceLoadable = Loadable({
  loader: () => import('./list'),
  loading: Loading,
});

const DocumentManagementLoadable = Loadable({
  loader: () => import('./documentManagement'),
  loading: Loading,
});

const WorkSpaceEditPanelLoadable = Loadable({
  loader: () => import('./edit'),
  loading: Loading,
});

const SummaryLoadable = Loadable({
  loader: () => import('./summary'),
  loading: Loading,
});

const WorkStationContainerLoadable = Loadable({
  loader: () => import('./workStation'),
  loading: Loading,
});

export * from './components';

export default () => (
  <Switch>
    <Route
      exact={true}
      path={routeConstants.root}
      component={WorkSpaceLoadable}
    />
    <Route
      exact={true}
      path={routeConstants.workspaceDocs}
      component={DocumentManagementLoadable}
    />
    <Route
      exact={true}
      path={routeConstants.workspaceSummary}
      component={SummaryLoadable}
    />
    <Route
      exact={true}
      path={routeConstants.workStationEdit}
      component={WorkSpaceEditPanelLoadable}
    />
    <Route
      exact={true}
      path={routeConstants.workStation}
      component={WorkStationContainerLoadable}
    />
  </Switch>
);
