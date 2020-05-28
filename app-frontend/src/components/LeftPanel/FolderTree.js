import React, { Component } from 'react';
import _ from "lodash";
import SortableTree, { 
	changeNodeAtPath, 
	addNodeUnderParent, 
	find, 
	removeNodeAtPath
} from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import { v4 as uuidv4 } from "uuid";
import { GlobalHotKeys } from "react-hotkeys";
import { useSelector, useDispatch } from 'react-redux';

import { Icon, InlineIcon } from '@iconify/react';
import bookOpen from '@iconify/icons-feather/book-open';
import file from '@iconify/icons-feather/file';
import filePlus from '@iconify/icons-feather/file-plus';
import folder from '@iconify/icons-feather/folder';
import folderPlus from '@iconify/icons-feather/folder-plus';
import trash2 from '@iconify/icons-feather/trash-2';

import { 
	switchDocument, 
	switchSplitDocument,
	queueDocumentChanges, 
	createNewDocument, 
	updateDocTree 
} from "../../store/slices/workspaceSlice";
import { setSplitEditorOpen } from "../../store/slices/uiSlice";

import EditableTitle from "../EditableTitle";
import KeyboardFocusableButton from "../KeyboardFocusableButton";

const keyMap = {
		NEW_DOC: "ctrl+alt+n",
		NEW_FOLDER: "ctrl+shift+alt+n",
		SEND_TO_TRASH: "shift+del",
	}

class FolderTreeChild extends Component {
	constructor(props) {
	    super(props);
	    this.addNewNodeUnderCurrent = this.addNewNodeUnderCurrent.bind(this);
	    this.moveNodeToTarget = this.moveNodeToTarget.bind(this);
	    this.selectNode = this.selectNode.bind(this);
	    this.trashSelectedNode = this.trashSelectedNode.bind(this);
	    this.getNodeKey = this.getNodeKey.bind(this);
		this.keyHandlers = {
			NEW_DOC: e => {
				e.preventDefault();
				this.addNewNodeUnderCurrent("file")
			},
			NEW_FOLDER: e => {
				e.preventDefault();
				this.addNewNodeUnderCurrent("folder")
			},
			SEND_TO_TRASH: e => {
				e.preventDefault();
				this.trashSelectedNode();
			},
		}
	}
	addNewNodeUnderCurrent(nodeType, e) {
		const id = uuidv4();
		this.props.newDoc(id);
		const newNode = {type: nodeType, title: "Untitled", id}
		const path = this.props.curDocRow.path;
		let {treeData} = find({
			getNodeKey: this.getNodeKey,
			treeData: this.props.treeData,
			expandAllMatchPaths: true,
			searchMethod: (rowData) => {return(rowData.node.id === this.props.curDoc)}
		});
		treeData = addNodeUnderParent({
			treeData: treeData,
			newNode,
			parentKey: path[path.length - 1],
			getNodeKey: this.getNodeKey,
			expandParent: true,
			ignoreCollapsed: true
		}).treeData;

		this.props.onTreeChange(treeData)
		const selRow = find({
			getNodeKey: this.getNodeKey,
			treeData,
			searchMethod: (rowData) => {return(rowData.node.id === id)}
		});
		if (e && e.ctrlKey) {
			this.selectNode(selRow.matches[0]);
		}
	}
	moveNodeToTarget(node, destination, treeData) {
		treeData = addNodeUnderParent({
			treeData,
			newNode: node.node,
			parentKey: destination.path[destination.path.length - 1],
			getNodeKey: this.getNodeKey,
			ignoreCollapsed: true
		}).treeData;
		treeData = removeNodeAtPath({
			treeData,
			path: node.path,
			getNodeKey: this.getNodeKey,
			ignoreCollapsed: true
		});
		const selRow = find({
			getNodeKey: this.getNodeKey,
			treeData,
			expandAllMatchPaths: true,
			searchMethod: (rowData) => {return(rowData.node.id === this.props.curDoc)}
		});
		this.selectNode(selRow.matches[0]);
		this.props.onTreeChange(selRow.treeData);
	}
	selectNode(rowInfo, e) {
		if (e && e.ctrlKey) {
			this.props.getSplitDoc(rowInfo);
		} else {
			this.props.getDoc(rowInfo);
		}
		
	}
	trashSelectedNode() {
		if (this.props.curDocRow.node.permanent) {
			return;
		}
		const trashNode = find({
			getNodeKey: this.getNodeKey,
			treeData: this.props.treeData,
			searchMethod: (rowData) => {return(rowData.node.type === "trash")}
		});
		this.moveNodeToTarget(
			this.props.curDocRow,
			trashNode.matches[0],
			this.props.treeData
		);
	}
	getNodeKey({treeIndex}) {
		return treeIndex;
	}
	render() {
		return(
			<div className="file-tree">
				<GlobalHotKeys keyMap={keyMap} handlers={this.keyHandlers}/>
				<div className="file-tree-head">
					<KeyboardFocusableButton 
						value={<Icon icon={filePlus} />}
						onClick={(e) => this.addNewNodeUnderCurrent("file", e)}
						title="New File (Ctrl+Click to jump)"
						className="new-file"
						disabled={this.props.curDocRow === null}
					/>
					<KeyboardFocusableButton 
						value={<Icon icon={folderPlus} />}
						onClick={(e) => this.addNewNodeUnderCurrent("folder", e)}
						title="New Folder (Ctrl+Click to jump)"
						className="new-folder"
						disabled={this.props.curDocRow === null}
					/>
					<span className="right">
						<KeyboardFocusableButton 
							value={<Icon icon={trash2} />}
							onClick={() => this.trashSelectedNode()}
							title="Move to Trash"
							className="trash"
							disabled={this.props.curDocRow === null}
						/>
					</span>
				</div>
				<div>
					<SortableTree
			          	treeData={this.props.treeData}
			          	getNodeKey={this.getNodeKey}
			          	onChange={
			          		treeData => {
			          			const selRow = find({
									getNodeKey: this.getNodeKey,
									treeData,
									searchMethod: (rowData) => {return(rowData.node.id === this.props.curDoc)}
								});
								this.props.onTreeChange(treeData);
			          		}
			          	}
			          	theme={FileExplorerTheme}
			          	canDrag={(rowInfo) => {
			          		return(!rowInfo.node.permanent);
			          	}}
			          	generateNodeProps={rowInfo => ({
			          		className: (
			          			this.props.curDoc !== null && rowInfo.node.id === this.props.curDoc
			          			? "selected" 
			          			: this.props.splitDoc !== null && rowInfo.node.id === this.props.splitDoc
			          				? "selected-split"
			          				: null
			          		),
			          		title: (
			          			<EditableTitle
			          				value={rowInfo.node.title}
			          				onClick={(e) => {this.selectNode(rowInfo, e)}}
			          				title="Ctrl+Click to split"
				                  	onClose={text => {
				                    	const title = text;
				                    	const changedTree = changeNodeAtPath({
				                        	treeData: this.props.treeData,
				                        	path: rowInfo.path,
				                        	getNodeKey: this.getNodeKey,
				                        	newNode: { ...rowInfo.node, title },
				                      	})
				                      	this.props.onTreeChange(changedTree)
				                  	}}
			          			/>
				            ),
				            icons: [(
				            	<div 
				            		className="tree-file-icon" 
				            		title="Ctrl+Click to split"
				            		onClick={(e) => {this.selectNode(rowInfo, e)}}
				            	>
				                  	{
				                  		{
				                  			'manuscript': <Icon icon={bookOpen} />,
								          	'file': <Icon icon={file} />,
								          	'folder': <Icon icon={folder} />,
								          	'trash': <Icon icon={trash2} />,
								        }[rowInfo.node.type]
				                  	}
				                </div>
				            )]
			            })}
			        />
		        </div>
	        </div>
		);
	}
}

