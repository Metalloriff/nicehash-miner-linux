import React from "react";
import { ExternalLink } from "react-feather";
import "./App.scss";
import RoutesStore from "./Classes/Stores/RoutesStore";
import LinkWrapper from "./Components/InternalLinkWrapper";
import AlgorithmsPage from "./Pages/Algorithms";
import HomePage from "./Pages/Home";
import LogsPage from "./Pages/Logs";
import SettingsPage from "./Pages/Settings";

function PageElement() {
	RoutesStore.useState(() => RoutesStore.getCurrentRoute());
	const [page, ...args] = RoutesStore.getFormattedRoute();

	switch (page) {
		default: return <HomePage />;
		case "algorithms": return <AlgorithmsPage />;
		case "logs": return <LogsPage />;
		case "settings": return <SettingsPage />;
	}
}

export default function App() {
	RoutesStore.useState(() => RoutesStore.getCurrentRoute());
	const [page] = RoutesStore.getFormattedRoute();

	return (
		<div className="App">
			<div className="Tabs">
				<LinkWrapper href="/" className={"Tab " + (!page ? "Selected" : "")}>Dashboard</LinkWrapper>
				<LinkWrapper href="/algorithms" className={"Tab " + (page === "algorithms" ? "Selected" : "")}>Algorithms</LinkWrapper>
				<LinkWrapper href="/logs" className={"Tab " + (page === "logs" ? "Selected" : "")}>Logs</LinkWrapper>
				<LinkWrapper href="/settings" className={"Tab " + (page === "settings" ? "Selected" : "")}>Settings</LinkWrapper>

				<div
					onClick={() => {
						window.require("electron").shell.openExternal("https://www.nicehash.com/my/dashboard");
					}}
					className="Tab FlexCenter"
					style={{
						cursor: "pointer",
						color: "var(--primary-color)",
						marginLeft: "auto"
					}}
				>Online Dashboard <ExternalLink /></div>
			</div>

			<div className="Main">
				<PageElement />
			</div>
		</div>
	);
}