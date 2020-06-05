import { createSlice } from '@reduxjs/toolkit';
import { find, walk } from 'react-sortable-tree';

import { documents, documentIndex } from "../../testDocs"; //Remove me eventually!

import Interface from "../../Interface"; //Probably also remove this

import { setMessage, setStatus } from "./statusSlice";

async function getFullChildContents(docList, docCache, getDoc) {
	const fullContents = {}
	for (const docId of docList) {
		let docContents;
		if (docCache[docId]) {
			docContents = docCache[docId]
		} else {
			docContents = await getDoc(docId);
		}
		fullContents[docId] = docContents;
	}
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

async function getListRowFor(docId, docList, docRow, docTree, docCache, getDoc) {
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
	newWorkingDocs = await getFullChildContents(newDocList, docCache, getDoc);
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

function regenIndex(docIndex, documents, projectTags, threads, lastDocument) {
	let newIndex = {
		...docIndex,
		documents,
		projectTags,
		threads,
		lastDocument
	};
	return newIndex;
}

async function loadInitialState(docIndex, getDoc) {
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
		] = await getListRowFor(
			curDocId, 
			curDocList, 
			curDocRow, 
			docTree, 
			docCache,
			getDoc
		);
		inspectedDocRow = curDocRow;
	}
	if (splitDocId !== null) {
		[
			splitDocList,
			splitDocRow,
			docCache
		] = await getListRowFor(
			splitDocId, 
			splitDocList, 
			splitDocRow, 
			docTree, 
			docCache,
			getDoc
		);
	} else {
		splitDocId = curDocId;
		splitDocList = curDocList;
		splitDocRow = curDocRow;
	}
	return {
		docIndex,
		docTree,
		docCache,
		inspectedDocRow,
		changedFiles: {},
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
		loaded: true
	};
}

const initialState = {
	loaded: false,
	docIndex: {},
	docTree: {},
	curDocId: null,
	splitDocId: null,
	docCache: {},
	curDocList: [],
	curDocRow: {},
	splitDocList: [],
	splitDocRow: {},
	inspectedDocRow: {},
	projectTags: [],
	metadataFields: [],
	threads: [],
	changedFiles: {},
	autoSaving: true,
}

const workspaceSlice = createSlice({
	name: "workspace",
	initialState,
	reducers: {
		setAllState(state, action) {
			const {newState} = action.payload;
			state.curDocId = newState.curDocId;
			state.docTree = newState.docTree;
			state.splitDocId = newState.splitDocId;
			state.docCache = newState.docCache;
			state.curDocList = newState.curDocList;
			state.curDocRow = newState.curDocRow;
			state.splitDocList = newState.splitDocList;
			state.splitDocRow = newState.splitDocRow;
			state.inspectedDocRow = newState.inspectedDocRow;
			state.projectTags = newState.projectTags;
			state.metadataFields = newState.metadataFields;
			state.threads = newState.threads;
			state.loaded = newState.loaded;
		},
		switchDocumentComplete(state, action) {
			const {curDocList, curDocRow, docCache, curDocId} = action.payload;
			state.curDocList = curDocList;
			state.curDocRow = curDocRow;
			state.docCache = docCache;
			state.curDocId = curDocId;
			state.inspectedDocRow = curDocRow;
		},
		switchSplitDocumentComplete(state, action) {
			const {curDocList, curDocRow, docCache, curDocId} = action.payload;
			state.splitDocList = curDocList;
			state.splitDocRow = curDocRow;
			state.docCache = docCache;
			state.splitDocId = curDocId;
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
			state.changedFiles[id] = {lastModified: Date.now(), locked: false};
		},
		createNewDocument(state, action) {
			const {id} = action.payload;
			state.docCache[id] = {};
			state.curDocRow = getDocRow(state.docTree, state.curDocId);
			state.changedFiles[id] = {lastModified: Date.now(), locked: false};
		},
		updateDocTreeComplete(state, action) {
			const {treeData, curDocList, curDocRow, docCache, splitDocRow, splitDocList} = action.payload;
			state.docTree = treeData;
			state.docCache = docCache;
			state.curDocList = curDocList;
			state.curDocRow = curDocRow;
			if (splitDocList) {
				state.splitDocList = splitDocList;
				state.splitDocRow = splitDocRow;
			}
			const inspRow = find({
				getNodeKey: ({treeIndex}) => {return treeIndex;},
				treeData: state.docTree,
				searchMethod: (rowData) => {return(rowData.node.id === state.inspectedDocRow.node.id)}
			}).matches[0];
			state.inspectedDocRow = inspRow;
			state.changedFiles.index = {lastModified: Date.now(), locked: false};
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
			state.changedFiles.index = {lastModified: Date.now(), locked: false};
		},
		updateProjectThreads(state, action) {
			const {threads} = action.payload;
			state.threads = threads;
			state.changedFiles.index = {lastModified: Date.now(), locked: false};
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
			state.changedFiles.index = {lastModified: Date.now(), locked: false};
		},
		updateChangedFiles(state, action) {
			const {changedFiles} = action.payload;
			state.changedFiles = changedFiles;
		},
		removeChangedFile(state, action) {
			const {key} = action.payload;
			delete state.changedFiles[key];
		},
		lockChangedFile(state, action) {
			const {key} = action.payload;
			if (state.changedFiles.key !== undefined) {
				state.changedFiles = {
					...state.changedFiles, 
					[key]: {...state.changedFiles[key], locked: true}
				};
			}
			
		},
		unlockChangedFile(state, action) {
			const {key} = action.payload;
			state.changedFiles = {
				...state.changedFiles, 
				[key]: {...state.changedFiles[key], locked: false}
			};
		},
	}
});

