const { ipcRenderer, contextBridge } = require('electron');

console.log("Preloading!")

const ipcInterface = {
	fetchLoc: async () => {
		return await ipcRenderer.invoke("doc_api_location");
	},

	fetchDoc: async (path) => {
		return await ipcRenderer.invoke(
			"doc_api_fetch", 
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
}

contextBridge.exposeInMainWorld('ipcInterface', ipcInterface);

//window.ipcInterface = ipcInterface;