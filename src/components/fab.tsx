import { Button } from "antd";
import * as React from "react";
import styled from "styled-components";

import Plus from "../assets/plus_circle.svg";

// @ts-ignore
const Fab = styled(Button)`
	&&&& {
		position: absolute;
		bottom: 5%;
		right: 5%;
		z-index: 999;
		width: 4rem;
		height: 4rem;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
`;

const CustIcon = styled(Plus)`
	width: 80%;
	height: 80%;
`;

export default (props: any) => (
	<Fab type="primary" shape="circle" {...props}>
		<CustIcon />
	</Fab>
);
