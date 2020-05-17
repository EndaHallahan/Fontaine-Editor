import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { MenuItem } from "react-menu-list";
import { Icon, InlineIcon } from '@iconify/react';
import gridIcon from '@iconify/icons-feather/grid';
import edit3 from '@iconify/icons-feather/edit-3';

import CustomDropdown from "../CustomDropdown";
import { setEditorMode } from "../../store/slices/uiSlice";
import KeyboardFocusableButton from "../KeyboardFocusableButton";

const ModeSelector = (props) => {
	const dispatch = useDispatch();
	const editorMode = useSelector(state => state.uiReducer.editorMode);
	const changeEditorMode = (mode) => dispatch(setEditorMode({mode}));
	let curModeIcon; 
	console.log("mode:", editorMode)
	switch(editorMode) {
		case "editor":
			curModeIcon = (<Icon icon={edit3} />);
			break;
		case "corkboard":
			curModeIcon = (<Icon icon={gridIcon} />);
			break;
		default:
			curModeIcon = (<Icon icon={edit3} />);
	}
	
	return(
		/*<CustomDropdown
			title={curModeIcon}
			dropClass="mode-selector-dropdown"
			className="mode-selector"
		>
			<MenuItem
		    	className="dropdown-menu-item"
		    	highlightedClassName="highlighted"
		    	onItemChosen={() => changeEditorMode("editor")}
			    //{...props}
		    >
		    	<Icon icon={edit3} /> <span>Editor</span>
			</MenuItem>
			<MenuItem
		    	className="dropdown-menu-item"
		    	highlightedClassName="highlighted"
		    	onItemChosen={() => changeEditorMode("corkboard")}
			    //{...props}
		    >
		    	<Icon icon={gridIcon} /> <span>Corkboard</span>
			</MenuItem>
		</CustomDropdown>*/
		<span className="editor-mode">
			<KeyboardFocusableButton
				onClick={()=>changeEditorMode("editor")}
				title="Editor (Ctrl+1)"
				className={editorMode === "editor" ? "active" : null}
			><Icon icon={edit3} /></KeyboardFocusableButton>
			<KeyboardFocusableButton
				onClick={()=>changeEditorMode("corkboard")}
				title="Corkboard (Ctrl+2)"
				className={editorMode === "corkboard" ? "active" : null}
			><Icon icon={gridIcon} /></KeyboardFocusableButton>
		</span>
	);
}

export default ModeSelector;