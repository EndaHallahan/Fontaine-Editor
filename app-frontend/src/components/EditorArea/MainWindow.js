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


import { 
	queueDocumentChanges,
	updateWorkingDoc,
	inspectDocument,
	switchDocument, 
	createNewDocument, 
	updateDocTree 
} from "../../store/slices/workspaceSlice";
import { toggleSplitEditor } from "../../store/slices/uiSlice";

import MultiDocSlate from "./MultiDocSlate";
import Corkboard from "./Corkboard";




import KeyboardFocusableButton from "../KeyboardFocusableButton";


const MainWindow = (props) => {
	const dispatch = useDispatch();
	const editorMode = useSelector(state => state.uiReducer.editorMode);

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
	const updateDoc = (id, newDoc) => {dispatch(updateWorkingDoc({id, newDoc}))};
	const inspectDoc = (id) => {dispatch(inspectDocument({id: id}))}

	return(
		<div className="editor-window main-window">
			<div className="info-bar">
				<span><span>{curDocRow.node.title}</span></span>
				<span></span>
			</div>
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
						/>
		          	),
		        }[editorMode]
			}	
		</div>
	);
}

export default MainWindow;




/*class SplitEditorChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: this.props.width || "50%"
		}
	}
	render() {
		return (
			<Resizable
				size={{width: this.state.width, height: "100%"}}
				minWidth={190}
				maxWidth={"80%"}
				onResizeStop={(e, direction, ref, d) => {
				    this.setState({
				    	...this.state,
				     	width: this.state.width + d.width
				    }); 
				}}
				enable={{ 
					top:false, 
					right:false, 
					bottom:false, 
					left:true, 
					topRight:false, 
					bottomRight:false, 
					bottomLeft:false, 
					topLeft:false 
				}}
				className="split-editor"
			>
				<div className="split-bar">
					<KeyboardFocusableButton
						onClick={this.props.switchSplitEditor}
						title="Close the split Editor"
						//className={editorMode === "editor" ? "active" : null}
					><Icon icon={xCircle} /></KeyboardFocusableButton>
				</div>
				{this.props.children}
			</Resizable>
			
		);
	}
}

const SplitEditor = (props) => {
	const dispatch = useDispatch();

	//const mainEditorMode = useSelector(state => state.uiReducer.editorMode);
	const switchSplitEditor = () => dispatch(toggleSplitEditor());

	return(
		<SplitEditorChild
			{...props}
			switchSplitEditor={switchSplitEditor} 
		/>
	);
}

export default SplitEditor;*/