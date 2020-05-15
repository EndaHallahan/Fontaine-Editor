import React from 'react';

import { useDispatch } from 'react-redux'; 
import { openModal } from "../../store/slices/modalSlice";

import { Icon, InlineIcon } from '@iconify/react';
import saveIcon from '@iconify/icons-feather/save';

import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomDropdown from "../CustomDropdown";

import LI from "./LI";

const FileDropdown = (props) => {
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
			/>
			<LI>Save As...</LI>
			<hr/>
			<LI>Compile Settings</LI>
			<LI>Compile...</LI>
		</CustomDropdown>
	);
}

export default FileDropdown;