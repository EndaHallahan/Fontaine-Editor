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

function getListRowFor(docId, docList, docRow, docTree, docCache) {
	let outList = [];
	let outRow = {};
	let outCache = {...docCache};
	let newDocList = [docId];
	const selRow = find({
		getNodeKey: ({treeIndex}) => {return treeIndex;},
		treeData: docTree,
		searchMethod: (rowData) => {return(rowData.node.id === docId)}
	}).matches[0];
	outRow = selRow;
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
		outCache[id] = newWorkingDocs[id];
	});
	outList = newDocList;

	return [outList, outRow, outCache];
}

function saveDocument(id, changes) {

}

function getMetadataFields(tagList) {
	let fields = [];
	for (let tag of tagList) {
		let splitTag = tag.split(":");
		if (splitTag.length < 2) {
			break;
		} else {
			if (!fields.includes(splitTag[0])) {
				fields.push(splitTag[0]);
			}
		}
	}
	return fields;
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
	let projectTags = docIndex.projectTags.sort((a, b) => {
		let aScore = a.includes(":") ? -1 : 1;
		let bScore = b.includes(":") ? 1 : -1;
		let alph = a > b ? 1 : -1;
		return (alph + aScore + bScore);
	});
	let metadataFields = getMetadataFields(projectTags);
	let threads = docIndex.threads || {};
	if (curDocId !== null) {
		[
			curDocList,
			curDocRow,
			docCache
		] = getListRowFor(
			curDocId, 
			curDocList, 
			curDocRow, 
			docTree, 
			docCache
		);
		inspectedDocRow = curDocRow;
	}
	if (splitDocId !== null) {
		[
			splitDocList,
			splitDocRow,
			docCache
		] = getListRowFor(
			splitDocId, 
			splitDocList, 
			splitDocRow, 
			docTree, 
			docCache
		);
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
		projectTags,
		metadataFields,
		threads,
	};
}

const workspaceSlice = createSlice({
	name: "workspace",
	initialState: createInitialState(documentIndex),
	reducers: {
		switchDocument(state, action) {
			const curDocId = action.payload.id;
			state.curDocId = curDocId;
			[
				state.curDocList,
				state.curDocRow,
				state.docCache
			] = getListRowFor(
				state.curDocId, 
				state.curDocList, 
				state.curDocRow, 
				state.docTree, 
				state.docCache
			);
			state.inspectedDocRow = state.curDocRow;
		},
		switchSplitDocument(state, action) {
			const splitDocId = action.payload.id;
			state.splitDocId = splitDocId;
			[
				state.splitDocList,
				state.splitDocRow,
				state.docCache
			] = getListRowFor(
				state.splitDocId, 
				state.splitDocList, 
				state.splitDocRow, 
				state.docTree, 
				state.docCache
			);
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
			[
				state.curDocList,
				state.curDocRow,
				state.docCache
			] = getListRowFor(
				state.curDocId, 
				state.curDocList, 
				state.curDocRow, 
				state.docTree, 
				state.docCache
			);
			if (state.splitDocId) {
				[
					state.splitDocList,
					state.splitDocRow,
					state.docCache
				] = getListRowFor(
					state.splitDocId, 
					state.splitDocList, 
					state.splitDocRow, 
					state.docTree, 
					state.docCache
				);
			}
			const inspRow = find({
				getNodeKey: ({treeIndex}) => {return treeIndex;},
				treeData: state.docTree,
				searchMethod: (rowData) => {return(rowData.node.id === state.inspectedDocRow.node.id)}
			}).matches[0];
			state.inspectedDocRow = inspRow;
		},
		addProjectTag(state, action) {
			const {tag} = action.payload;
			state.projectTags = [...state.projectTags, tag].sort((a, b) => {
				let aScore = a.includes(":") ? -1 : 1;
				let bScore = b.includes(":") ? 1 : -1;
				let alph = a > b ? 1 : -1;
				return (alph + aScore + bScore);
			});
			if (tag.includes(":")) {
				state.metadataFields = getMetadataFields(state.projectTags);
			}
		},
		updateProjectThreads(state, action) {
			const {threads} = action.payload;
			state.threads = threads;
		},
		addProjectThread(state, action) {
			const {id} = action.payload;
			state.threads = {
				...state.threads,
				[id]: {
					name: "New Thread",
					colour: "#ff0000"
				}
			}
		},
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
	addProjectTag,
	updateProjectThreads,
	addProjectThread,
 } = workspaceSlice.actions;

export default workspaceSlice.reducer;