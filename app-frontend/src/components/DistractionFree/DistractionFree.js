import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import Fullscreen from "react-full-screen";

import {
	updateWorkingDoc,
} from "../../store/slices/workspaceSlice";
import { updateHistory } from "../../store/slices/historySlice";

import { setDistractionFree } from "../../store/slices/uiSlice";
import DistractionFreeSlate from "./DistractionFreeSlate";

const DistractionFree = (props) => {
	let dispatch = useDispatch();
	const fullscreenOpen = useSelector(state => state.uiReducer.distractionFreeOpen);
	const setFullscreen = (open) => {dispatch(setDistractionFree({open}))}

	const docCache = useSelector(state => state.workspaceReducer.docCache);
	const curDocList = useSelector(state => state.workspaceReducer.curDocList);
	const curDocId = useSelector(state => state.workspaceReducer.curDocId);

	const history = useSelector(state => state.historyReducer.histories);

	const updateDoc = (id, newDoc) => {dispatch(updateWorkingDoc({id, newDoc}))};
	const updateHist = (id, hist) => {dispatch(updateHistory({docId: id, history: hist}))}


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
							history={history}
							updateHistory={updateHist}
						/>
					</div>
				) : (<div />)
			
			}
		</Fullscreen>
	);
}

export default DistractionFree;