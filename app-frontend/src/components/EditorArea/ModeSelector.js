import React from "react";
import { useSelector, useDispatch } from 'react-redux';
//import { MenuItem } from "react-menu-list";
import { Icon } from '@iconify/react';
import gridIcon from '@iconify/icons-feather/grid';
import edit3 from '@iconify/icons-feather/edit-3';
import serverIcon from '@iconify/icons-feather/server';
import mapIcon from '@iconify/icons-feather/map';



//import CustomDropdown from "../CustomDropdown";
import { setEditorMode, setSplitEditorMode } from "../../store/slices/uiSlice";
import KeyboardFocusableButton from "../KeyboardFocusableButton";

const ModeSelector = (props) => {
	const dispatch = useDispatch();

	const mainEditorMode = useSelector(state => state.uiReducer.editorMode);
	const changeMainEditorMode = (mode) => dispatch(setEditorMode({mode}));

	const splitEditorMode = useSelector(state => state.uiReducer.splitEditorMode);
	const changeSplitEditorMode = (mode) => dispatch(setSplitEditorMode({mode}));

	let editorMode;
	let changeEditorMode;
	if (!props.split) {
		 editorMode = mainEditorMode;
		 changeEditorMode = changeMainEditorMode;
	} else {
		 editorMode = splitEditorMode;
		 changeEditorMode = changeSplitEditorMode;
	}
	
	/*let curModeIcon; 
	switch(editorMode) {
		case "editor":
			curModeIcon = (<Icon icon={edit3} />);
			break;
		case "corkboard":
			curModeIcon = (<Icon icon={gridIcon} />);
			break;
		case "overview":
			curModeIcon = (<Icon icon={serverIcon} />);
			break;
		case "storymap":
			curModeIcon = (<Icon icon={mapIcon} />);
			break;
		default:
			curModeIcon = (<Icon icon={edit3} />);
	}*/
	
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
			<KeyboardFocusableButton
				onClick={()=>changeEditorMode("overview")}
				title="Overview (Ctrl+3)"
				className={editorMode === "overview" ? "active" : null}
			><Icon icon={serverIcon} /></KeyboardFocusableButton>
			<KeyboardFocusableButton
				onClick={()=>changeEditorMode("storymap")}
				title="Story Map (Ctrl+4)"
				className={editorMode === "storymap" ? "active" : null}
			><Icon icon={mapIcon} /></KeyboardFocusableButton>
		</span>
	);
}

export default ModeSelector;