const electron = require("electron");
const {app, BrowserWindow, Menu} = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

require("./main/documentAPI");

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({ 
		width: 900, 
		height: 680, 
		show: false,
		title: "Fontaine",
		//icon: "/build-assets/icon.ico",
		webPreferences: { nodeIntegration: true }
	});
	mainWindow.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);
	mainWindow.on("closed", () => (mainWindow = null));
	//Menu.setApplicationMenu(null);
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})
	return mainWindow;
}

app.on("ready", () => {
	let win = createWindow();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});