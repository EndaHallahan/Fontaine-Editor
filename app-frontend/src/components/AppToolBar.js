import React, { Component, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Icon, InlineIcon } from '@iconify/react';
import gridIcon from '@iconify/icons-feather/grid';
import fileText from '@iconify/icons-feather/file-text';
import edit3 from '@iconify/icons-feather/edit-3';

import { setEditorMode } from "../store/slices/uiSlice";
import KeyboardFocusableButton from "./KeyboardFocusableButton";

const AppToolbar = (props) => {
	const dispatch = useDispatch();
	const editorMode = useSelector(state => state.uiReducer.editorMode);
	const changeEditorMode = (mode) => dispatch(setEditorMode({mode}));
	return(
		<AppToolbarChild 
			editorMode={editorMode}
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
				<span>
					
				</span>
				
				<span>
					<span className="editor-mode">
						<KeyboardFocusableButton
							onClick={()=>this.props.changeEditorMode("editor")}
							title="Editor (Ctrl+1)"
							className={this.props.editorMode === "editor" ? "active" : null}
						><Icon icon={edit3} /></KeyboardFocusableButton>
						<KeyboardFocusableButton
							onClick={()=>this.props.changeEditorMode("corkboard")}
							title="Corkboard (Ctrl+2)"
							className={this.props.editorMode === "corkboard" ? "active" : null}
						><Icon icon={gridIcon} /></KeyboardFocusableButton>
					</span>
				</span>

				<span>
					
				</span>
			</div>
		);
	}
}

export default AppToolbar;