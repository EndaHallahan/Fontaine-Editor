import { createSlice } from '@reduxjs/toolkit';
import { find, walk, addNodeUnderParent } from 'react-sortable-tree';
import { v4 as uuidv4 } from "uuid";

import { sendMessage } from "./statusSlice";
import Helpers from "../../utils/editor/Helpers";

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

function newNodeUnderTarget(node, destination, treeData) {
	treeData = addNodeUnderParent({
		treeData,
		newNode: node,
		parentKey: destination.path[destination.path.length - 1],
		getNodeKey: ({treeIndex}) => {return treeIndex;},
		ignoreCollapsed: true,
		expandParent: true,
	}).treeData;
	return treeData;
}

function extToMime(ext) {
	switch(ext) {
		case "pdf":
			return {mimeType: "application/pdf", importType: "pdf"};
		case "png":
		case "jpg":
		case "jpeg":
		case "jfif":
		case "pjpeg":
		case "pjp":
		case "svg":
		case "tif":
		case "tiff":
		case "webp":
		case "gif":
		case "bmp":
		case "apng":
		case "ico":
		case "cur":
			return {mimeType: "image/" + ext, importType: "image"};
		case "mp4":
		case "webm":
		case "ogg":
			return {mimeType:"video/" + ext, importType: "video"};
		case "mp3":
			return {mimeType:"audio/mpeg", importType: "audio"};
		case "wav":
			return {mimeType:"audio/" + ext, importType: "audio"};
		default:
			return {importType: "raw"};
	}
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

function regenIndex(state) {
	let newIndex = {
		...state.docIndex,
		documents: state.docTree,
		projectTags: state.projectTags,
		threads: state.threads,
		wordcounts: state.wordcounts,
		manuscriptGoal: state.manuscriptGoal,
		sessionGoal: state.sessionGoal,
		lastDocument: state.curDocId,
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
	let wordcounts = docIndex.wordcounts || {};
	let manuscriptGoal = docIndex.manuscriptGoal || 0;
	let sessionGoal = {};
	if (docIndex.sessionGoal) {
		sessionGoal = {
			start: docIndex.sessionGoal.start || Object.values(wordcounts).reduce((a, b) => a + b, 0) || 0,
			goal: docIndex.sessionGoal.goal || 0,
		}
	} else {
		sessionGoal = {
			start: 0,
			goal: 0,
		}
	}
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
		wordcounts,
		manuscriptGoal,
		sessionGoal,
		loaded: true
	};
}

const initialState = {
	loaded: false,
	docIndex: {},
	docTree: [],
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
	wordcounts: {},
	changedFiles: {},
	manuscriptGoal: 0,
	sessionGoal: {},
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
			state.wordcounts = newState.wordcounts;
			state.manuscriptGoal = newState.manuscriptGoal;
			state.sessionGoal = newState.sessionGoal;
			state.loaded = newState.loaded;
		},
		switchDocumentComplete(state, action) {
			const {curDocList, curDocRow, docCache, curDocId} = action.payload;
			state.curDocList = curDocList;
			state.curDocRow = curDocRow;
			state.docCache = docCache;
			state.curDocId = curDocId;
			state.inspectedDocRow = curDocRow;
			state.changedFiles.index = {lastModified: Date.now(), locked: false};
		},
		switchSplitDocumentComplete(state, action) {
			const {curDocList, curDocRow, docCache, curDocId} = action.payload;
			state.splitDocList = curDocList;
			state.splitDocRow = curDocRow;
			state.docCache = docCache;
			state.splitDocId = curDocId;
			state.changedFiles.index = {lastModified: Date.now(), locked: false};
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
			//state.changedFiles[id] = {lastModified: Date.now(), locked: false};
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
		setWordcount(state, action) {
			const {id, wordcount} = action.payload;
			state.wordcounts[id] = wordcount;
			state.changedFiles.index = {lastModified: Date.now(), locked: false};
		},
		setManuscriptGoal(state, action) {
			const {wordcount} = action.payload;
			state.manuscriptGoal = wordcount;
			state.changedFiles.index = {lastModified: Date.now(), locked: false};
		},
		setSessionGoal(state, action) {
			const {wordcount} = action.payload;
			state.sessionGoal.goal = wordcount;
			state.changedFiles.index = {lastModified: Date.now(), locked: false};
		},
		resetSessionGoal(state, action) {
			const {totalcount} = action.payload;
			state.sessionGoal.start = totalcount;
			state.changedFiles.index = {lastModified: Date.now(), locked: false};
		},
	}
});