export const { 
	setAllState,
	switchDocumentComplete,
	switchSplitDocumentComplete, 
	inspectDocument,
	createNewDocument,
	queueDocumentChanges, 
	updateWorkingDoc,
	updateDocTreeComplete,
	addProjectTag,
	updateProjectThreads,
	addProjectThread,
	updateChangedFiles,
	removeChangedFile,
	lockChangedFile,
	unlockChangedFile,
 } = workspaceSlice.actions;

export default workspaceSlice.reducer;

/* Thunks */

export const loadState = (interfaceObj) => async (dispatch, getState) => {
	try {
		const index = await interfaceObj.getIndex();
		const newState = await loadInitialState(index, interfaceObj.getDocument);
		dispatch(setAllState({newState}));
		dispatch(setStatus({status: "okay"}));
	} catch (err) {
		console.error(err);
		dispatch(setMessage({message: "An error occurred: " + err}));
		dispatch(setStatus({status: "error"}));
	}
}

export const updateDocTree = (treeData, interfaceObj) => async (dispatch, getState) => {
	try {
		const state = getState().workspaceReducer;
		let [
			curDocList,
			curDocRow,
			docCache
		] = await getListRowFor(
			state.curDocId, 
			state.curDocList, 
			state.curDocRow, 
			treeData,
			state.docCache,
			interfaceObj.getDocument
		);

		let splitDocList;
		let splitDocRow;
		if (state.splitDocId) {
			[
				splitDocList,
				splitDocRow,
				docCache
			] = await getListRowFor(
				state.splitDocId, 
				state.splitDocList, 
				state.splitDocRow, 
				treeData,
				docCache,
				interfaceObj.getDocument
			);
		}

		dispatch(updateDocTreeComplete({
			treeData,
			curDocList,
			curDocRow,
			docCache,
			splitDocList,
			splitDocRow,
		}))
	} catch (err) {
		console.error(err)
	}
}

export const switchDocument = (id, interfaceObj) => async (dispatch, getState) => {
	try {
		const state = getState().workspaceReducer;
		const curDocId = id;
		let [
			curDocList,
			curDocRow,
			docCache
		] = await getListRowFor(
			curDocId, 
			state.curDocList, 
			state.curDocRow, 
			state.docTree, 
			state.docCache,
			interfaceObj.getDocument
		);
		dispatch(switchDocumentComplete({
			curDocId,
			curDocList,
			curDocRow,
			docCache,
		}))
	} catch (err) {
		console.error(err)
	}
}

