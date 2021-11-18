export const ActionTypes = {
	UPDATE_PAGE: "UPDATE_PAGE",
	UPDATE_ROUTE: "UPDATE_ROUTE",
	START_MINING: "START_MINING",
	STOP_MINING: "STOP_MINING",
	UPDATE_HASHRATE: "UPDATE_HASHRATE",
	UPDATE_CONFIG: "UPDATE_CONFIG",
	UPDATE_LOGS: "UPDATE_LOGS",
};

export function hashrateToValue(hashrate) {
	let [value, unit] = hashrate.split(" ");

	value = +value;
	unit = unit.split("/")[0].toUpperCase();

	switch (unit) {
		case "H":
			return value;
		case "KH":
			return value * 1_000;
		case "MH":
			return value * 1_000_000;
		case "GH":
			return value * 1_000_000_000;
		case "TH":
			return value * 1_000_000_000_000;
		case "PH":
			return value * 1_000_000_000_000_000;
	}
}

export function valueToHashrate(value) {
	let unit = "H";

	if (value > 1_000_000_000_000_000) {
		value /= 1_000_000_000_000_000;
		unit = "PH";
	}
	else if (value > 1_000_000_000_000) {
		value /= 1_000_000_000_000;
		unit = "TH";
	}
	else if (value > 1_000_000_000) {
		value /= 1_000_000_000;
		unit = "GH";
	}
	else if (value > 1_000_000) {
		value /= 1_000_000;
		unit = "MH";
	}
	else if (value > 1_000) {
		value /= 1_000;
		unit = "KH";
	}

	return `${value.toFixed(2)} ${unit}/s`;
}