export const { 
	setAllState,
	switchDocumentComplete,
	switchSplitDocumentComplete, 
	inspectDocument,
	createNewDocument,
	updateWorkingDoc,
	updateDocTreeComplete,
	addProjectTag,
	updateProjectThreads,
	addProjectThread,
	updateChangedFiles,
	removeChangedFile,
	lockChangedFile,
	unlockChangedFile,
	setWordcount,
	setManuscriptGoal,
	setSessionGoal,
	resetSessionGoal,
 } = workspaceSlice.actions;

export default workspaceSlice.reducer;

/* Thunks */

export const loadState = (interfaceObj) => async (dispatch, getState) => {
	try {
		const index = await interfaceObj.getIndex();
		const newState = await loadInitialState(index, interfaceObj.getDocument);
		dispatch(setAllState({newState}));
		dispatch(sendMessage({message: null, status: "okay"}));
	} catch (err) {
		console.error(err);
		dispatch(sendMessage({message: "An error occurred: " + err, status: "error"}));
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
					let newIndex = regenIndex(state);
					err = await interfaceObj.saveIndex(newIndex);
				} else {
					err = await interfaceObj.saveDocument(key, docCache[key]);
				}
				if (!err) {
					delete changedFiles[key];
				} else {
					throw new Error("Failed to save document " + key + ": " + err);
				}
				completeTasks++;
				dispatch(sendMessage({message: `Saved ${completeTasks}/${totalTasks}`, status: "loading"}));
			} catch(err) {
				throw err;
			}
		}
		const waitForTasks = (tries) => {
			if (completeTasks !== totalTasks) {
				console.log("Waiting...")
				if (tries > 15) {
					throw new Error("Tasks did not complete within limit!");
				}
				tries++;
				setTimeout(() => waitForTasks(tries + 1), 500);
			} else {
				tasksComplete();
			}
		}
		const tasksComplete = () => {
			dispatch(sendMessage({message: "Save complete!", status: "okay"}));
			dispatch(updateChangedFiles({changedFiles}));
		}
		dispatch(sendMessage({message: "Saving...", staus: "loading"}));
		for (const key of changedFilesList) {
			saveFileTask(key);
		}
		waitForTasks(0);
		
	} catch (err) {
		console.error(err);
		dispatch(sendMessage({message: "An error occurred: " + err.message, status: "error"}));
	}
}

export const saveSingleDocument = (key, interfaceObj) => async (dispatch, getState) => {
	try {
		const state = getState().workspaceReducer;
		const docCache = state.docCache;
		let err = "";
		dispatch(sendMessage({message: "Autosaving...", status: "loading"}));
		if (key === "index") {
			let newIndex = regenIndex(state);
			err = await interfaceObj.saveIndex(newIndex);
		} else {
			err = await interfaceObj.saveDocument(key, docCache[key]);
		}
		if (!err) {
			dispatch(removeChangedFile({key}));
			dispatch(sendMessage({message: "Autosave complete!", status: "okay"}));
		} else {
			dispatch(unlockChangedFile({key}));
			throw new Error("Failed to save document " + key + ": " + err);
		}	
	} catch (err) {
		console.error(err);
		dispatch(sendMessage({message: "An error occurred: " + err.message, status: "error"}));
	}
}

export const importFiles = (interfaceObj) => async (dispatch, getState) => {
	try {
		console.log("Importing!")
		const state = getState().workspaceReducer;
		let docTree = [...state.docTree];
		const result = await interfaceObj.importFile();
		console.log("result", result);
		if (!result.ok) {
			throw new Error(result.error);
		}
		let fileNames = result.fileNames;
		const fileboxNode = find({
			getNodeKey: ({treeIndex}) => {return treeIndex;},
			treeData: docTree,
			searchMethod: (rowData) => {return(rowData.node.type === "filebox")},
		}).matches[0];
		for (let fileName of fileNames) {
			dispatch(sendMessage({message: `Importing file ${fileName}...`, status: "loading"}));
			const [name, ext] = fileName.split(".");
			const newNode = {type: "import", title: name, fileName, id: uuidv4(), ...extToMime(ext)}
			console.log("newNode", newNode)
			docTree = newNodeUnderTarget(newNode, fileboxNode, docTree);
		}
		dispatch(updateDocTree(docTree, interfaceObj));
		dispatch(sendMessage({message: "Import complete!", status: "okay"}));
	} catch (err) {
		console.error(err);
		dispatch(sendMessage({message: "An error occurred: " + err.message, status: "error"}));
	}
}

export const updateWordcount = (id, newDoc) => async (dispatch, getState) => {
	const countWords = async (doc) => {
		return doc.match(/(?:(?:\w-\w)|[\wÀ-ÿ'’])+/g).length;
	}
	try {
		let pt = await Helpers.toPlainText(newDoc);
		let wordcount = await countWords(pt);
		dispatch(setWordcount({id, wordcount}));
	} catch (err) {
		console.error(err);
		dispatch(sendMessage({message: "An error occurred: " + err.message, status: "error"}));
	}
}