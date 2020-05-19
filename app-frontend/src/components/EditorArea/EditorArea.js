import React from 'react';
import { useSelector } from 'react-redux';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import MainWindow from "./MainWindow";
import SplitWindow from "./SplitWindow";

const EditorArea = (props) => {
	const splitOpen = useSelector(state => state.uiReducer.splitEditorOpen);
	const splitOrientation = useSelector(state => state.uiReducer.splitOrientation);
	return (
		<div 
			id="editor-area-wrapper"
		>
			<SplitterLayout
				percentage={true}
				vertical={splitOrientation === "horizontal"}
				primaryMinSize={20}
				secondaryMinSize={20}
			>
				<MainWindow {...props}/>
			    {splitOpen ? <SplitWindow {...props}/> : null}
			</SplitterLayout>
		</div>
	);
}

export default EditorArea;