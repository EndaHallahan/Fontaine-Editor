import React from 'react';
import { GlobalHotKeys, configure } from "react-hotkeys";
import { useDispatch } from 'react-redux';

import { setMode } from "../store/slices/editorAreaSlice";

configure({
	ignoreEventsCondition: () => false
})

const ShortcutHandler = (props) => {
	const dispatch = useDispatch();
	const defKeyMap = {
		OPEN_EDITOR: "ctrl+1",
		OPEN_CORKBOARD: "ctrl+2",
	}
	const defHandlers = {
		OPEN_EDITOR: e => {
			e.preventDefault();
			dispatch(setMode({mode: "editor"}));
		},
		OPEN_CORKBOARD: e => {
			e.preventDefault();
			dispatch(setMode({mode: "corkboard"}));
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