import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import targetIcon from '@iconify/icons-feather/target';


import { openModal } from "../../store/slices/modalSlice";
import KeyboardFocusableButton from "../KeyboardFocusableButton";

const WordcountDisplay = (props) => {
	const dispatch = useDispatch();
	const wordcounts = useSelector(state => state.workspaceReducer.wordcounts);
	const curDocRow = props.curDocRow;
	//useSelector(state => props.split ? state.workspaceReducer.splitDocRow : state.workspaceReducer.curDocRow)

	const openWordcountsModal = () => {
		dispatch(openModal({modalType: "WordcountsModal", modalProps: null}));
	}
	const openDocumentGoalModal = () => {
		dispatch(openModal({modalType: "DocumentGoalModal", modalProps: {docId: curDocRow.node.id}}));
	}

	const docGoal = curDocRow ? curDocRow.node.wordcountGoal : null;
	let countTotal = 0;
	props.docList.forEach(docId => {
		const wc = wordcounts[docId] || 0;
		countTotal += wc;
	});
	return (
		<span className="wordcount-display">
			<KeyboardFocusableButton
				onClick={openWordcountsModal}
				title="Project Goals"
			>
				<Icon icon={targetIcon} />
			</KeyboardFocusableButton>
			<KeyboardFocusableButton
				onClick={openDocumentGoalModal}
				title="Document Goal"
			>
				<span>
					{new Intl.NumberFormat().format(countTotal)}{
						docGoal ? " / " + Intl.NumberFormat().format(docGoal) : null
					} words
				</span>
			</KeyboardFocusableButton>
		</span>
	);
}

export default WordcountDisplay;
