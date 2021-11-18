import { ActionTypes } from "../Constants";
import { dispatcher } from "../Dispatcher";
import Store from "../Store";

const logs = [];

const LogsStoreClass = class LogsStore extends Store {
	getMessages() {
		return logs;
	}

	pushLog(type, message) {
		dispatcher.dispatch({
			type: ActionTypes.UPDATE_LOGS,
			logType: type,
			message
		});
	}
}

const LogsStore = new LogsStoreClass(dispatcher, {
	[ActionTypes.UPDATE_LOGS]: ({ logType, message }) => {
		logs.unshift({
			type: logType,
			message,
			time: Date.now()
		});

		while (logs.length > 100) {
			logs.pop();
		}
	}
});

export default LogsStore;