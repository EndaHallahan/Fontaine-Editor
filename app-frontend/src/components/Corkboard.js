import React, { Component, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
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
	switchDocument, 
	queueDocumentChanges, 
	createNewDocument, 
	updateDocTree 
} from "../store/slices/workspaceSlice";

class IndexCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}
	render() {
		return (
			<div 
				{...this.props}
				className="index-card" 
			>
				<h3>{this.props.title}</h3>
			</div>
		);
	}
}

class CorkboardChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			treeData: this.props.treeData,
			currentlySelectedNode: this.props.curDocRow.node || null,
			currentList: this.props.curDocRow.node.children || null,
			freeForm: false,
		}
		this.onReorder = this.onReorder.bind(this);
	}
	onReorder (event, previousIndex, nextIndex, fromId, toId) {
		this.setState({
			...this.state,
			currentList: reorder(this.state.currentList, previousIndex, nextIndex)
		}, () => this.props.onReorder(this.state.currentList));
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (!_.isEqual(nextProps.treeData, this.props.treeData)) {
			this.setState({
				...this.state,
				treeData: nextProps.treeData
			})
		}
		if (!_.isEqual(nextProps.curDocRow, this.props.curDocRow)) {
			this.setState({
				...this.state,
				curDocRow: nextProps.curDocRow,
				currentList: nextProps.curDocRow.node.children,
				treeData: nextProps.treeData
			})
		}
	}
	render() {
		return (
			<div id="corkboard-area">
				<Reorder 
					reorderId="corkboard"
					itemKey="id"
					list={this.props.curDocRow.node.children}
					template={IndexCard}
					onReorder={this.onReorder}
					component="div"
				>
					{
						this.state.currentList 
						? (
							this.state.currentList.map((item) => (
						      	<IndexCard 
									key={item.id}
									docId={item.id}
									title={item.title}
									notes={item.notes ? item.notes : null}
								/>
						    ))
						) : null
						}
				</Reorder>
			</div>
		);
	}
}

const Corkboard = (props) => {
	const dispatch = useDispatch();
	const docTree = useSelector(state => state.workspaceReducer.docTree);
	const curDocId = useSelector(state => state.workspaceReducer.curDocId);
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
	const onReorder = (newOrder) => {
		let reorderedNode = {...curDocRow.node, expanded: true, children: [...newOrder]}
		let reorderedTree = changeNodeAtPath({
			treeData: docTree,
			path: curDocRow.path,
			getNodeKey: ({treeIndex}) => {return treeIndex;},
			newNode: reorderedNode
		});
		updateTree(reorderedTree);
	}
	return(
		<CorkboardChild 
			treeData={docTree}
			curDoc={props.docId}
			curDocRow={curDocRow}
			getDoc={getDoc}
			newDoc={newDoc}
			onTreeChange={updateTree}
			docList = {props.docList}
			onReorder={onReorder}
			//key={curDocId}
		/>
	);
}

export default Corkboard;