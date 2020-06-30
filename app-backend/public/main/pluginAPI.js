const { ipcMain, dialog } = require('electron');
const app = require('electron').app;
const isDev = require("electron-is-dev");
const path = require("path");

const runPlugin = require("./pluginVM").runPlugin;
//console.log(runPlugin("compilers/multimarkdown", {docList: testDocs, options: null}))

/*function getLocation() {
	if (!isDev) {
		return process.argv[1].replace("\\index.ftne", "");
	} else {
		return process.argv[0].replace("\\node_modules\\electron\\dist\\electron.exe", "\\test-project");
	}
}

function getAppLocation() {
	return app.getAppPath();
}*/

//Args: location, arguments
ipcMain.handle("plugin_api_run", async (event, ...args) => {
	return await runPlugin(args[0], args[1])
});