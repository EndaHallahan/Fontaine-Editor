const { ipcMain, dialog } = require('electron');
const isDev = require("electron-is-dev");
const path = require("path");

const rfs = require("./native/r-fs");

function getLocation() {
	if (!isDev) {
		return process.argv[1].replace("\\index.ftne", ""); //Make me better please
	} else {
		return process.argv[0].replace("\\node_modules\\electron\\dist\\electron.exe", "\\test-project");
	}
}

ipcMain.handle("doc_api_location", async (event, ...args) => {
	return getLocation();
});

ipcMain.handle("doc_api_fetch", async (event, ...args) => {
	return rfs.getFile(args[0]) || null;
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
			let fileboxLoc = getLocation() + "\\Files\\FileBox\\";
			console.log(files);
			for (let filePath of files.filePaths) {
				let fileName = path.basename(filePath);
				let rescopy = rfs.copyFile(filePath, fileboxLoc + fileName);
				if (rescopy) {throw rescopy;}
				let res64 = rfs.copyBase64(filePath, fileboxLoc + fileName + ".b64");
				if (res64) {throw res64;}
				result.push(fileName);
			}
		} 
		return {ok: true, fileNames: result};
	} catch(err) {
		return {ok: false, error: err};
	}
});