import React from 'react';
import { useSelector } from 'react-redux';

import MainWindow from "./MainWindow";
import SplitWindow from "./SplitWindow";


const EditorArea = (props) => {
	const splitOrientation = useSelector(state => state.uiReducer.splitOrientation);
	return (
		<div 
			id="editor-area-wrapper" 
			className={splitOrientation === "horizontal" ? "split-horizontal" : null}
		>
			<MainWindow {...props}/>
			<SplitWindow {...props}/>
		</div>
	);
}

export default EditorArea;