const FolderTree = (props) => {
	const docTree = useSelector(state => state.workspaceReducer.docTree);
	const curDocId = useSelector(state => state.workspaceReducer.curDocId);
	const curDocRow = useSelector(state => state.workspaceReducer.curDocRow);
	const splitOpen = useSelector(state => state.uiReducer.splitEditorOpen);
	const splitDocId = useSelector(state => state.workspaceReducer.splitDocId);
	const lastTreeUpdate = useSelector(state => state.workspaceReducer.docTreeLastUpdater);
	const dispatch = useDispatch();
	const getDoc = (node, path, treeIndex) => {
		if (node.node.id !== undefined) {
			dispatch(switchDocument(node.node.id, props.documentInterface));
		}
	}
	const getSplitDoc = (node, path, treeIndex) => {
		if (node.node.id !== undefined) {
			if (!splitOpen) {
				dispatch(setSplitEditorOpen({open: true}));
			}
			dispatch(switchSplitDocument(node.node.id, props.documentInterface));
		}
	}
	const newDoc = (id) => {
		dispatch(createNewDocument({id}));
	}
	const updateTree = (treeData) => {
		dispatch(updateDocTree(treeData, props.documentInterface));
	}
	return(
		<FolderTreeChild
			treeData={docTree}
			curDoc={curDocId}
			curDocRow={curDocRow}
			splitDoc={splitOpen ? splitDocId : null}
			getDoc={getDoc}
			getSplitDoc={getSplitDoc}
			newDoc={newDoc}
			onTreeChange={updateTree}
		/>
	);
}

export default FolderTree;