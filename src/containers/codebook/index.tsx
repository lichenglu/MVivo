import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';

import { Loading } from '~/components/loading';
import { routeConstants } from '~/lib/constants';

const CodeBookListLoadable = Loadable({
  loader: () => import('./list'),
  loading: Loading,
});

const CodeBookEditLoadable = Loadable({
  loader: () => import('./edit'),
  loading: Loading,
});

export default () => (
  <Switch>
    <Route
      path={routeConstants.codebooks}
      component={CodeBookListLoadable}
      exact={true}
    />
    <Route
      path={routeConstants.codebookEdit}
      component={CodeBookEditLoadable}
      exact={true}
    />
  </Switch>
);
