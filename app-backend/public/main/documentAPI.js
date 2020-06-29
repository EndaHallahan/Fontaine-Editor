const { ipcMain, dialog } = require('electron');
const app = require('electron').app;
const isDev = require("electron-is-dev");
const path = require("path");

const runPlugin = require("./pluginVM").runPlugin;
//console.log(runPlugin("compilers/multimarkdown", {docList: testDocs, options: null}))

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

ipcMain.handle("doc_api_location", async (event, ...args) => {
	return getLocation();
});

ipcMain.handle("doc_api_app_location", async (event, ...args) => {
	return getAppLocation();
});

ipcMain.handle("doc_api_fetch", async (event, ...args) => {
	return rfs.getFile(args[0]) || null;
});
//This method is currently unused, but I'm keeping it in for now. Just in case.
ipcMain.handle("doc_api_fetch_b64", async (event, ...args) => {
	return rfs.getAsBase64(args[0]) || null;
});

ipcMain.handle("doc_api_fetch_bin", async (event, ...args) => {
	return rfs.getAsBin(args[0]) || null;
});

ipcMain.handle("doc_api_write", async (event, ...args) => {
	let result = rfs.writeFile(args[0], args[1]);
	return result;
});

ipcMain.handle("doc_api_import", async (event, ...args) => {
	try {
		const files = await dialog.showOpenDialog();
		let result = [];
		if (!files.canceled) {
			let fileboxLoc = getLocation() + "\\Files\\Imports\\";
			for (let filePath of files.filePaths) {
				let fileName = path.basename(filePath);
				let rescopy = rfs.copyFile(filePath, fileboxLoc + fileName);
				if (rescopy) {throw rescopy;}
				result.push(fileName);
			}
		} 
		return {ok: true, fileNames: result};
	} catch(err) {
		return {ok: false, error: err};
	}
});

ipcMain.handle("doc_api_list_files", async (event, ...args) => {
	let result = rfs.listFiles(args[0]);
	return result;
});