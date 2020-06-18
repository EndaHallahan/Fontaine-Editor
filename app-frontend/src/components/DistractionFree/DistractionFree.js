import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import Fullscreen from "react-full-screen";

import {
	updateWorkingDoc,
} from "../../store/slices/workspaceSlice";

import { setDistractionFree } from "../../store/slices/uiSlice";
import DistractionFreeSlate from "./DistractionFreeSlate";

const DistractionFree = (props) => {
	let dispatch = useDispatch();
	const fullscreenOpen = useSelector(state => state.uiReducer.distractionFreeOpen);
	const setFullscreen = (open) => {dispatch(setDistractionFree({open}))}

	const docCache = useSelector(state => state.workspaceReducer.docCache);
	const curDocList = useSelector(state => state.workspaceReducer.curDocList);
	const curDocId = useSelector(state => state.workspaceReducer.curDocId);

	const updateDoc = (id, newDoc) => {dispatch(updateWorkingDoc({id, newDoc}))};

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
						/>
					</div>
				) : (<div />)
			
			}
		</Fullscreen>
	);
}

export default DistractionFree;