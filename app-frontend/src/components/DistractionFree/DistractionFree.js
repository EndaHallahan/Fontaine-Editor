import React, { Component } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Fullscreen from "react-full-screen";

import { 
	queueDocumentChanges,
	updateWorkingDoc,
	inspectDocument,
	switchDocument, 
	createNewDocument, 
	updateDocTree 
} from "../../store/slices/workspaceSlice";

import { setDistractionFree } from "../../store/slices/uiSlice";
import DistractionFreeSlate from "./DistractionFreeSlate";

const DistractionFree = (props) => {
	let dispatch = useDispatch();
	const fullscreenOpen = useSelector(state => state.uiReducer.distractionFreeOpen);
	const setFullscreen = (open) => {dispatch(setDistractionFree({open}))}

	const docCache = useSelector(state => state.workspaceReducer.docCache);
	const curDocList = useSelector(state => state.workspaceReducer.curDocList);

	const docTree = useSelector(state => state.workspaceReducer.docTree);
	const curDocId = useSelector(state => state.workspaceReducer.curDocId);
	const inspDocRow = useSelector(state => state.workspaceReducer.inspectedDocRow)
	const curDocRow = useSelector(state => state.workspaceReducer.curDocRow);
	const lastTreeUpdate = useSelector(state => state.workspaceReducer.docTreeLastUpdate);

	const getDoc = (node, path, treeIndex) => {
		if (node.node.id !== undefined) {
			dispatch(switchDocument({id: node.node.id}));
		}
	}
	const newDoc = (id) => {
		dispatch(createNewDocument({id}));
	}

	const queueDocChanges = (id, changes) => dispatch(queueDocumentChanges({docId: id, changes: changes}));
	const updateDoc = (id, newDoc) => {dispatch(updateWorkingDoc({id, newDoc}))};
	const inspectDoc = (id) => {dispatch(inspectDocument({id: id}))}

	return (
		<Fullscreen
			enabled={fullscreenOpen}
      		onChange={setFullscreen}
		>
			{
				fullscreenOpen ? (
					<div id="distraction-free">
						<DistractionFreeSlate 
							doc = {docCache[curDocId]}
							docSet = {docCache}
							docList = {curDocList}
							docId = {curDocId}
							updateDoc = {updateDoc}
							inspectDoc={inspectDoc}
							queueDocChanges = {queueDocChanges}
						/>
					</div>
				) : null
			
			}
		</Fullscreen>
	);
}

export default DistractionFree;