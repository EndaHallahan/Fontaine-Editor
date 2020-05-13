import React from 'react';

import { useDispatch } from 'react-redux'; 
import { openModal } from "../../store/slices/modalSlice";

import { Icon, InlineIcon } from '@iconify/react';
import saveIcon from '@iconify/icons-feather/save';

import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomDropdown from "../CustomDropdown";

import LI from "./LI";

const ViewDropdown = (props) => {
	return (
		<CustomDropdown
			title="View"
			dropClass="appbar-dropdown"
		>
			<LI>New Project</LI>
			<LI>Open...</LI>
			<hr/>
			<LI>Save</LI>
			<LI>Save As...</LI>
			<hr/>
			<LI>Compile Settings</LI>
			<LI>Compile...</LI>
		</CustomDropdown>
	);
}

export default ViewDropdown;