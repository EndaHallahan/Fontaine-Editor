import React from 'react';
import { GlobalHotKeys, configure } from "react-hotkeys";
import { useDispatch } from 'react-redux';

import { 
	setEditorMode, 
	toggleLeftPanel,
	toggleRightPanel,
	toggleSplitEditor,
	toggleSplitOrientation,
	toggleDistractionFree,
} from "../store/slices/uiSlice";

configure({
	ignoreEventsCondition: () => false
})

const ShortcutHandler = (props) => {
	const dispatch = useDispatch();
	const defKeyMap = {
		OPEN_EDITOR: "ctrl+1",
		OPEN_CORKBOARD: "ctrl+2",
		TOGGLE_NAVIGATOR: "ctrl+alt+b",
		TOGGLE_INSPECTOR: "ctrl+alt+d",
		TOGGLE_SPLIT_EDITOR: "ctrl+alt+s",
		TOGGLE_SPLIT_ORIENTATION: "ctrl+'",
		OPEN_DISTRACTION_FREE: "alt+f11",
	}
	const defHandlers = {
		OPEN_EDITOR: e => {
			e.preventDefault();
			dispatch(setEditorMode({mode: "editor"}));
		},
		OPEN_CORKBOARD: e => {
			e.preventDefault();
			dispatch(setEditorMode({mode: "corkboard"}));
		},
		TOGGLE_NAVIGATOR: e => {
			e.preventDefault();
			dispatch(toggleLeftPanel());
		},
		TOGGLE_INSPECTOR: e => {
			e.preventDefault();
			dispatch(toggleRightPanel());
		},
		TOGGLE_SPLIT_EDITOR: e => {
			e.preventDefault();
			dispatch(toggleSplitEditor());
		},
		TOGGLE_SPLIT_ORIENTATION: e => {
			e.preventDefault();
			dispatch(toggleSplitOrientation());
		},
		OPEN_DISTRACTION_FREE: e => {
			e.preventDefault();
			dispatch(toggleDistractionFree()); 
		},
	}

	return (
		<div>
		<GlobalHotKeys 
			keyMap={defKeyMap} 
			handlers={defHandlers} 
			allowChanges={false} 
		/>
		</div>
	);
}

export default ShortcutHandler;