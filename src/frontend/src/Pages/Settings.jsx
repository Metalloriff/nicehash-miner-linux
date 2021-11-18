import React from "react";
import ConfigStore from "../Classes/Stores/ConfigStore";
import SwitchItem from "../Components/SwitchItem";
import "./Settings.scss";

export default function SettingsPage() {
	return (
		<div className="SettingsPage">
			<ConfigField
				setting="walletAddress"
				label="Wallet Address"
				description="Your NiceHash BTC wallet address."
				placeholder="Enter your wallet address"
			/>

			<ConfigField
				setting="workerName"
				label="Worker Name"
				description="The name of your machine/worker to display on the NiceHash web dashboard."
				placeholder="Enter your worker name"
				maxLength={15}
			/>

			<ConfigField
				setting="location"
				label="Pool Location"
				description="The location for your NiceHash pool. Choose the location closest to you."
				placeholder="Ex: usa, eu"
			/>

			<ConfigField
				setting="autoStart"
				label="Auto Start"
				description="Automatically start mining when the app loads."
				type="boolean"
			/>
		</div>
	);
}

function ConfigField({ setting, type = null, ...props }) {
	switch (type) {
		default: {
			return (
				// @ts-ignore
				<Field
					onChange={value => ConfigStore.set(setting, value)}
					defaultValue={ConfigStore.get(setting)}
					{...props}
				/>
			);
		}

		case "boolean": {
			return (
				<div className="FieldContainer">
					<h1 className="Label">{props.label}</h1>
					<p className="Description">{props.description}</p>

					<SwitchItem
						title="Enabled"
						defaultValue={ConfigStore.get(setting)}
						callback={value => ConfigStore.set(setting, value)}
					/>
				</div>
			);
		}
	}
}

function Field({ defaultValue, onChange, label, description, placeholder }) {
	const [value, setValue] = React.useState(defaultValue);

	return (
		<div className="FieldContainer">
			<h1 className="Label">{label}</h1>
			<p className="Description">{description}</p>

			<input
				className="Field"
				type="text"
				placeholder={placeholder}
				value={value}

				onChange={e => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
			/>
		</div>
	);
}