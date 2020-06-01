const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class Interface {
	constructor() {
		this.location = null;
		this.getIndex = this.getIndex.bind(this);
		this.getDocument = this.getDocument.bind(this);
	}
	async getLocation() {
		const fetchedLocation = await ipcRenderer.invoke("doc_api_location");
		this.location = fetchedLocation;
	}
	async getIndex() {
		if (!this.location) {
			await this.getLocation();
		}
		const fetchedDocumentIndex = await ipcRenderer.invoke("doc_api_fetch", this.location + "\\index.ftne");
		return JSON.parse(fetchedDocumentIndex);
	}
	async getDocument(id) {
		const fetchedDocument = await ipcRenderer.invoke("doc_api_fetch", this.location + "\\Files\\Documents\\" + id + ".json");
		return JSON.parse(fetchedDocument);
	}
}

export default new Interface();