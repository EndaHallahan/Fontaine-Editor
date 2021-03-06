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
			//modalClass="small"
			onRequestClose={props.onRequestClose}
          	onAfterOpen={props.afterOpenModal}
          	contentLabel="Wordcount Goals Popup"
          	title="Wordcount Goals"
          	style={{
          		width: "20rem",
          		height: "14rem",
          	}}
        >
        	<div class="wordcounts-modal">
        		<div>
	        		Manuscript:
	        		<div>
		        		{manuscriptTotal} of <Input
		        			type="number"
							value={manuscriptGoal || 0}
							onChange={(e) => {
								let val = e.target.value;
								if (val >= 0) {
									updateManuscriptGoal(val);
								}
							}}
						/> words
					</div>
					<progress value={
						manuscriptGoal
						? manuscriptTotal / manuscriptGoal
						: 0
					} />
				</div>
        		<div>
	        		Session:
		       		<div>
		        		{manuscriptTotal - sessionGoal.start} of <Input
		        			type="number"
							value={sessionGoal.goal || 0}
							onChange={(e) => {
								let val = e.target.value;
								if (val >= 0) {
									updateSessionGoal(val);
								}
							}}
						/> words
					</div>
					<progress value={
						sessionGoal.goal
						? (manuscriptTotal - sessionGoal.start) / sessionGoal.goal
						: 0
					} />
					<KeyboardFocusableButton 
		       			onClick={resetSession}
		       			className="border"
		       		>Reset Session</KeyboardFocusableButton>
				</div>
        	</div>
        </CustomSubwindow>
	);
}

export default WordcountsModal;