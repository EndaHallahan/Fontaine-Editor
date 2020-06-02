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
import { 
	saveAllChanges 
} from "../store/slices/workspaceSlice";

configure({
	ignoreEventsCondition: () => false
})

const ShortcutHandler = (props) => {
	const dispatch = useDispatch();
	const defKeyMap = {
		OPEN_EDITOR: "ctrl+1",
		OPEN_CORKBOARD: "ctrl+2",
		OPEN_OVERVIEW: "ctrl+3",
		OPEN_STORY_MAP: "ctrl+4",
		TOGGLE_NAVIGATOR: "ctrl+alt+b",
		TOGGLE_INSPECTOR: "ctrl+alt+d",
		TOGGLE_SPLIT_EDITOR: "ctrl+alt+s",
		TOGGLE_SPLIT_ORIENTATION: "ctrl+'",
		OPEN_DISTRACTION_FREE: "alt+f11",

		SAVE: "ctrl+s",
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
		OPEN_OVERVIEW: e => {
			e.preventDefault();
			dispatch(setEditorMode({mode: "overview"}));
		},
		OPEN_STORY_MAP: e => {
			e.preventDefault();
			dispatch(setEditorMode({mode: "storymap"}));
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
		SAVE: e => {
			e.preventDefault();
			dispatch(saveAllChanges(props.documentInterface));
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