import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { openModal } from "../../store/slices/modalSlice";
import KeyboardFocusableButton from "../KeyboardFocusableButton";

const WordcountDisplay = (props) => {
	const dispatch = useDispatch();
	const wordcounts = useSelector(state => state.workspaceReducer.wordcounts);
	const curDocRow = props.split 
		? useSelector(state => state.workspaceReducer.splitDocRow)
		: useSelector(state => state.workspaceReducer.curDocRow);

	const openWordcountsModal = () => {
		dispatch(openModal({modalType: "WordcountsModal", modalProps: null}));
	}

	const docGoal = curDocRow ? curDocRow.node.wordcountGoal : null;
	let countTotal = 0;
	props.docList.forEach(docId => {
		const wc = wordcounts[docId] || 0;
		countTotal += wc;
	});
	return (
		<KeyboardFocusableButton
			onClick={openWordcountsModal}
			title="Wordcount Goals"
		>
			<span className="wordcount-display">
				{new Intl.NumberFormat().format(countTotal)}{
					docGoal ? " / " + Intl.NumberFormat().format(docGoal) : null
				} words
			</span>
		</KeyboardFocusableButton>
		
	);
}

export default WordcountDisplay;
