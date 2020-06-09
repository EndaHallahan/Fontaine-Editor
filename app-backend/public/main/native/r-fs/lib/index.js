var addon = require('../native');

module.exports = {
	getFile: addon.getFile,
	getAsBase64: addon.getAsBase64,
	writeFile: addon.writeFile,
	copyFile: addon.copyFile,
	copyBase64: addon.copyBase64,
}
