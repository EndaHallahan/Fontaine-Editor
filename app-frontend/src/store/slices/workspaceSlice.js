import { createSlice } from '@reduxjs/toolkit';
import { find, walk } from 'react-sortable-tree';

import { documents, documentIndex } from "../../testDocs"; //Remove me eventually!

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

function createInitialState(docIndex) {
	let docTree = docIndex.documents;
	let curDocId = docIndex.lastDocument || null;
	let docCache = {};
	let curDocList = [];
	if (curDocId !== null) {
		let newDocList = [curDocId];

		const selRow = find({
			getNodeKey: ({treeIndex}) => {return treeIndex;},
			treeData: docTree,
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
		newWorkingDocs = getFullChildContents(newDocList, docCache);

		newDocList.forEach(id => {
			docCache[id] = newWorkingDocs[id];
		});

		curDocList = newDocList;
	}

	return {
		docTree,
		curDocId,
		curDocList,
		docCache,
		docChangeQueues: {}
	};
}

const workspaceSlice = createSlice({
	name: "workspace",
	initialState: createInitialState(documentIndex),
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
			/*if (!state.docChangeQueues[docId]) {
				state.docChangeQueues[docId] = changes;
			} else {
				state.docChangeQueues[docId] = state.docChangeQueues[docId].concat(changes);
			}*/
		},
		updateDocTree(state, action) {
			const {tree} = action.payload;
			state.docTree = tree;
		}
	}
});

export const { 
	switchDocument, 
	createNewDocument,
	queueDocumentChanges, 
	updateWorkingDoc,
	updateDocTree,
 } = workspaceSlice.actions;

export default workspaceSlice.reducer;