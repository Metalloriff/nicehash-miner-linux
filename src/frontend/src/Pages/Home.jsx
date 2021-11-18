import React from "react";
import { AlertTriangle, Play, Square } from "react-feather";
import ConfigStore from "../Classes/Stores/ConfigStore";
import MiningStore from "../Classes/Stores/MiningStore";
import "./Home.scss";

export default function HomePage() {
	const isMining = MiningStore.useState(() => MiningStore.isMining);
	const walletAddress = ConfigStore.useState(() => ConfigStore.get("walletAddress"));
	const enabledAlgorithms = ConfigStore.useState(() => ConfigStore.get("enabledAlgorithms"));

	const status = React.useMemo(() => {
		if (walletAddress && enabledAlgorithms.length) {
			return isMining ? "Mining" : "Idle";
		}
		else return "NeedsSetup";
	}, [isMining, walletAddress]);

	const statusText = React.useMemo(() => {
		switch (status) {
			case "Mining":
				return "Mining...";
			case "Idle":
				return "Idling";
			case "NeedsSetup": {
				if (!walletAddress)
					return "Your wallet address is not set up!";
				if (!enabledAlgorithms.length)
					return "You have no algorithms enabled!";

				return "Set-up needed!";
			}
		}
	}, [status]);

	return (
		<div className="HomePage">
			<div className="StartButtonContainer FlexCenter">
				<div
					className={"Button FlexCenter " + status}
					onClick={() => {
						switch (status) {
							case "Mining": {
								MiningStore.stopMining();
							} break;

							case "Idle": {
								MiningStore.startMining();
							} break;
						}
					}}
				>
					<div className="Icon">
						<Play className="Start" />
						<Square className="Stop" />

						<AlertTriangle className="Alert" />
					</div>
				</div>

				<h1 className="StatusText">
					{statusText}
				</h1>
			</div>

			<div className="Stats">
				<div className="Stat">
					<span className="TypeLabel">Worker name:</span>
					<span className="ValueLabel">
						{ConfigStore.get("workerName")}
					</span>
				</div>

				<div className="Stat">
					<span className="TypeLabel">Wallet address:</span>
					<span className="ValueLabel">
						{walletAddress || (
							<span style={{ color: "var(--red)" }}>
								NOT SET
							</span>
						)}
					</span>
				</div>

				{/* <div className="Stat">
					<span className="TypeLabel">Hashrate:</span>
					<span className="ValueLabel">
						{MiningStore.getHashrate()}
					</span>
				</div> */}

				<div className="Stat">
					<span className="TypeLabel">Pool location:</span>
					<span className="ValueLabel">
						{ConfigStore.get("location").toUpperCase()}
					</span>
				</div>
			</div>
		</div>
	);
}