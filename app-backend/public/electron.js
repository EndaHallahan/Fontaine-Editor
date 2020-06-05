const electron = require("electron");
const {app, BrowserWindow, Menu} = require("electron");
const electronLocalshortcut = require('electron-localshortcut');

const path = require("path");
const isDev = require("electron-is-dev");

require("./main/documentAPI");

let mainWindow;

function createWindow() {
	console.log(path.join(__dirname, "./preload.js"))
	mainWindow = new BrowserWindow({ 
		width: 900, 
		height: 680, 
		show: false,
		title: "Fontaine",
		//icon: "/build-assets/icon.ico",
		webPreferences: { 
			sandbox: true,
			enableRemoteModule: false,
			contextIsolation: true,
			preload: `${path.join(__dirname, "./preload.js")}`,
		}
	});
	mainWindow.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);
	mainWindow.on("closed", () => (mainWindow = null));
	Menu.setApplicationMenu(null);
	electronLocalshortcut.register(mainWindow, 'Ctrl+Shift+I', () => {
        mainWindow.webContents.toggleDevTools();
    });
    mainWindow.webContents.on("will-navigate", function(e) {e.preventDefault();}); 
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
