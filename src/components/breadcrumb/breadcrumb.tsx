import { Breadcrumb } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { routeConstants } from '~/lib/constants';

import {
  FirstLevelFactory,
  WorkSpaceBreadcrumb,
  WorkSpaceDocBreadcrumb,
} from './index';

export const breadcrumbRoutes = [
  { path: '/', breadcrumb: null },
  {
    path: routeConstants.root,
    breadcrumb: FirstLevelFactory({ name: 'Workspaces' }),
  },
  { path: `${routeConstants.root}/:id`, breadcrumb: null },
  { path: routeConstants.workStationEdit, breadcrumb: WorkSpaceBreadcrumb },
  { path: routeConstants.workspaceSummary, breadcrumb: WorkSpaceBreadcrumb },
  { path: routeConstants.workspaceDocs, breadcrumb: WorkSpaceBreadcrumb },
  { path: routeConstants.workStation, breadcrumb: WorkSpaceDocBreadcrumb },
  {
    path: routeConstants.codebooks,
    breadcrumb: FirstLevelFactory({ name: 'Codebooks' }),
  },
  { path: '*', breadcrumb: null },
];

export const Breadcrumbs = ({
  breadcrumbs,
}: {
  breadcrumbs: JSX.Element[];
}) => (
  <Breadcrumb>
    {breadcrumbs.map((breadcrumb: JSX.Element, index: number) => (
      <Breadcrumb.Item key={breadcrumb.key || index}>
        <NavLink to={breadcrumb.props.match.url}>{breadcrumb}</NavLink>
      </Breadcrumb.Item>
    ))}
  </Breadcrumb>
);
