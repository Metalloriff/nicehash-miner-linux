import React from "react";
import ConfigStore from "../Classes/Stores/ConfigStore";
import LogsStore from "../Classes/Stores/LogsStore";
import MiningStore from "../Classes/Stores/MiningStore";
import SwitchItem from "../Components/SwitchItem";
import "./Algorithms.scss";

// TODO add CPU usage cap setting

export const algorithms = {
	// Recommended miners
	daggerhashimoto: {
		name: "DaggerHashimoto",
		github: "https://github.com/nanopool/phoenix-miner",
		recommended: true,
		type: "GPU",

		getApp() {
			const config = ConfigStore.getConfig();

			return {
				cmd: "PhoenixMiner",
				args: [
					["-pool", `stratum+tcp://daggerhashimoto.${config.location}.nicehash.com:3353`],
					["-wal", `${config.walletAddress}.${config.workerName.split(" ").join("-")}`],
					["-proto", "4"],
					["-stales", "0"],
					["-log", "0"]
				]
			};
		},

		start() {
			return startAlgorithm("daggerhashimoto");
		},

		stop() {
			this.process.kill();
		}
	},

	// Other miners


	randomxmonero: {
		name: "RandomXMonero",
		github: "https://github.com/xmrig/xmrig",
		type: "CPU",

		getApp() {
			const config = ConfigStore.getConfig();

			return {
				cmd: "xmrig",
				args: [
					["--url", `stratum+tcp://randomxmonero.${config.location}.nicehash.com:3380`],
					["--user", `${config.walletAddress}.${config.workerName.split(" ").join("-")}`],
					["-p", config.workerPassword],
					["--print-time", "5"],
					["--donate-level", "0"],
					["--coin", "monero"],
					["--nicehash"]
				]
			};
		},

		start() {
			return startAlgorithm("randomxmonero");
		},

		stop() {
			this.process.kill();
		}
	},

	kawpow: {
		name: "KAWPOW",
		github: "https://github.com/RavenCommunity/kawpowminer",
		type: "GPU",

		getApp() {
			const config = ConfigStore.getConfig();

			return {
				cmd: "kawpowminer",
				args: [
					["-pool", `stratum+tcp://${config.walletAddress}.${config.workerName.split(" ").join("-")}@kawpow.${config.location}.nicehash.com:3385`],

				]
			}
		}
	}
};

export function startAlgorithm(algorithmId) {
	const algorithm = algorithms[algorithmId];
	const app = algorithm.getApp();

	console.log("[System]: Starting miner - " + algorithm.name);

	algorithm.process = window.require("child_process").spawn(app.cmd, app.args.flat());

	algorithm.process.stdout.on("data", data => {
		console.log(`[${algorithm.name} miner] stdout: ${data}`);

		LogsStore.pushLog("info", `[${algorithm.name}]: ${data}`);
	});

	algorithm.process.stderr.on("data", data => {
		console.log(`[${algorithm.name} miner] stderr: ${data}`);

		LogsStore.pushLog("error", `[${algorithm.name}]: ${data}`);
	});

	algorithm.process.on("error", err => {
		console.log(`[${algorithm.name} miner] error: ${err}`);

		LogsStore.pushLog("error", `[${algorithm.name}]: ${err}`);
	});

	return algorithm.process;
}

export default function AlgorithmsPage() {
	let enabledAlgorithms = ConfigStore.useState(() => ConfigStore.get("enabledAlgorithms"));

	return (
		<div className="AlgorithmsPage">
			<h1 className="CategoryLabel">Recommended Miners</h1>
			{Object.keys(algorithms).filter(id => algorithms[id].recommended).map(algorithmId => (
				<AlgorithmItem
					key={algorithmId}
					algorithmId={algorithmId}
					enabledAlgorithms={enabledAlgorithms}
				/>
			))}

			<h1 className="CategoryLabel">Other Miners</h1>
			{Object.keys(algorithms).filter(id => !algorithms[id].recommended).map(algorithmId => (
				<AlgorithmItem
					key={algorithmId}
					algorithmId={algorithmId}
					enabledAlgorithms={enabledAlgorithms}
				/>
			))}
		</div >
	);
}

function AlgorithmItem({ algorithmId, enabledAlgorithms }) {
	const isInstalled = React.useMemo(() => {
		const algorithm = algorithms[algorithmId];

		try {
			return !!window.require("child_process").spawnSync(
				`which ${algorithm.getApp().cmd}`,
				{ encoding: "utf-8" }
			);
		}
		catch (err) {
			return false;
		}
	}, []);

	function openLink(link) {
		window.require("electron").shell.openExternal(link);
	}

	return (
		<div className={"Algorithm " + (isInstalled ? "Installed" : "")}>
			<div className="Header FlexCenter">
				<h2 className="Name FlexCenter">
					{algorithms[algorithmId].name}

					<div
						className="TypeTag"
						style={{
							background: algorithms[algorithmId].type === "GPU"
								? "var(--green)"
								: algorithms[algorithmId].type === "CPU"
									? "var(--red)"
									: "var(--primary-color)"
						}}
					>{algorithms[algorithmId].type}</div>
				</h2>

				<SwitchItem
					title=""
					defaultValue={enabledAlgorithms.includes(algorithmId)}
					callback={value => {
						if (value) {
							enabledAlgorithms.push(algorithmId);

							if (MiningStore.isMining) {
								startAlgorithm(algorithmId);
							}
						}
						else {
							enabledAlgorithms = enabledAlgorithms.filter(id => id !== algorithmId);

							if (algorithms[algorithmId].process) {
								algorithms[algorithmId].stop();
							}
						}

						ConfigStore.set("enabledAlgorithms", enabledAlgorithms);
					}}
				/>
			</div>

			<a
				className="Url"
				onClick={() => {
					openLink(
						`https://www.nicehash.com/algorithm/${algorithmId}`
					);
				}}
			>https://www.nicehash.com/algorithm/{algorithmId}</a>

			{algorithms[algorithmId].github && (
				<a
					className="Url"
					onClick={() => {
						openLink(
							algorithms[algorithmId].github
						);
					}}
				>{algorithms[algorithmId].github}</a>
			)}

			{!isInstalled && (
				<div className="InstallGuide">
					<p style={{ color: "var(--red)" }}>
						This algorithm is not installed!
					</p>

					<p
						style={{ color: "var(--green)", cursor: "pointer" }}
						onClick={() => {
							const algorithm = algorithms[algorithmId];
							const [, os] = window.require("child_process").execSync("cat /etc/os-release | grep ^ID_LIKE", { encoding: "utf-8" }).split("=");

							window.require("electron").shell.openExternal(
								`https://www.google.com/search?q=${encodeURIComponent(
									`${algorithm.getApp().cmd} ${os} install`
								)}`
							);
						}}
					>
						Click here to search how to install it for your operating system.
					</p>
				</div>
			)}
		</div>
	);
}