export const switchSplitDocument = (id, interfaceObj) => async (dispatch, getState) => {
	try {
		const state = getState().workspaceReducer;
		const curDocId = id;
		let [
			curDocList,
			curDocRow,
			docCache
		] = await getListRowFor(
			curDocId, 
			state.splitDocList, 
			state.splitDocRow, 
			state.docTree, 
			state.docCache,
			interfaceObj.getDocument
		);
		dispatch(switchSplitDocumentComplete({
			curDocId,
			curDocList,
			curDocRow,
			docCache,
		}))
	} catch (err) {
		console.error(err)
	}
}

export const saveAllChanges = (interfaceObj) => async (dispatch, getState) => {
	try {
		const state = getState().workspaceReducer;
		const docCache = state.docCache;
		const docIndex = state.docIndex;
		const docTree = state.docTree;
		let changedFiles = Object.assign({}, state.changedFiles);
		let changedFilesList = Object.keys(state.changedFiles);
		let totalTasks = changedFilesList.length;
		let completeTasks = 0;
		const saveFileTask = async (key) => {
			try {
				let err = "";
				if (changedFiles[key].locked) {
					return;
				}
				if (key === "index") {
					let newIndex = regenIndex(
						state.docIndex, 
						state.docTree, 
						state.projectTags, 
						state.threads, 
						state.curDocId
					);
					err = await interfaceObj.saveIndex(newIndex);
				} else {
					err = await interfaceObj.saveDocument(key, docCache[key]);
				}
				if (!err) {
					delete changedFiles[key];
				} else {
					throw "Failed to save document " + key + ": " + err;
				}
				completeTasks++;
				dispatch(setMessage({message: `Saved ${completeTasks}/${totalTasks}`}));
			} catch(err) {
				throw err;
			}
		}
		const waitForTasks = (tries) => {
			if (completeTasks !== totalTasks) {
				console.log("Waiting...")
				if (tries > 15) {
					throw "Tasks did not complete within limit!";
				}
				tries++;
				setTimeout(() => waitForTasks(tries + 1), 500);
			} else {
				tasksComplete();
			}
		}
		const tasksComplete = () => {
			dispatch(setMessage({message: "Save complete!"}));
			dispatch(setStatus({status: "okay"}));
			dispatch(updateChangedFiles({changedFiles}));
		}
		dispatch(setMessage({message: "Saving..."}));
		dispatch(setStatus({status: "loading"}));
		for (const key of changedFilesList) {
			saveFileTask(key);
		}
		waitForTasks(0);
		
	} catch (err) {
		console.error(err);
		dispatch(setMessage({message: "An error occurred: " + err}));
		dispatch(setStatus({status: "error"}));
	}
}

export const saveSingleDocument = (key, interfaceObj) => async (dispatch, getState) => {
	try {
		const state = getState().workspaceReducer;
		const docCache = state.docCache;
		const docIndex = state.docIndex;
		const docTree = state.docTree;
		let changedFiles = Object.assign({}, state.changedFiles);
		let err = "";
		dispatch(setMessage({message: "Autosaving..."}));
		dispatch(setStatus({status: "loading"}));
		if (key === "index") {
			let newIndex = regenIndex(
				state.docIndex, 
				state.docTree, 
				state.projectTags, 
				state.threads, 
				state.curDocId
			);
			err = await interfaceObj.saveIndex(newIndex);
		} else {
			err = await interfaceObj.saveDocument(key, docCache[key]);
		}
		if (!err) {
			dispatch(removeChangedFile({key}));
			dispatch(setMessage({message: "Autosave complete!"}));
			dispatch(setStatus({status: "okay"}));
		} else {
			dispatch(unlockChangedFile({key}));
			throw "Failed to save document " + key + ": " + err;
		}	
	} catch (err) {
		console.error(err);
		dispatch(setMessage({message: "An error occurred: " + err}));
		dispatch(setStatus({status: "error"}));
	}
}