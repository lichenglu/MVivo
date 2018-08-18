import { notification } from "antd";
import * as React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import { RootStore, WorkSpaceSnapshot } from "~/stores/root-store";

// components

interface CodingZoneProps {
	workSpace: WorkSpaceSnapshot;
}

const Container = styled.div``;

export class CodingZone extends React.Component<CodingZoneProps, {}> {
	public render(): JSX.Element | null {
		return <Container>Coding Zone</Container>;
	}
}
