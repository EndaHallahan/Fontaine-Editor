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
	updateDocTree,
	addProjectTag,
} from "../../store/slices/workspaceSlice";
import { 
	setInspectorTab,
} from "../../store/slices/uiSlice";
import { Input, TextArea, Select } from "../StatefulInputs";
import CollapsableDiv from "../CollapsableDiv";
import TabularMenu from "../TabularMenu";
import Tagger from "./Tagger";
import MetaTagTable from "./MetaTagTable";

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
	       			startTab={this.props.tab}
	       			onTabChange={this.props.setTab}
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
									<MetaTagTable 
										/*onChange={tags => {
					                    	this.onRowChange({...this.props.inspRow, tags});
										}}
										onNewTag={tag => {
											this.props.addTag(tag);
										}}*/
										tags={this.props.inspRow.tags || []}
										//tagList={this.props.projTags}
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
					                    	this.onRowChange({...this.props.inspRow, tags});
										}}
										onNewTag={tag => {
											this.props.addTag(tag);
										}}
										tags={this.props.inspRow.tags || []}
										tagList={this.props.projTags}
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

const Inspector = (props) => {
	const dispatch = useDispatch();
	const docTree = useSelector(state => state.workspaceReducer.docTree);
	const curInspRow = useSelector(state => state.workspaceReducer.inspectedDocRow);
	const projTags = useSelector(state => state.workspaceReducer.projectTags);
	const inspectorTab = useSelector(state => state.uiReducer.inspectorTab);
	const updateTree = (treeData) => {
		dispatch(updateDocTree({tree: treeData}));
	}
	const addTag = (tag) => {
		dispatch(addProjectTag({tag}));
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
	const setInspTab = (tab) => {
		dispatch(setInspectorTab({tab}));
	}
	if (curInspRow && curInspRow.node) {
		return (
			<InspectorChild 
				inspRow={curInspRow.node}
				replaceInspRow={replaceInspRow}
				projTags={projTags}
				addTag={addTag}
				tab={inspectorTab}
				setTab={setInspTab}
			/>
		);
	} else {
		return (<div />);
	}
}

export default Inspector;