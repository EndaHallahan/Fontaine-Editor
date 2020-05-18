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

function getDocRow(docTree, curDocId) {
	const selRow = find({
		getNodeKey: ({treeIndex}) => {return treeIndex;},
		treeData: docTree,
		searchMethod: (rowData) => {return(rowData.node.id === curDocId)}
	}).matches[0];
	return selRow;
}

function saveDocument(id, changes) {

}

function createInitialState(docIndex) {
	let docTree = docIndex.documents;
	let curDocId = docIndex.lastDocument || null;
	let splitDocId = docIndex.lastSplitDocument || null;
	let docCache = {};
	let curDocList = [];
	let curDocRow = {};
	let splitDocList = [];
	let splitDocRow = {};
	let inspectedDocRow = {};
	if (curDocId !== null) {
		let newDocList = [curDocId];

		const selRow = find({
			getNodeKey: ({treeIndex}) => {return treeIndex;},
			treeData: docTree,
			searchMethod: (rowData) => {return(rowData.node.id === curDocId)}
		}).matches[0];

		curDocRow = selRow;
		inspectedDocRow = selRow;

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
	if (splitDocId !== null) {
		let newDocList = [splitDocId];

		const selRow = find({
			getNodeKey: ({treeIndex}) => {return treeIndex;},
			treeData: docTree,
			searchMethod: (rowData) => {return(rowData.node.id === splitDocId)}
		}).matches[0];

		splitDocRow = selRow;

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

		splitDocList = newDocList;
	} else {
		splitDocId = curDocId;
		splitDocList = curDocList;
		splitDocRow = curDocRow;
	}

	return {
		docTree,
		docCache,
		inspectedDocRow,
		docChangeQueues: {},
		//Main editor
		curDocId,
		curDocRow,
		curDocList,
		//Split Editor
		splitDocId,
		splitDocRow,
		splitDocList,
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
			state.curDocRow = selRow;
			state.inspectedDocRow = selRow;
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
		switchSplitDocument(state, action) {
			const splitDocId = action.payload.id;
			state.splitDocId = splitDocId;
			let newDocList = [splitDocId];
			const selRow = find({
				getNodeKey: ({treeIndex}) => {return treeIndex;},
				treeData: state.docTree,
				searchMethod: (rowData) => {return(rowData.node.id === splitDocId)}
			}).matches[0];
			state.splitDocRow = selRow;
			//state.inspectedDocRow = selRow;
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
			state.splitDocList = newDocList;
		},
		inspectDocument(state, action) {
			const inspDocId = action.payload.id;
			const selRow = find({
				getNodeKey: ({treeIndex}) => {return treeIndex;},
				treeData: state.docTree,
				searchMethod: (rowData) => {return(rowData.node.id === inspDocId)},
				ignoreCollapsed: false
			}).matches[0];
			state.inspectedDocRow = selRow;
		},
		updateWorkingDoc(state, action) {
			const {id, newDoc} = action.payload;
			state.docCache[id] = {ops:newDoc};
		},
		createNewDocument(state, action) {
			const {id} = action.payload;
			state.docCache[id] = {};
			state.curDocRow = getDocRow(state.docTree, state.curDocId);
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
			let newDocList = [state.curDocId];
			const selRow = find({
				getNodeKey: ({treeIndex}) => {return treeIndex;},
				treeData: state.docTree,
				searchMethod: (rowData) => {return(rowData.node.id === state.curDocId)}
			}).matches[0];
			state.curDocRow = selRow;
			const inspRow = find({
				getNodeKey: ({treeIndex}) => {return treeIndex;},
				treeData: state.docTree,
				searchMethod: (rowData) => {return(rowData.node.id === state.inspectedDocRow.node.id)}
			}).matches[0];
			state.inspectedDocRow = inspRow;
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
		}
	}
});

export const { 
	switchDocument,
	switchSplitDocument, 
	inspectDocument,
	createNewDocument,
	queueDocumentChanges, 
	updateWorkingDoc,
	updateDocTree,
 } = workspaceSlice.actions;

export default workspaceSlice.reducer;