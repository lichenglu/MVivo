import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { routeConstants } from '~/lib/constants';

import { CodeBook } from './codebook';

//export * from './components';

export default () => (
  <Switch>
    <Route path={routeConstants.root} component={CodeBook} />
  </Switch>
  CodeBook
);
