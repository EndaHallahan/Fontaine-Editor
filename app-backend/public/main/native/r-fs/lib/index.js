var addon = require('../native');

module.exports = {
	getFile: addon.getFile,
	writeFile: addon.writeFile,
	copyFile: addon.copyFile,
	copyBase64: addon.copyBase64,
}
