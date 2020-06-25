import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';

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
	const wordcounts = useSelector(state => state.workspaceReducer.wordcounts);
	const manuscriptGoal = useSelector(state => state.workspaceReducer.manuscriptGoal);
	const sessionGoal = useSelector(state => state.workspaceReducer.sessionGoal);

	let manuscriptTotal = Object.values(wordcounts).reduce((a, b) => a + b, 0);

	const updateManuscriptGoal = (wordcount) => {
		dispatch(setManuscriptGoal({wordcount}));
	}

	const updateSessionGoal = (wordcount) => {
		dispatch(setSessionGoal({wordcount}));
	}

	const resetSession = () => {
		dispatch(resetSessionGoal({totalcount: manuscriptTotal}));
	}
	
	return (
		<CustomSubwindow
			modalClass="small"
			onRequestClose={props.onRequestClose}
          	onAfterOpen={props.afterOpenModal}
          	contentLabel="Project Goals Popup"
          	title="Project Goals"
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