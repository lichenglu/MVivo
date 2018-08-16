import { Avatar, Card, Icon } from "antd";
import * as React from "react";
import styled from "styled-components";

import { WorkSpaceSnapshot } from "../../../stores";

import WorkspaceCard from "./workspaceCard";

const Container = styled.div`
	flex: 1;
	width: 100%;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
`;

interface WorkSpaceListProps {
	workspaces: WorkSpaceSnapshot[];
}

export default ({ workspaces }: WorkSpaceListProps) => (
	<Container>
		{workspaces.map(ws => (
			<WorkspaceCard key={ws.id} data={ws} />
		))}
	</Container>
);
