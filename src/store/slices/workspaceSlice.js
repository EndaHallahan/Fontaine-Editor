import { createSlice } from '@reduxjs/toolkit';
import { find, walk } from 'react-sortable-tree';

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
		{type: "manuscript", title: "Manuscript", permanent: true, expanded: true, id:"d12d04aa-7f82-48d6-a39d-362eade665f9", children: [
			{type: "folder", isDirectory: true, title: "Test Folder", id: "339b5bc4-6869-4f6b-802d-4179d1deab71", children: [
				{type: "file", title: "File 0", id: "d53e22d3-b743-414d-beab-8ea40c56adef"},
				{type: "file", title: "File 1", id: "156989b0-ffff-4ff1-9228-23f0f5c414d8"}
			]},
			{type: "file", title: "File 2", id: "f5bfb84b-7f56-4028-9bac-53f3e9b5af9b"},
		]},
		{type: "trash", title: "Trash", permanent: true, id:"04279288-7cdc-486c-a279-9c0f7a698a31"}
	],
	lastDocument: "f5bfb84b-7f56-4028-9bac-53f3e9b5af9b"
}

function getDocument(id) {
	const doc = documents[id];
	return doc;
}

function getFullChildContents(docList, docCache) {
	const fullContents = {}
	docList.forEach(docId => {
		let docContents;
		if (docCache[docId]) {
			docContents = docCache[docId]
		} else {
			docContents = getDocument(docId);
		}
		fullContents[docId] = docContents;
	});
	return fullContents;
}

function saveDocument(id, changes) {

}

const workspaceSlice = createSlice({
	name: "workspace",
	initialState: {
		docTree: documentIndex.documents,
		curDocId: documentIndex.lastDocument || null,
		curDocList: [],
		docCache: {},
		docChangeQueues: {}
	},
	reducers: {
		switchDocument(state, action) {
			const curDocId = action.payload.id;
			state.curDocId = curDocId;

			let newDocList = [curDocId];

			const selRow = find({
				getNodeKey: ({treeIndex}) => {return treeIndex;},
				treeData: state.docTree,
				searchMethod: (rowData) => {return(rowData.node.id === curDocId)}
			}).matches[0];

			let newWorkingDocs = {};
			if (selRow && selRow.node.children) {
				walk({
					treeData: selRow.node.children,
					getNodeKey: ({treeIndex}) => {return treeIndex;},
					callback: (row) => newDocList.push(row.node.id),
					ignoreCollapsed: false
				});
			}
			newWorkingDocs = getFullChildContents(newDocList, state.docCache);

			newDocList.forEach(id => {
				state.docCache[id] = newWorkingDocs[id];
			});

			state.curDocList = newDocList;
		},
		updateWorkingDoc(state, action) {
			const {id, newDoc} = action.payload;
			state.docCache[id] = {ops:newDoc};
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
		},
		
	}
});

export const { 
	switchDocument, 
	createNewDocument,
	queueDocumentChanges, 
	updateWorkingDoc,
 } = workspaceSlice.actions;

export default workspaceSlice.reducer;