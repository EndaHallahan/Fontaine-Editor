import { createSlice } from '@reduxjs/toolkit';

let documents = {
	0: {
		ops: [
     		{ insert: 'Gandalf ', attributes: { bold: true } },
    		{ insert: 'the ' },
     		{ insert: 'White', attributes: { color: '#aaa' } }
   		]
	},
	1: {
		ops: [
     		{ insert: 'Gandalf ', attributes: { bold: true } },
    		{ insert: 'the ' },
     		{ insert: 'Grey', attributes: { color: '#aaa' } }
   		]
	},
	2: {
		ops: [
     		{ insert: 'Gandalf ', attributes: { bold: true } },
    		{ insert: 'the Dead' },
   		]
	}
}

let documentIndex = {
	projectTitle: "Test",
	documents: [
		{type: "folder", isDirectory: true, title: "Test Folder", children: [
			{type: "file", title: "File 0", id: 0, children: []},
			{type: "file", title: "File 1", id: 1}
		]},
		{type: "file", title: "File 2", id: 2}
	],
	lastDocument: 2
}

function getDocument(id) {
	return documents[id];
}

function saveDocument(id, changes) {

}

const workspaceSlice = createSlice({
	name: "workspace",
	initialState: {
		docTree: documentIndex.documents,
		curDocId: documentIndex.lastDocument || null,
		workingDoc: null,
		docCache: {},
		docChangeQueues: {}
	},
	reducers: {
		switchDocument(state, action) {
			state.docCache[state.curDocId] = state.workingDoc;
			const curDocId = action.payload.id;
			state.curDocId = curDocId;
			let doc;
			if (state.docCache[curDocId]) {
				doc = state.docCache[curDocId]
			} else {
				doc =  getDocument(curDocId);
			}
			state.docCache[curDocId] = doc;
			state.workingDoc = doc;
		},
		updateWorkingDoc(state, action) {
			const {newDoc} = action.payload;
			state.workingDoc = newDoc;
		},
		queueDocumentChanges(state, action) {
			const {docId, changes} = action.payload;
			if (!state.docChangeQueues[docId]) {
				state.docChangeQueues[docId] = changes;
			} else {
				state.docChangeQueues[docId] = state.docChangeQueues[docId].concat(changes);
			}
		}
		
	}
});

export const { switchDocument, queueDocumentChanges, updateWorkingDoc } = workspaceSlice.actions;

export default workspaceSlice.reducer;