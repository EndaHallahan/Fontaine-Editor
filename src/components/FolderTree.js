import React, { Component } from 'react';
import SortableTree, { changeNodeAtPath} from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useSelector, useDispatch } from 'react-redux'
import { switchDocument, queueDocumentChanges } from "../store/slices/workspaceSlice";

//import { queueDocumentChanges, updateWorkingDoc } from "../store/slices/workspaceSlice"

import EditableTitle from "./EditableTitle";

class FolderTreeChild extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      	treeData: this.props.treeData
	    };
	}
	render() {
    	const getNodeKey = ({ treeIndex }) => treeIndex;
		return(
			<div style={{ height: 400 }}>
				<SortableTree
		          	treeData={this.state.treeData}
		          	onChange={treeData => this.setState({ treeData })}
		          	theme={FileExplorerTheme}
		          	generateNodeProps={rowInfo => ({
		          		title: (
		          			<EditableTitle
		          				value={rowInfo.node.title}
		          				onClick={() => this.props.getDoc(rowInfo)}
			                  	onChange={event => {
			                    	const title = event.target.value;
			                    	this.setState(state => ({
			                      		treeData: changeNodeAtPath({
				                        	treeData: state.treeData,
				                        	path: rowInfo.path,
				                        	getNodeKey,
				                        	newNode: { ...rowInfo.node, title },
				                      	}),
			                    	}));
			                  	}}
		          			/>
			            ),
			            icons: rowInfo.node.isDirectory
			                ? [
			                    <div className="tree-file-icon">
			                      	<FontAwesomeIcon icon="folder" />
			                    </div>,
			                  ]
			                : [
			                    <div className="tree-file-icon">
			                      	<FontAwesomeIcon icon="file" />
			                    </div>,
			                  ]
		            })}
		        />
	        </div>
		);
	}
}

const FolderTree = (props) => {
	const docTree = useSelector(state => state.workspaceReducer.docTree);
	const curDocId = useSelector(state => state.workspaceReducer.curDocId);
	const dispatch = useDispatch();
	const getDoc = (node, path, treeIndex) => {
		if (node.node.id !== undefined) {
			dispatch(switchDocument({id: node.node.id}));
		}
	}

	/*const dispatch = useDispatch();
	const queueDocChanges = (id, changes) => dispatch(queueDocumentChanges({docId: id, changes: changes}));
	const updateDoc = (newDoc) => dispatch(updateWorkingDoc({newDoc: newDoc}));*/
	return(
		<FolderTreeChild
			treeData={docTree}
			getDoc = {getDoc}
		/>
	);
}

export default FolderTree;