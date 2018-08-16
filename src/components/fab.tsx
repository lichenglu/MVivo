import { Button } from "antd";
import { ButtonProps } from "antd/lib/button/button";
import * as React from "react";
import styled from "styled-components";

import Plus from "../assets/plus_circle.svg";

// TODO: better way to type
const Fab = styled<any>(Button)`
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

export default (props: ButtonProps) => (
	<Fab type="primary" shape="circle" {...props}>
		<CustIcon />
	</Fab>
);
