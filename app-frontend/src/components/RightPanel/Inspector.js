import React, { Component, Fragment } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { changeNodeAtPath } from 'react-sortable-tree';
import { v4 as uuidv4 } from "uuid";
import { Icon, InlineIcon } from '@iconify/react';
import tagIcon from '@iconify/icons-feather/tag';
import infoIcon from '@iconify/icons-feather/info';
import gitCommit from '@iconify/icons-feather/git-commit';
import editIcon from '@iconify/icons-feather/edit';

import { 
	updateDocTree,
	addProjectTag,
	addProjectThread,
} from "../../store/slices/workspaceSlice";
import { 
	setInspectorTab,
} from "../../store/slices/uiSlice";
import { openModal } from "../../store/slices/modalSlice";
import { TextArea, Select } from "../StatefulInputs";
import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CollapsableDiv from "../CollapsableDiv";
import TabularMenu from "../TabularMenu";
import Tagger from "./Tagger";
import MetaTagTable from "./MetaTagTable";
import ThreadsEditor from "./ThreadsEditor";

class InspectorChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
		this.onRowChange = this.onRowChange.bind(this);
	}
	onRowChange(newRow) {
		console.log(newRow)
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
									defaultOpen={true}
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
									<label>
										Include in compile
										<input 
											type="checkbox" 
											checked={!this.props.inspRow.ignore}
											onChange={e => {
												const ignore = !e.target.checked;
						                    	this.onRowChange({...this.props.inspRow, ignore});
											}}
										/>
									</label>
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
									defaultOpen={true}
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
	       						<div className="header">Tags</div>
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
	       					</Fragment>
	       				},
	       				{tabName:(<InlineIcon icon={gitCommit} />), render: () => 
	       					<Fragment>
	       						<div className="header">Threads 
	       							<span className="right">
	       								<KeyboardFocusableButton
											onClick={this.props.openThreadsModal}
											title="Edit Threads"
										><Icon icon={editIcon} /></KeyboardFocusableButton>
	       							</span>
	       						</div>
								<ThreadsEditor 
									onChange={threads => {
										this.onRowChange({...this.props.inspRow, threads});
									}}
									onNewThread={thread => {
										this.props.addThread(thread);
									}}
									threads={this.props.inspRow.threads || []}
									threadList={this.props.threads}
								/>
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
	const threads = useSelector(state => state.workspaceReducer.threads);
	const inspectorTab = useSelector(state => state.uiReducer.inspectorTab);
	const updateTree = (treeData) => {
		dispatch(updateDocTree(treeData, props.documentInterface));
	}
	const addTag = (tag) => {
		dispatch(addProjectTag({tag}));
	}
	const addThread = (thread) => {
		const id = uuidv4();
		dispatch(addProjectThread({thread, id}));
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
	const openThreadsModal = () => {
		dispatch(openModal({modalType: "ThreadsModal", modalProps: null}));
	}
	if (curInspRow && curInspRow.node) {
		return (
			<InspectorChild 
				inspRow={curInspRow.node}
				replaceInspRow={replaceInspRow}
				projTags={projTags}
				addTag={addTag}
				threads={threads}
				addThread={addThread}
				tab={inspectorTab}
				setTab={setInspTab}
				openThreadsModal={openThreadsModal}
			/>
		);
	} else {
		return (<div />);
	}
}

export default Inspector;