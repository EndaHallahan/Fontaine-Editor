import React, { Component, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setMode } from "../store/slices/editorAreaSlice";

const AppToolbar = (props) => {
	const dispatch = useDispatch();
	const editorMode = useSelector(state => state.editorAreaReducer.mode);
	const changeEditorMode = (mode) => dispatch(setMode({mode}));
	return(
		<AppToolbarChild 
			changeEditorMode={changeEditorMode}
		/>
	);
}

class AppToolbarChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			freeForm: false,
		}
	}
	render() {
		return (
			<div id="app-toolbar">
				<button
					onClick={()=>this.props.changeEditorMode("editor")}
				>Editor</button>
				<button
					onClick={()=>this.props.changeEditorMode("corkboard")}
				>Corkboard</button>
			</div>
		);
	}
}

export default AppToolbar;