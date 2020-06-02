const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class Interface {
	constructor() {
		this.location = null;
		this.getIndex = this.getIndex.bind(this);
		this.getDocument = this.getDocument.bind(this);
		this.saveIndex = this.saveIndex.bind(this);
		this.saveDocument = this.saveDocument.bind(this);
	}
	async getLocation() {
		try {
			const fetchedLocation = await ipcRenderer.invoke("doc_api_location");
			this.location = fetchedLocation;
		} catch(err) {
			throw err;
		}
	}
	async getIndex() {
		try {
			if (!this.location) {
				await this.getLocation();
			}
			const fetchedDocumentIndex = await ipcRenderer.invoke(
				"doc_api_fetch", 
				this.location + "\\index.ftne"
			);
			return JSON.parse(fetchedDocumentIndex);
		} catch(err) {
			throw err;
		}
	}
	async getDocument(id) {
		try {
			const fetchedDocument = await ipcRenderer.invoke(
				"doc_api_fetch", 
				this.location + "\\Files\\Documents\\" + id + ".json"
			);
			return JSON.parse(fetchedDocument);
		} catch(err) {
			throw err;
		}
	} 
	async saveIndex(contents) {
		try {
			const result = await ipcRenderer.invoke(
				"doc_api_write", 
				this.location + "\\index.ftne", 
				JSON.stringify(contents)
			);
			return result;
		} catch(err) {
			throw err;
		}
	}
	async saveDocument(id, contents) {
		try {
			const result = await ipcRenderer.invoke(
				"doc_api_write", 
				this.location + "\\Files\\Documents\\" + id + ".json",
				JSON.stringify(contents)
			);
			return result;
		} catch(err) {
			throw err;
		}
	}
}

export default new Interface();