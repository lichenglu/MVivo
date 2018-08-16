import { Avatar, Card, Icon, Popover } from "antd";
import * as color from "color";
import * as React from "react";
import styled from "styled-components";

import { WorkSpaceSnapshot } from "../../../stores";
import { Colors } from "../../../themes";

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

const Action = styled.p`
	// @ts-ignore
	color: ${props => (props.important ? Colors.paleRed : Colors.blue)};
	cursor: pointer;
	width: 100%;
	margin: 0;
	padding: 0.3rem 0;
	border-bottom: solid 1px ${Colors.borderGray.toString()};
	&:hover {
		color: ${props =>
			// @ts-ignore
			props.important
				? color(Colors.paleRed)
						.darken(0.4)
						.toString()
				: color(Colors.blue)
						.darken(0.4)
						.toString()};
		transition: 0.5s;
	}
`;

const ActionContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const actions = [
	{ key: "share", text: "Share" },
	{ key: "delete", text: "Delete", important: true }
];

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
				<Popover
					key="ellipsis"
					placement="bottom"
					title={"Action"}
					content={
						<ActionContainer>
							{actions.map(action => (
								// @ts-ignore
								<Action key={action.key} important={action.important}>
									{action.text}
								</Action>
							))}
						</ActionContainer>
					}
					trigger="click"
				>
					<Icon type="ellipsis" onClick={onRequestMoreAction} />
				</Popover>
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
