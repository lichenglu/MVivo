import * as React from "react";
import { Route, Switch } from "react-router-dom";

import { routeConstants } from "~/lib/constants";

import { WorkSpaceDetail } from "./detail";
import { WorkSpace } from "./workspace";

export default () => (
	<Switch>
		<Route exact={true} path={routeConstants.root} component={WorkSpace} />
		<Route
			exact={true}
			path={routeConstants.workspaceDetail}
			component={WorkSpaceDetail}
		/>
	</Switch>
);
