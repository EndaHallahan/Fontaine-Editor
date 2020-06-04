import React from 'react';

import { useSelector, useDispatch } from 'react-redux'; 
import { openModal } from "../../store/slices/modalSlice";
import { saveAllChanges } from "../../store/slices/workspaceSlice";
import { setSetting } from "../../store/slices/settingsSlice";

import { Icon, InlineIcon } from '@iconify/react';
import saveIcon from '@iconify/icons-feather/save';
import check from '@iconify/icons-feather/check';

import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomDropdown from "../CustomDropdown";

import LI from "./LI";

const FileDropdown = (props) => {
	const dispatch = useDispatch();
	const autoSaveEnabled = !useSelector(state => state.settingsReducer.settings.autoSaveDisabled);
	return (
		<CustomDropdown
			title="File"
			dropClass="appbar-dropdown"
		>
			<LI
				title="New Project"
			/>
			<LI
				title="Open Project..."
				shortcut="Ctrl+O"
			/>
			<hr/>
			<LI
				icon={saveIcon}
				title="Save"
				shortcut="Ctrl+S"
				onItemChosen={e => {
					dispatch(saveAllChanges(props.documentInterface));
				}}
			/>
			<LI>Save As...</LI>
			<LI
				icon={autoSaveEnabled ? check : null}
				title="Autosave"
				onItemChosen={e => {
					dispatch(setSetting({setting: "autoSaveDisabled", newValue: autoSaveEnabled}));
				}}
			/>
			<hr/>
			<LI>Compile Settings</LI>
			<LI>Compile...</LI>
		</CustomDropdown>
	);
}

export default FileDropdown;