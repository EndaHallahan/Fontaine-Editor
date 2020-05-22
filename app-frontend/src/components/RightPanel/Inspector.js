import React, { Component, Fragment } from "react";
import { useSelector, useDispatch } from 'react-redux';
import SortableTree, { 
	changeNodeAtPath, 
	find,
} from 'react-sortable-tree';
import { Icon, InlineIcon } from '@iconify/react';
import tagIcon from '@iconify/icons-feather/tag';
import infoIcon from '@iconify/icons-feather/info';

import { 
	inspectDocument, 
	updateDocTree 
} from "../../store/slices/workspaceSlice";
import { Input, TextArea, Select } from "../StatefulInputs";
import CollapsableDiv from "../CollapsableDiv";
import TabularMenu from "../TabularMenu";
import Tagger from "./Tagger";

class InspectorChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
		this.onRowChange = this.onRowChange.bind(this);
	}
	onRowChange(newRow) {
		this.props.replaceInspRow(newRow);
	}
	render() {
		return (
			<div className="inspector" key={this.props.inspRow.id}>
				<TabularMenu
	       			startTab={1}
	       			horizontal
	       			windows={[
	       				{tabName:(<Icon icon={infoIcon} />), render: () => 
		       				<Fragment>
		       					<CollapsableDiv
									openHeight="auto"
									title="Details"
									className="details"
								>
									<div>Status:</div>
									<Select
										options={[
											{value: "", name: "None"},
											{value: "Not Started"},
											{value: "Rough Draft"},
											{value: "Needs Editing"},
											{value: "Final Draft"},
											{value: "Done"}
										]}
										value={this.props.inspRow.status}
										onChange={e => {
											const status = e.target.value;
					                    	this.onRowChange({...this.props.inspRow, status});
										}}
									/>
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
										value={this.props.inspRow.summary}
									/>
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
										value={this.props.inspRow.notes}
									/>
								</CollapsableDiv>
							</Fragment>
	       				},
	       				{tabName:(<Icon icon={tagIcon} />), render: () => 
	       					<Fragment>
	       					<CollapsableDiv
									openHeight={null}
									defaultOpen={true}
									title="Tags"
								>
									<Tagger 
										onChange={tags => {
											console.log(tags);
					                    	this.onRowChange({...this.props.inspRow, tags});
										}}
										tags={this.props.inspRow.tags || []}
										tagList={[
											"argabarga",
											"pov:Abigail",
											"pov:John",
											"pov:Benjamin",

										]}
									/>
								</CollapsableDiv>
	       						
	       					</Fragment>
	       				},
	       			]}
	       		/>	
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