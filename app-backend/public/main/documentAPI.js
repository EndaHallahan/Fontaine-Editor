const { ipcMain } = require('electron');
const isDev = require("electron-is-dev");

const rfs = require("./native/r-fs");

ipcMain.handle("doc_api_location", async (event, ...args) => {
	if (!isDev) {
		return process.argv[1].replace("\\index.ftne", ""); //Make me better please
	} else {
		return process.argv[0].replace("\\node_modules\\electron\\dist\\electron.exe", "\\test-project");
	}
});

ipcMain.handle("doc_api_fetch", async (event, ...args) => {
	return rfs.getFile(args[0]) || null;
});

ipcMain.handle("doc_api_write", async (event, ...args) => {
	let result = rfs.writeFile(args[0], args[1]);
	return result;
});