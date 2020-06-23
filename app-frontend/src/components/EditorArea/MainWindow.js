import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { changeNodeAtPath } from 'react-sortable-tree';

import {
	updateWorkingDoc,
	inspectDocument,
	switchDocument, 
	createNewDocument, 
	updateDocTree,
	updateWordcount,

	setWorkingDoc,
} from "../../store/slices/workspaceSlice";
import { updateHistory } from "../../store/slices/historySlice";

import EditorDisplay from "./EditorDisplay";
import Helpers from "../../utils/editor/Helpers";

const MainWindow = (props) => {
	const dispatch = useDispatch();
	const editorMode = useSelector(state => state.uiReducer.editorMode);

	const docCache = useSelector(state => state.workspaceReducer.docCache);
	const curDocList = useSelector(state => state.workspaceReducer.curDocList);

	const docTree = useSelector(state => state.workspaceReducer.docTree);
	const curDocId = useSelector(state => state.workspaceReducer.curDocId);
	const inspDocRow = useSelector(state => state.workspaceReducer.inspectedDocRow)
	const curDocRow = useSelector(state => state.workspaceReducer.curDocRow);

	const metadataFields = useSelector(state => state.workspaceReducer.metadataFields);

	const threads = useSelector(state => state.workspaceReducer.threads);

	const history = useSelector(state => state.historyReducer.histories);

	const getDoc = (node, path, treeIndex) => {
		if (node.node.id !== undefined) {
			dispatch(switchDocument(node.node.id, props.documentInterface));
		}
	}
	const newDoc = (id) => {
		dispatch(createNewDocument({id}));
	}
	const updateTree = (treeData) => {
		dispatch(updateDocTree(treeData, props.documentInterface));
	}
	const replaceCurRow = (newRow) => {
		let reorderedTree = changeNodeAtPath({
			treeData: docTree,
			path: curDocRow.path,
			getNodeKey: ({treeIndex}) => {return treeIndex;},
			newNode: newRow
		});
		updateTree(reorderedTree);
	}
	const updateDoc = (id, newDoc) => {
		dispatch(setWorkingDoc({id, newDoc}));
		dispatch(updateWordcount(id, newDoc));
	};
	const inspectDoc = (id) => {dispatch(inspectDocument({id: id}))}

	const updateHist = (id, hist) => {dispatch(updateHistory({docId: id, history: hist}))}

	return(
		<div className="editor-window main-window">
			<div className="info-bar">
				<span><span>{curDocRow.node ? curDocRow.node.title : ""}</span></span>
				<span></span>
			</div>
			<div className="area-wrapper">
				<EditorDisplay 
					nodeIn={curDocRow.node}
					editorMode={editorMode}
					treeData={docTree}
					docCache={docCache}
					curDocId={curDocId}
					curDocRow={curDocRow}
					getDoc={getDoc}
					inspectDoc={inspectDoc}
					inspDocId={inspDocRow.node ? inspDocRow.node.id : null}
					newDoc={newDoc}
					onTreeChange={updateTree}
					curDocList = {curDocList}
					replaceCurRow={replaceCurRow}
					mdFields={metadataFields}
					updateDoc = {updateDoc}
					threads={threads}
					history={history}
					updateHistory={updateHist}
					documentInterface = {props.documentInterface}
				/>
			</div>	
		</div>
	);
}



export default MainWindow;