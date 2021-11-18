import _ from "lodash";
import { ActionTypes } from "../Constants";
import { dispatcher } from "../Dispatcher";
import Store from "../Store";

const config = _.extend({
	walletAddress: "",
	workerName: "linux-miner",
	location: "usa",
	enabledAlgorithms: [],
	autoStart: false
}, JSON.parse(window.localStorage.getItem("config") || "{}"));

const ConfigStoreClass = class ConfigStore extends Store {
	getConfig() {
		return config;
	}

	get(path) {
		return _.get(config, path);
	}

	set(path, value) {
		dispatcher.dispatch({
			type: ActionTypes.UPDATE_CONFIG,
			path,
			value
		});
	}
}

const ConfigStore = new ConfigStoreClass(dispatcher, {
	[ActionTypes.UPDATE_CONFIG]: ({ path, value }) => {
		_.set(config, path, value);

		window.localStorage.setItem("config", JSON.stringify(config));
	}
});

export default ConfigStore;