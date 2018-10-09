import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { routeConstants } from '~/lib/constants';

import { CodeBook } from '~/containers/codebook/list';

export default () => (
  <Switch>
    <Route path={routeConstants.codebooks} component={CodeBook} exact={true} />
  </Switch>
);
