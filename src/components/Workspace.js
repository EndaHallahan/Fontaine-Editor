import React, { Component, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { switchDocument } from "../store/slices/workspaceSlice";

import Editor from "./Editor";
import LeftPanel from "./LeftPanel";
import HeaderArea from "./HeaderArea";

const Workspace = (props) => {
	const curDocId = useSelector(state => state.workspaceReducer.curDocId);
	const curDocList = useSelector(state => state.workspaceReducer.curDocList);
	const curDocCache = useSelector(state => state.workspaceReducer.workingDocs);
	const docCache = useSelector(state => state.workspaceReducer.docCache);
	const dispatch = useDispatch();
	useEffect(() => {
		if (curDocId !== null) {dispatch(switchDocument({id: curDocId}));}
	}, []);
	return(
		<div id="workspace">
			<HeaderArea />
			<div id="app-toolbar">

			</div>
			<div id="work-area">
				<LeftPanel />
				
					<Editor 
						doc = {docCache[curDocId]}
						docSet = {docCache}
						docList = {curDocList}
						docId = {curDocId}
					/>
				<div id="right-panel">

				</div>
			</div>
			<div id="bottom-panel">

			</div>
		</div>
	);
}

export default Workspace;