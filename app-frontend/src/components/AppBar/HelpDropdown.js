import React from 'react';

import { useDispatch } from 'react-redux'; 
import { openModal } from "../../store/slices/modalSlice";

import { Icon, InlineIcon } from '@iconify/react';
import settingsIcon from '@iconify/icons-feather/settings';

import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomDropdown from "../CustomDropdown";

import LI from "./LI";

const HelpDropdown = (props) => {
	return (
		<CustomDropdown
			title="Help"
			dropClass="appbar-dropdown"
		>
			<LI>About Fontaine</LI>
		</CustomDropdown>
	);
}

export default HelpDropdown;