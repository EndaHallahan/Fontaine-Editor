import React, { Component } from "react";
//import { useSelector, useDispatch } from 'react-redux';

import ModeSelector from "./ModeSelector";

const EditorFooter = (props) => {
	return(
		<div className="editor-area-footer editor-footer">
			<span></span>
			<span></span>
			<span><ModeSelector /></span>
		</div>
	);
}

export default EditorFooter;