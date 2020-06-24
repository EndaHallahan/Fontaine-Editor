import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeNodeAtPath } from 'react-sortable-tree';

import { 
	updateDocTree,
	setManuscriptGoal,
	setSessionGoal,
	resetSessionGoal,
} from "../../store/slices/workspaceSlice";
import { Input } from "../StatefulInputs"; 
import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomSubwindow from "../CustomSubwindow";

const WordcountsModal = (props) => {
	const dispatch = useDispatch();
	const curDocList = useSelector(state => state.workspaceReducer.curDocList);
	const docTree = useSelector(state => state.workspaceReducer.docTree);
	const curDocRow = useSelector(state => state.workspaceReducer.curDocRow);
	const wordcounts = useSelector(state => state.workspaceReducer.wordcounts);
	const manuscriptGoal = useSelector(state => state.workspaceReducer.manuscriptGoal);
	const sessionGoal = useSelector(state => state.workspaceReducer.sessionGoal);

	let countTotal = 0;
	curDocList.forEach(docId => {
		const wc = wordcounts[docId] || 0;
		countTotal += wc;
	});

	let manuscriptTotal = Object.values(wordcounts).reduce((a, b) => a + b, 0);

	const updateTree = (treeData) => {
		dispatch(updateDocTree(treeData, props.documentInterface));
	}

	const updateManuscriptGoal = (wordcount) => {
		dispatch(setManuscriptGoal({wordcount}));
	}

	const updateSessionGoal = (wordcount) => {
		dispatch(setSessionGoal({wordcount}));
	}

	const resetSession = () => {
		dispatch(resetSessionGoal({totalcount: manuscriptTotal}));
	}

	const replaceCurRow = (newRow) => {
		let modifiedTree = changeNodeAtPath({
			treeData: docTree,
			path: curDocRow.path,
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
          	contentLabel="Wordcount Goals Popup"
          	title="Goals"
          	style={{
          		width: "20rem",
          		height: "auto",
          	}}
        >
        	<div class="wordcounts-modal">
        		<div>
	        		<label className="inline">
	        		Session:
		        		<Input
		        			type="number"
							value={sessionGoal.goal || 0}
							onChange={(e) => {
								let val = e.target.value;
								if (val >= 0) {
									updateSessionGoal(val);
								}
							}}
						/>
					</label>
					<KeyboardFocusableButton 
		       			onClick={resetSession}
		       		>Reset</KeyboardFocusableButton>
					<progress value={
						sessionGoal.goal
						? (manuscriptTotal - sessionGoal.start) / sessionGoal.goal
						: 0
					} />
				</div>
	        	<div>
	        		<label className="inline">
	        		Document:
		        		<Input
		        			type="number"
							value={curDocRow.node.wordcountGoal || 0}
							onChange={(e) => {
								let val = e.target.value;
								if (val >= 0) {
									let newRow = {...curDocRow.node, wordcountGoal: val};
									replaceCurRow(newRow);
								}
							}}
						/>
					</label>
					<progress value={
						curDocRow.node.wordcountGoal
						? countTotal / curDocRow.node.wordcountGoal
						: 0
					} />
				</div>
				<div>
	        		<label className="inline">
	        		Manuscript:
		        		<Input
		        			type="number"
							value={manuscriptGoal || 0}
							onChange={(e) => {
								let val = e.target.value;
								if (val >= 0) {
									updateManuscriptGoal(val);
								}
							}}
						/>
					</label>
					<progress value={
						manuscriptGoal
						? manuscriptTotal / manuscriptGoal
						: 0
					} />
				</div>
        	</div>
        </CustomSubwindow>
	);
}

export default WordcountsModal;