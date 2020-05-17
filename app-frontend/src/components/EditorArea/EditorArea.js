import React from 'react';
import { useSelector } from 'react-redux';

import MainWindow from "./MainWindow";
import SplitWindow from "./SplitWindow";


const EditorArea = (props) => {
	return (
		<div id="editor-area-wrapper">
			<MainWindow {...props}/>
			<SplitWindow {...props}/>
		</div>
	);
}

export default EditorArea;