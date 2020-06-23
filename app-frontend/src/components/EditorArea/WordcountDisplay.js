import React from 'react';
import { useSelector } from 'react-redux';

const WordcountDisplay = (props) => {
	const wordcounts = useSelector(state => state.workspaceReducer.wordcounts);
	let countTotal = 0;
	props.docList.forEach(docId => {
		const wc = wordcounts[docId] || 0;
		countTotal += wc;
	});
	return (
		<span className="wordcount-display">
			{new Intl.NumberFormat().format(countTotal)} words
		</span>
	);
}

export default WordcountDisplay;
