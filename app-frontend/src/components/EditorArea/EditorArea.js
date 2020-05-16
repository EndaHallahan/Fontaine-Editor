import React from 'react';
import { useSelector } from 'react-redux'
import Editor from "./Editor";
import Corkboard from "./Corkboard";

const EditorArea = (props) => {
	const editorMode = useSelector(state => state.uiReducer.editorMode);
	switch (editorMode) {
		case "editor":
			return(<Editor {...props}/>);
		case "corkboard":
			return(<Corkboard {...props}/>);
		default:
			return(<Editor {...props}/>);
	}
}

export default EditorArea;