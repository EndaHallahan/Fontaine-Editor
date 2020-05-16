import React, { Component } from "react";
import { useSelector, useDispatch } from 'react-redux';
import SortableTree, { 
	changeNodeAtPath, 
	find,
} from 'react-sortable-tree';

import { 
	inspectDocument, 
	updateDocTree 
} from "../store/slices/workspaceSlice";
import { Input, TextArea } from "./StatefulInputs";
import CollapsableDiv from "./CollapsableDiv";

class InspectorChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}
	onRowChange(newRow) {
		this.props.replaceInspRow(newRow);
	}
	render() {
		return (
			<div className="inspector">
				<div className="inspector-head">

				</div>
				<CollapsableDiv
					openHeight="auto"
					title="Details"
					className="details"
				>
					<div>Title:</div>
					<div className="right">{this.props.inspRow.title}</div>
				</CollapsableDiv>
				<CollapsableDiv
					openHeight="7rem"
					title="Summary"
				>
					<TextArea
						placeholder="Write a summary..."
						key={this.props.inspRow.summary}
						onChange={e => {
							const summary = e.target.value;
	                    	this.onRowChange({...this.props.inspRow, summary});
						}}
					>{this.props.inspRow.summary}</TextArea>
				</CollapsableDiv>
				<CollapsableDiv
					openHeight={null}
					defaultOpen={true}
					title="Notes"
				>
					<TextArea
						placeholder="Make a note..."
						key={this.props.inspRow.notes}
						onChange={e => {
							const notes = e.target.value;
	                    	this.onRowChange({...this.props.inspRow, notes});
						}}
					>{this.props.inspRow.notes}</TextArea>
				</CollapsableDiv>
			</div>
		);
	}
}

/*
<CollapsableDiv
					openHeight="auto"
				>
					<div>Notes</div>
					<TextArea
						placeholder="Make a note..."
						key={this.props.inspRow.notes}
						onChange={e => {
							const notes = e.target.value;
	                    	this.onRowChange({...this.props.inspRow, notes});
						}}
					>{this.props.inspRow.notes}</TextArea>
				</CollapsableDiv>
*/

const Inspector = (props) => {
	const dispatch = useDispatch();
	const docTree = useSelector(state => state.workspaceReducer.docTree);
	const curInspRow = useSelector(state => state.workspaceReducer.inspectedDocRow);
	const inspectDoc = (node, path, treeIndex) => {
		
	}
	const updateTree = (treeData) => {
		dispatch(updateDocTree({tree: treeData}));
	}
	const replaceInspRow = (newRow) => {
		let modifiedTree = changeNodeAtPath({
			treeData: docTree,
			path: curInspRow.path,
			getNodeKey: ({treeIndex}) => {return treeIndex;},
			newNode: newRow
		});
		updateTree(modifiedTree);
	}
	//console.log("Fetched:", JSON.stringify(curInspRow))
	if (curInspRow && curInspRow.node) {
		return (
			<InspectorChild 
				inspRow={curInspRow.node}
				replaceInspRow={replaceInspRow}
			/>
		);
	} else {
		return (<div />);
	}
}

export default Inspector;