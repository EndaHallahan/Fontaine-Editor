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
		dispatch(updateDocTree({tree: treeData}));
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
			{
				{
		          	"editor": (
		          		<MultiDocSlate 
							doc = {docCache[curDocId]}
							docSet = {docCache}
							docList = {curDocList}
							docId = {curDocId}
							updateDoc = {updateDoc}
							inspectDoc={inspectDoc}
							queueDocChanges = {queueDocChanges}
							split={true}
						/>
		          	),
		          	"corkboard": (
		          		<Corkboard
							treeData={docTree}
							curDoc={curDocId}
							curDocRow={curDocRow}
							getDoc={getDoc}
							inspectDoc={inspectDoc}
							inspDocId={inspDocRow.node.id}
							newDoc={newDoc}
							onTreeChange={updateTree}
							docList = {curDocList}
							replaceCurRow={replaceCurRow}
							split={true}
						/>
		          	),
		          	"overview": (
		          		<Overview
							treeData={docTree}
							curDoc={curDocId}
							curDocRow={curDocRow}
							getDoc={getDoc}
							inspectDoc={inspectDoc}
							inspDocId={inspDocRow.node.id}
							newDoc={newDoc}
							onTreeChange={updateTree}
							docList = {curDocList}
							replaceCurRow={replaceCurRow}
							mdFields={metadataFields}
							split={true}
						/>
		          	),
		          	"storymap": (
		          		<StoryMap
							treeData={docTree}
							curDoc={curDocId}
							curDocRow={curDocRow}
							getDoc={getDoc}
							inspectDoc={inspectDoc}
							inspDocId={inspDocRow.node.id}
							newDoc={newDoc}
							onTreeChange={updateTree}
							docList = {curDocList}
							replaceCurRow={replaceCurRow}
							threads={threads}
							split={true}
						/>
		          	),
		        }[editorMode]
		    }
		    </div>
		</div>
	);
}

export default SplitWindow;