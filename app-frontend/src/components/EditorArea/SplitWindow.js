import React, { Component, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Resizable } from "re-resizable";

import Reorder, {
	reorder,
	reorderImmutable,
	reorderFromTo,
	reorderFromToImmutable
} from 'react-reorder';
import SortableTree, { 
	changeNodeAtPath, 
	find,
} from 'react-sortable-tree';

import { Icon, InlineIcon } from '@iconify/react';
import xCircle from '@iconify/icons-feather/x-circle';
import layoutIcon from '@iconify/icons-feather/layout';

import { 
	queueDocumentChanges,
	updateWorkingDoc,
	inspectDocument,
	switchDocument, 
	switchSplitDocument,
	createNewDocument, 
	updateDocTree 
} from "../../store/slices/workspaceSlice";
import { 
	setSplitEditorOpen,
	toggleSplitOrientation,
} from "../../store/slices/uiSlice";
import MultiDocSlate from "./MultiDocSlate";
import Corkboard from "./Corkboard";
import Overview from "./Overview";
import StoryMap from "./StoryMap";
import KeyboardFocusableButton from "../KeyboardFocusableButton";

import EditorDisplay from "./EditorDisplay";

const SplitWindow = (props) => {
	const dispatch = useDispatch();
	const editorMode = useSelector(state => state.uiReducer.splitEditorMode);
	const splitOrientation = useSelector(state => state.uiReducer.splitOrientation);

	const docCache = useSelector(state => state.workspaceReducer.docCache);
	const curDocList = useSelector(state => state.workspaceReducer.splitDocList);

	const docTree = useSelector(state => state.workspaceReducer.docTree);
	const curDocId = useSelector(state => state.workspaceReducer.splitDocId);
	const inspDocRow = useSelector(state => state.workspaceReducer.inspectedDocRow)
	const curDocRow = useSelector(state => state.workspaceReducer.splitDocRow);
	const lastTreeUpdate = useSelector(state => state.workspaceReducer.docTreeLastUpdate);

	const metadataFields = useSelector(state => state.workspaceReducer.metadataFields);

	const threads = useSelector(state => state.workspaceReducer.threads);

	const getDoc = (node, path, treeIndex) => {
		if (node.node.id !== undefined) {
			dispatch(switchSplitDocument(node.node.id, props.documentInterface));
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
	const onReorder = (newOrder) => {
		let reorderedNode = {...curDocRow.node, expanded: true, children: [...newOrder]}
		replaceCurRow(reorderedNode);
	}

	const queueDocChanges = (id, changes) => dispatch(queueDocumentChanges({docId: id, changes: changes}));
	const updateDoc = (id, newDoc) => {
		dispatch(updateWorkingDoc({id, newDoc}))
	};
	const inspectDoc = (id) => {dispatch(inspectDocument({id: id}))}

	const closeSplitEditor = () => {
		dispatch(setSplitEditorOpen({open: false}));
	}
	const switchOrientation = () => {
		dispatch(toggleSplitOrientation());
	}

	return(
		<div
			className="editor-window split-window"
		>
			<div className="info-bar">
				<span><span>{curDocRow.node.title}</span></span>
				<span>
					<KeyboardFocusableButton
						onClick={switchOrientation}
						title="Change Orientation (Ctrl+')"
					><Icon icon={layoutIcon} /></KeyboardFocusableButton>
					<KeyboardFocusableButton
						onClick={closeSplitEditor}
						title="Close Split Editor (Ctrl+Alt+S)"
					><Icon icon={xCircle} /></KeyboardFocusableButton>
				</span>
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
					inspectDoc={inspectDoc}
					queueDocChanges = {queueDocChanges}
					documentInterface = {props.documentInterface}
					split={true}
				/>
		    </div>
		</div>
	);
}

export default SplitWindow;