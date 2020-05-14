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

import { Icon, InlineIcon } from '@iconify/react';
import bookOpen from '@iconify/icons-feather/book-open';
import file from '@iconify/icons-feather/file';
import filePlus from '@iconify/icons-feather/file-plus';
import folder from '@iconify/icons-feather/folder';
import folderPlus from '@iconify/icons-feather/folder-plus';
import trash2 from '@iconify/icons-feather/trash-2';

import { useSelector, useDispatch } from 'react-redux'
import { 
	switchDocument, 
	queueDocumentChanges, 
	createNewDocument, 
	updateDocTree 
} from "../store/slices/workspaceSlice";

import EditableTitle from "./EditableTitle";
import KeyboardFocusableButton from "./KeyboardFocusableButton";

class FolderTreeChild extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      	currentlySelectedNode: null,
	    };
	    this.addNewNodeUnderCurrent = this.addNewNodeUnderCurrent.bind(this);
	    this.moveNodeToTarget = this.moveNodeToTarget.bind(this);
	    this.selectNode = this.selectNode.bind(this);
	    this.trashSelectedNode = this.trashSelectedNode.bind(this);
	    this.getNodeKey = this.getNodeKey.bind(this);
	}
	addNewNodeUnderCurrent(nodeType) {
		const id = uuidv4();
		this.props.newDoc(id);
		const newNode = {type: nodeType, title: "Untitled", id}
		const path = this.state.currentlySelectedNode.path;
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
		this.selectNode(selRow.matches[0])

		
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
			this.props.onTreeChange(selRow.treeData)
		this.setState({
			...this.state,
			currentlySelectedNode: selRow.matches[0]
		});	
	}
	selectNode(rowInfo) {
		this.setState({
			...this.state,
			currentlySelectedNode: rowInfo
		});
		this.props.getDoc(rowInfo);
	}
	trashSelectedNode() {
		if (this.state.currentlySelectedNode.node.permanent) {
			return;
		}
		const trashNode = find({
			getNodeKey: this.getNodeKey,
			treeData: this.props.treeData,
			searchMethod: (rowData) => {return(rowData.node.type === "trash")}
		});
		this.moveNodeToTarget(
			this.state.currentlySelectedNode,
			trashNode.matches[0],
			this.props.treeData
		);
	}
	getNodeKey({treeIndex}) {
		return treeIndex;
	}
	componentDidMount() {
		if (this.props.curDoc !== null) {
			const selRow = find({
				getNodeKey: this.getNodeKey,
				treeData: this.props.treeData,
				searchMethod: (rowData) => {return(rowData.node.id === this.props.curDoc)}
			});
			this.setState({
				...this.state,
				currentlySelectedNode: selRow.matches[0]
			});
		}
  	}
  	UNSAFE_componentWillReceiveProps(nextProps) {
		if (!_.isEqual(nextProps.treeData, this.props.treeData)) {
			this.setState({
				...this.state,
				treeData: nextProps.treeData
			})
		}
	}
	render() {
		return(
			<div className="file-tree">
				<div className="file-tree-head">
					<KeyboardFocusableButton 
						value={<Icon icon={filePlus} />}
						onClick={() => this.addNewNodeUnderCurrent("file")}
						title="New File"
						className="new-file"
						disabled={this.state.currentlySelectedNode === null}
					/>
					<KeyboardFocusableButton 
						value={<Icon icon={folderPlus} />}
						onClick={() => this.addNewNodeUnderCurrent("folder")}
						title="New Folder"
						className="new-folder"
						disabled={this.state.currentlySelectedNode === null}
					/>
					<span className="right">
						<KeyboardFocusableButton 
							value={<Icon icon={trash2} />}
							onClick={() => this.trashSelectedNode()}
							title="Move to Trash"
							className="trash"
							disabled={this.state.currentlySelectedNode === null}
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
								this.setState({
									...this.state,
									currentlySelectedNode: selRow.matches[0]
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
			          			this.props.curDoc !== null 
			          			&& rowInfo.node.id === this.props.curDoc
			          			? "selected" : null
			          		),
			          		title: (
			          			<EditableTitle
			          				value={rowInfo.node.title}
			          				onClick={() => {this.selectNode(rowInfo)}}
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
				            	<div className="tree-file-icon" onClick={() => {this.selectNode(rowInfo)}}>
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
	const lastTreeUpdate = useSelector(state => state.workspaceReducer.docTreeLastUpdater);
	const dispatch = useDispatch();
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
	return(
		<FolderTreeChild
			treeData={docTree}
			curDoc={curDocId}
			getDoc={getDoc}
			newDoc={newDoc}
			onTreeChange={updateTree}
		/>
	);
}

export default FolderTree;