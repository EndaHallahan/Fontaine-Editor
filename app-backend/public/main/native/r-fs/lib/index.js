var addon = require('../native');

module.exports = {
	getFile: addon.getFile,
	getAsBase64: addon.getAsBase64,
	getAsBin: addon.getAsBin,
	writeFile: addon.writeFile,
	writeFileDirect: addon.writeFileDirect,
	copyFile: addon.copyFile,
	copyBase64: addon.copyBase64,
	listFiles: addon.listFiles,
}
