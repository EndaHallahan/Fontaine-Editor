const { ipcRenderer, contextBridge } = require('electron');

console.log("Preloading!")

const ipcInterface = {
	fetchLoc: async () => {
		return await ipcRenderer.invoke("doc_api_location");
	},

	fetchAppLoc: async () => {
		return await ipcRenderer.invoke("doc_api_app_location");
	},

	fetchDoc: async (path) => {
		return await ipcRenderer.invoke(
			"doc_api_fetch", 
			path
		);
	},
	//This method is currently unused, but I'm keeping it in for now. Just in case.
	fetchBase64: async (path) => {
		return await ipcRenderer.invoke(
			"doc_api_fetch_b64",
			path
		);
	},

	fetchBin: async (path) => {
		return await ipcRenderer.invoke(
			"doc_api_fetch_bin",
			path
		);
	},

	writeDoc: async (path, contents) => {
		return await ipcRenderer.invoke(
			"doc_api_write", 
			path, 
			JSON.stringify(contents)
		);
	},

	importFile: async () => {
		return await ipcRenderer.invoke(
			"doc_api_import"
		);
	},

	listFiles: async (path) => {
		return await ipcRenderer.invoke(
			"doc_api_list_files",
			path
		);
	},

	runPlugin: async (path, args) => {
		return await ipcRenderer.invoke(
			"plugin_api_run",
			path,
			args
		);
	},
}

contextBridge.exposeInMainWorld('ipcInterface', ipcInterface);

//window.ipcInterface = ipcInterface;