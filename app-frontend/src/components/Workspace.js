import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { loadState } from "../store/slices/workspaceSlice";

import EditorArea from "./EditorArea";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import AppBar from "./AppBar";
import AppToolBar from "./AppToolBar";

const Workspace = (props) => {
	const isLoaded = useSelector(state => state.workspaceReducer.loaded);
	const dispatch = useDispatch();
	const loadProject = () => dispatch(loadState(props.documentInterface));
	useEffect(() => {
		if (!isLoaded) {loadProject()}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div id="workspace">
			<AppBar documentInterface={props.documentInterface}/>
			<AppToolBar />
			<div id="work-area">
				<LeftPanel 
					documentInterface={props.documentInterface}
				/>
				<EditorArea 
					documentInterface={props.documentInterface}
				/>
				<RightPanel 
					documentInterface={props.documentInterface}
				/>
			</div>
			<div id="bottom-panel">

			</div>
		</div>
	);
	
}

export default Workspace;