import { documents, documentIndex } from "./testDocs";

const Interface = {
	getIndex: async () => {
		return documentIndex;
	},
	getDocument: async (id) => {
		const doc = documents[id];
		return doc;
	},
}

export default Interface;