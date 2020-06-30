const { ipcMain, dialog } = require('electron');
const app = require('electron').app;
const isDev = require("electron-is-dev");
const path = require("path");

const runPlugin = require("./pluginVM").runPlugin;
const rfs = require("./native/r-fs");

function getLocation() {
	if (!isDev) {
		return process.argv[1].replace("\\index.ftne", "");
	} else {
		return process.argv[0].replace("\\node_modules\\electron\\dist\\electron.exe", "\\test-project");
	}
}

function getAppLocation() {
	return app.getAppPath();
}

//Args: location, arguments
ipcMain.handle("plugin_api_run", async (event, ...args) => {
	return await runPlugin(args[0], args[1])
});

ipcMain.handle("plugin_api_run_compile", async (event, ...args) => {
	try {
		const files = await dialog.showOpenDialog({
			defaultPath: getLocation(),
			properties: [
				"openDirectory",
				"createDirectory"
			],
			buttonLabel: "Compile"
		});
		if (!files.canceled) {
			let dir = files.filePaths[0];
			const {doc, ext} = await runPlugin(args[0], args[1]);
			console.log("Compiled to: " + dir + "\\" + "compiled" + ext)
			let result = rfs.writeFileDirect(dir + "\\" + "compiled" + ext, doc);
		} 
		return {ok: true};
	} catch(err) {
		return {ok: false, error: err};
	}
});