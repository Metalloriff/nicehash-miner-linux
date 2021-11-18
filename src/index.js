const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;
async function init() {
	// Create the main window
	if (mainWindow) return;
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 700,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true
		}
	});

	if (process.env.npm_lifecycle_script?.includes("--dev")) {
		await mainWindow.loadURL("http://localhost:3000/");
	}
	else {
		await mainWindow.loadFile(path.join(__dirname, "frontend", "index.html"));
	}
}

// Disable hardware acceleration because hardware acceleration is a useless sack of garbage that just slows apps down and causes them to crash randomly for no reason
// Also this is a GPU miner so that's a bad idea times 2
app.disableHardwareAcceleration();
// And then initialize when ready :)
app.whenReady().then(init);
// When all windows are closed, die
app.on("window-all-closed", app.exit.bind(app, 1));