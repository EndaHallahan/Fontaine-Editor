import React, { Component, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SortableTree, { 
	changeNodeAtPath, 
	addNodeUnderParent, 
	find, 
	removeNodeAtPath
} from 'react-sortable-tree';

import { switchDocument, loadState } from "../store/slices/workspaceSlice";

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
	}, []);
	return (
		<div id="workspace">
			<AppBar />
			<AppToolBar />
			<div id="work-area">
				<LeftPanel 
					documentInterface={props.documentInterface}
				/>
				<EditorArea 
					documentInterface={props.documentInterface}
				/>
				<RightPanel />
			</div>
			<div id="bottom-panel">

			</div>
		</div>
	);
	
}

export default Workspace;