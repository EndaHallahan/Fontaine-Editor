const ipcInterface  = window.ipcInterface;

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
			const fetchedLocation = await ipcInterface.fetchLoc();
			this.location = fetchedLocation;
			return fetchedLocation;
		} catch(err) {
			throw err;
		}
	}
	async getIndex() {
		try {
			if (!this.location) {
				await this.getLocation();
			}
			const fetchedDocumentIndex = await ipcInterface.fetchDoc(
				this.location + "\\index.ftne"
			);
			return JSON.parse(fetchedDocumentIndex);
		} catch(err) {
			throw err;
		}
	}
	async getDocument(id) {
		try {
			const fetchedDocument = await ipcInterface.fetchDoc(
				this.location + "\\Files\\Documents\\" + id + ".json"
			);
			return JSON.parse(fetchedDocument);
		} catch(err) {
			throw err;
		}
	} 
	async saveIndex(contents) {
		try {
			const result = await ipcInterface.writeDoc(
				this.location + "\\index.ftne",
				contents
			);
			return result;
		} catch(err) {
			throw err;
		}
	}
	async saveDocument(id, contents) {
		try {
			const result = await ipcInterface.writeDoc(
				this.location + "\\Files\\Documents\\" + id + ".json",
				contents
			);
			return result;
		} catch(err) {
			throw err;
		}
	}
	async importFile() {
		try {
			const result = await ipcInterface.importFile();
			return result;
		} catch(err) {
			throw err;
		}
	}
	getImportUrl(importFileName) {
		let url = ("file:///" + this.location + "\\Files\\FileBox\\" + importFileName).replace(/\\/g, "/");
		console.log(url)
		return url;
	}
}

export default new Interface();