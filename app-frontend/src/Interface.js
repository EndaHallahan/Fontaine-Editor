import { documents, documentIndex, themes, themeIndex } from "./testDocs";

const Interface = {
	getIndex: async () => {
		return documentIndex;
	},
	getDocument: async (id) => {
		const doc = documents[id];
		return doc;
	},
	getThemeList: async () => {
		return themeIndex;
	},
	getTheme: async (themeName) => {
		return themes[themeName];
	},
}

export default Interface;