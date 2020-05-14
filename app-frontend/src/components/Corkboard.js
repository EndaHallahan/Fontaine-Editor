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

import { Icon, InlineIcon } from '@iconify/react';
import gridIcon from '@iconify/icons-feather/grid';

import { 
	switchDocument, 
	queueDocumentChanges, 
	createNewDocument, 
	updateDocTree 
} from "../store/slices/workspaceSlice";
import { Input, TextArea } from "./StatefulInputs";


import EditableTitle from "./EditableTitle";

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
				<h3>
					<Input
						value={this.props.card.title}
						onChange={e => {
							const title = e.target.value;
	                    	this.props.onCardChange({...this.props.card, title}, this.props.docIndex);
						}}
					/>
				</h3>
				<TextArea
					placeholder="Make a note..."
					onChange={e => {
						const note = e.target.value;
                    	this.props.onCardChange({...this.props.card, note}, this.props.docIndex);
					}}
				>{this.props.card.note}</TextArea>
				<span title="Hold to drag"><Icon icon={gridIcon} /></span>
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
		console.log("newCardList", newList)
		this.setState({
			...this.state,
			currentList: newList
		}, () => {
			let modifiedNode = {...this.props.curDocRow.node, expanded: true, children: [...this.state.currentList]}
			this.props.replaceCurRow(modifiedNode);
		});
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		console.log("newCurRow", nextProps.curDocRow)
		if (!_.isEqual(nextProps.treeData, this.props.treeData)) {
			console.log("Corkboard Tree Update!")
			this.setState({
				...this.state,
				currentList: nextProps.curDocRow ? nextProps.curDocRow.node.children : this.props.curDocRow,
				treeData: nextProps.treeData
			})
		}
		if (!_.isEqual(nextProps.curDocRow, this.props.curDocRow)) {
			console.log("Corkboard Row Update!")
			this.setState({
				...this.state,
				currentList: nextProps.curDocRow.node.children,
				treeData: nextProps.treeData
			})
		}
	}
	render() {
		console.log(this.state.currentList);
		return (
			<div id="corkboard-area">
				<Reorder 
					reorderId="corkboard"
					itemKey="id"
					list={this.props.curDocRow.node.children}
					template={IndexCard}
					onReorder={this.onReorder}
					component="div"
					holdTime={200}
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
	const replaceCurRow = (newRow) => {
		console.log("repRow", newRow)
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
			treeData={docTree}
			curDoc={props.docId}
			curDocRow={curDocRow}
			getDoc={getDoc}
			newDoc={newDoc}
			onTreeChange={updateTree}
			docList = {props.docList}
			replaceCurRow={replaceCurRow}
			//key={curDocId}
		/>
	);
}

export default Corkboard;