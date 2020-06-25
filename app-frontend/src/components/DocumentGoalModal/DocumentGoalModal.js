import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { find, changeNodeAtPath } from 'react-sortable-tree';

import { 
	updateDocTree,
	setManuscriptGoal,
	setSessionGoal,
	resetSessionGoal,
} from "../../store/slices/workspaceSlice";
import { Input } from "../StatefulInputs"; 
import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomSubwindow from "../CustomSubwindow";

const DocumentGoalModal = (props) => {
	const dispatch = useDispatch();
	const docTree = useSelector(state => state.workspaceReducer.docTree);
	const wordcounts = useSelector(state => state.workspaceReducer.wordcounts);

	const selRow = find({
		getNodeKey: ({treeIndex}) => {return treeIndex;},
		treeData: docTree,
		searchMethod: (rowData) => {return(rowData.node.id === props.docId)},
		ignoreCollapsed: false
	}).matches[0];

	let countTotal = 0;
	/*curDocList.forEach(docId => {
		const wc = wordcounts[docId] || 0;
		countTotal += wc;
	});*/

	const updateTree = (treeData) => {
		dispatch(updateDocTree(treeData, props.documentInterface));
	}

	const replaceCurRow = (newRow) => {
		let modifiedTree = changeNodeAtPath({
			treeData: docTree,
			path: selRow.path,
			getNodeKey: ({treeIndex}) => {return treeIndex;},
			newNode: newRow
		});
		updateTree(modifiedTree);
	}
	
	return (
		<CustomSubwindow
			modalClass="small"
			onRequestClose={props.onRequestClose}
          	onAfterOpen={props.afterOpenModal}
          	contentLabel="Document Goal Popup"
          	title="Document Goal"
          	style={{
          		width: "15rem",
          		height: "5rem",
          	}}
        >
        	<div class="wordcounts-modal">
	        	<div>
        			<div>
	        			<Input
		        			type="number"
							value={selRow.node.wordcountGoal || 0}
							onChange={(e) => {
								let val = e.target.value;
								if (val >= 0) {
									let newRow = {...selRow.node, wordcountGoal: val};
									replaceCurRow(newRow);
								}
							}}
						/> words
					</div>
				</div>
        	</div>
        </CustomSubwindow>
	);
}

export default DocumentGoalModal;