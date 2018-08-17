import * as React from "react";

import Plus from "../../../assets/plus.svg";
import EmptyPlaceholder from "../../../components/emptyPlaceholder";

export default (props: any) => (
	<EmptyPlaceholder
		description={
			"You do not have any work space created. Please Create one to get CODED!"
		}
		{...props}
	/>
);
