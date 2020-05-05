import React, { Component, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { switchDocument } from "../store/slices/workspaceSlice";

import Editor from "./Editor";
import LeftPanel from "./LeftPanel";

const Workspace = (props) => {
	const curDocId = useSelector(state => state.workspaceReducer.curDocId);
	const docCache = useSelector(state => state.workspaceReducer.docCache);
	const dispatch = useDispatch();
	useEffect(() => {
		if (curDocId !== null) {
			dispatch(switchDocument({id: curDocId}));
		}
	}, []);
	return(
		<div id="workspace">
			<div id="app-toolbar">

			</div>
			<LeftPanel />
			<div id="main-area">
				<Editor 
					doc = {docCache[curDocId]}
					docId = {curDocId}
				/>
			</div>
			<div id="right-panel">

			</div>
			<div id="bottom-panel">

			</div>
		</div>
	);
}

export default Workspace;