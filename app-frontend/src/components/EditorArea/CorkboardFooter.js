import React, { Component } from "react";
//import { useSelector, useDispatch } from 'react-redux';

import ModeSelector from "./ModeSelector";

const CorkboardFooter = (props) => {
	return(
		<div className="editor-area-footer corkboard-footer">
			<span></span>
			<span></span>
			<span><ModeSelector split={props.split}/></span>
		</div>
	);
}

export default CorkboardFooter;