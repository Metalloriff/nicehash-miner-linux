import React from "react";
import { ActionTypes } from "../Classes/Constants";
import { dispatcher } from "../Classes/Dispatcher";
import LogsStore from "../Classes/Stores/LogsStore";
import "./Logs.scss";

export default function LogsPage() {
	dispatcher.useForceUpdater(ActionTypes.UPDATE_LOGS);
	const messages = LogsStore.getMessages();

	return (
		<div className="LogsPage">
			<div className="Messages">
				{messages.map((message, index) => (
					<div className={"Message " + message.type} key={index}>
						{message.message}
					</div>
				))}
			</div>
		</div>
	);
}