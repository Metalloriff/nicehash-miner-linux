import React from "react";
import ConfigStore from "../Classes/Stores/ConfigStore";
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
		</div>
	);
}

function ConfigField({ setting, ...props }) {
	return (
		// @ts-ignore
		<Field
			onChange={value => ConfigStore.set(setting, value)}
			defaultValue={ConfigStore.get(setting)}
			{...props}
		/>
	);
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