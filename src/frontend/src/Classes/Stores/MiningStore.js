import { algorithms } from "../../Pages/Algorithms";
import { ActionTypes } from "../Constants";
import { dispatcher } from "../Dispatcher";
import Store from "../Store";
import ConfigStore from "./ConfigStore";

let isMining = false;

const MiningStoreClass = class MiningStore extends Store {
	get isMining() {
		return isMining;
	}

	startMining() {
		dispatcher.dispatch({
			type: ActionTypes.START_MINING,
		});
	}

	stopMining() {
		dispatcher.dispatch({
			type: ActionTypes.STOP_MINING,
		});
	}

	killAllMinersInstantly() {
		for (const algorithmId in algorithms) {
			const algorithm = algorithms[algorithmId];
			algorithm?.process?.kill();
		}
	}
}

const MiningStore = new MiningStoreClass(dispatcher, {
	[ActionTypes.START_MINING]: () => {
		const enabledAlgorithms = ConfigStore.get("enabledAlgorithms");

		for (const algorithmId of enabledAlgorithms) {
			const algorithm = algorithms[algorithmId];

			if (algorithm) {
				algorithm.start();
			}
			else {
				console.warn("Unknown algorithm found in enabled list: " + algorithmId);
			}
		}

		isMining = true;
	},
	[ActionTypes.STOP_MINING]: () => {
		const enabledAlgorithms = ConfigStore.get("enabledAlgorithms");

		for (const algorithmId of enabledAlgorithms) {
			const algorithm = algorithms[algorithmId];

			if (algorithm) {
				algorithm.stop();
			}
			else {
				console.warn("Unknown algorithm found in enabled list: " + algorithmId);
			}
		}

		isMining = false;
	},
});

export default MiningStore;