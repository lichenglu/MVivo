import { Avatar, Card, Icon } from "antd";
import * as React from "react";
import styled from "styled-components";

import { WorkSpaceSnapshot } from "../../../stores";

interface WorkSpaceCardProps {
	data: WorkSpaceSnapshot;
	onEdit?: () => void;
	onRequestMoreAction?: () => void;
}

const Container = styled.div`
	display: flex;
	flex: 1;
	width: calc(100% - 1rem);
	margin-bottom: 1rem;
	margin-right: 0.5rem;
	margin-left: 0.5rem;
	float: left;

	@media (min-width: 500px) {
		flex: 0.5;
		width: calc(50% - 1rem);
	}

	@media (min-width: 960px) {
		flex: 0.25;
		width: calc(25% - 1rem);
	}
`;

export default ({ data, onEdit, onRequestMoreAction }: WorkSpaceCardProps) => (
	<Container>
		<Card
			cover={
				<img
					alt="cover image"
					src="https://source.unsplash.com/800x450/?research"
				/>
			}
			actions={[
				<Icon key="edit" type="edit" onClick={onEdit} />,
				<Icon key="ellipsis" type="ellipsis" onClick={onRequestMoreAction} />
			]}
		>
			<Card.Meta
				// TODO: use different images according to ws's importance
				// avatar={
				// 	<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
				// }
				title={data.name}
				description={data.description}
			/>
		</Card>
	</Container>
);
