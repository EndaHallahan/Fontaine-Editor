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
	inspectDocument,
	queueDocumentChanges, 
	createNewDocument, 
	updateDocTree 
} from "../../store/slices/workspaceSlice";
import IndexCard from "./IndexCard";
import CorkboardFooter from "./CorkboardFooter";

class Corkboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			treeData: this.props.treeData,
			currentlySelectedNode: this.props.curDocRow.node || null,
			currentList: this.props.curDocRow.node.children || null,
			freeForm: false,
		}
		this.onReorder = this.onReorder.bind(this);
		this.onCardChange = this.onCardChange.bind(this);
	}
	onReorder (event, previousIndex, nextIndex, fromId, toId) {
		this.setState({
			...this.state,
			currentList: reorder(this.state.currentList, previousIndex, nextIndex)
		}, () => {
			let reorderedNode = {...this.props.curDocRow.node, expanded: true, children: [...this.state.currentList]}
			this.props.replaceCurRow(reorderedNode)
		});
	}
	onCardChange(newCard, index) {
		let newList = Array.from(this.state.currentList);
		newList[index] = newCard;
		this.setState({
			...this.state,
			currentList: newList
		}, () => {
			let modifiedNode = {...this.props.curDocRow.node, expanded: true, children: [...this.state.currentList]}
			this.props.replaceCurRow(modifiedNode);
		});
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (!_.isEqual(nextProps.treeData, this.props.treeData)) {
			this.setState({
				...this.state,
				currentList: nextProps.curDocRow ? nextProps.curDocRow.node.children : this.props.curDocRow,
				treeData: nextProps.treeData
			})
		}
		if (!_.isEqual(nextProps.curDocRow, this.props.curDocRow)) {
			this.setState({
				...this.state,
				currentList: nextProps.curDocRow.node.children,
				treeData: nextProps.treeData
			})
		}
	}
	render() {
		return (
			<div class="corkboard-area">
				<div className="board">
					<Reorder 
						reorderId= {this.props.split ? "split-corkboard" : "corkboard"}
						itemKey="id"
						list={this.props.curDocRow.node.children}
						template={IndexCard}
						onReorder={this.onReorder}
						component="div"
						holdTime={300}
					>
						{
							this.state.currentList 
							? (
								this.state.currentList.map((item, i) => (
							      	<IndexCard 
										key={item.id}
										docIndex={i}
										card={item}
										onCardChange={this.onCardChange}
										inspectDoc={this.props.inspectDoc}
										isInspected={this.props.inspDocId === item.id}
									/>
							    ))
							) : null
							}
					</Reorder>
				</div>
				<CorkboardFooter split={this.props.split}/>
			</div>
		);
	}
}

/*const Corkboard = (props) => {
	const dispatch = useDispatch();
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
	const inspectDoc = (id) => {
		dispatch(inspectDocument({id: id}))
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
	return(
		<CorkboardChild 
			{...props}
			treeData={docTree}
			curDoc={props.docId}
			curDocRow={curDocRow}
			getDoc={getDoc}
			inspectDoc={inspectDoc}
			inspDocId={inspDocRow.node.id}
			newDoc={newDoc}
			onTreeChange={updateTree}
			docList = {props.docList}
			replaceCurRow={replaceCurRow}

			//key={curDocId}
		/>
	);
}*/

export default Corkboard;