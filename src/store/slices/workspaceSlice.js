import { createSlice } from '@reduxjs/toolkit';

let documents = {
	"d53e22d3-b743-414d-beab-8ea40c56adef": {
		ops: [
     		{ insert: 'Gandalf ', attributes: { bold: true } },
    		{ insert: 'the ' },
     		{ insert: 'White', attributes: { color: '#aaa' } }
   		]
	},
	"156989b0-ffff-4ff1-9228-23f0f5c414d8": {
		ops: [
     		{ insert: 'Gandalf ', attributes: { bold: true } },
    		{ insert: 'the ' },
     		{ insert: 'Grey', attributes: { color: '#aaa' } }
   		]
	},
	"f5bfb84b-7f56-4028-9bac-53f3e9b5af9b": {
		ops: [
     		{ insert: 'Gandalf ', attributes: { bold: true } },
    		{ insert: 'the Dead' },
   		]
	}
}

let documentIndex = {
	projectTitle: "Test",
	documents: [
		{type: "manuscript", title: "Manuscript", permanent: true, expanded: true, children: [
			{type: "folder", isDirectory: true, title: "Test Folder", id: "339b5bc4-6869-4f6b-802d-4179d1deab71", children: [
				{type: "file", title: "File 0", id: "d53e22d3-b743-414d-beab-8ea40c56adef"},
				{type: "file", title: "File 1", id: "156989b0-ffff-4ff1-9228-23f0f5c414d8"}
			]},
			{type: "file", title: "File 2", id: "f5bfb84b-7f56-4028-9bac-53f3e9b5af9b"},
		]},
		{type: "trash", title: "Trash", permanent: true}
	],
	lastDocument: "f5bfb84b-7f56-4028-9bac-53f3e9b5af9b"
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
		createNewDocument(state, action) {
			const {id} = action.payload;
			state.docCache[id] = {};
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

export const { 
	switchDocument, 
	createNewDocument,
	queueDocumentChanges, 
	updateWorkingDoc } = workspaceSlice.actions;

export default workspaceSlice.reducer;