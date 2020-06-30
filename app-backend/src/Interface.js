const ipcInterface  = window.ipcInterface;

class Interface {
	constructor() {
		this.location = null;
		this.appLocation = null;
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
	async getAppLocation() {
		try {
			if (this.appLocation) {
				return this.appLocation;
			}
			const fetchedLocation = await ipcInterface.fetchAppLoc();
			this.appLocation = fetchedLocation;
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
	async getImport(importFileName, importFileType, importFileMime) {
		try {
			let result;
			const path = this.location + "\\Files\\Imports\\" + importFileName;
			if (importFileType !== "raw") {
				let bin = await ipcInterface.fetchBin(path);
				if (!bin.byteLength) {
					throw `File '${importFileName}' was empty or could not be read. It may be missing or corrupted.`;
				} else {
					let blobbo = new Blob([bin], {type: importFileMime});
					result = URL.createObjectURL(blobbo);
				}
			} else {
				result = await ipcInterface.fetchDoc(path);
			}
			return result;
		} catch(err) {
			throw err;
		}
	}
	async getThemeList() {
		try {
			const appLoc = await this.getAppLocation();
			const themeList = await ipcInterface.listFiles(
				appLoc + "\\Resources\\Themes"
			);
			return themeList;
		} catch(err) {
			throw err;
		}
	}
	async getTheme(themeName) {
		try {
			const appLoc = await this.getAppLocation();
			const fetchedTheme = await ipcInterface.fetchDoc(
				appLoc + "\\Resources\\Themes\\" + themeName //+ ".json"
			);
			return JSON.parse(fetchedTheme);
		} catch(err) {
			throw err;
		}
	}
	async getSettings() {
		try {
			const appLoc = await this.getAppLocation();
			const fetchedSettings = await ipcInterface.fetchDoc(
				appLoc + "\\settings.json"
			);
			return JSON.parse(fetchedSettings);
		} catch(err) {
			throw err;
		}
	}
	async saveSettings(contents) {
		try {
			const appLoc = await this.getAppLocation();
			const result = await ipcInterface.writeDoc(
				appLoc + "\\settings.json",
				contents
			);
			return result;
		} catch(err) {
			throw err;
		}
	}
	async getCompilerList() {
		try {
			const appLoc = await this.getAppLocation();
			const compilerList = await ipcInterface.listFiles(
				appLoc + "\\Resources\\Compilers"
			);
			return compilerList;
		} catch(err) {
			throw err;
		}
	}
	async runCompiler(compilerName, docList, options) {
		try {
			const appLoc = await this.getAppLocation();
			const result = await ipcInterface.runCompile(
				appLoc + "\\Resources\\Compilers\\" + compilerName,
				{docList, options}
			);
			return result;
		} catch(err) {
			throw err;
		}
	}
}

export default new Interface();