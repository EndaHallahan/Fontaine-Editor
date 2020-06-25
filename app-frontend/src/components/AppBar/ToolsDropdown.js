import React from 'react';

import { useDispatch } from 'react-redux'; 
import { openModal } from "../../store/slices/modalSlice";

//import { Icon } from '@iconify/react';
import settingsIcon from '@iconify/icons-feather/settings';
import targetIcon from '@iconify/icons-feather/target';

import CustomDropdown from "../CustomDropdown";

import LI from "./LI";

const ToolsDropdown = (props) => {
	const dispatch = useDispatch();
	return (
		<CustomDropdown
			title="Tools"
			dropClass="appbar-dropdown"
		>
			<LI
				icon={targetIcon}
				title="Wordcount Goals"
				onItemChosen={e => {
					dispatch(openModal({modalType: "WordcountsModal", modalProps: null}));
				}}
			/>
			<hr/>
			<LI
				icon={settingsIcon}
				title="Settings"
				onItemChosen={e => {
					dispatch(openModal({modalType: "SettingsModal", modalProps: null}));
				}}
			/>
			<LI
				icon={settingsIcon}
				title="Themes"
				onItemChosen={e => {
					dispatch(openModal({modalType: "ThemesModal", modalProps: null}));
				}}
			/>
		</CustomDropdown>
	);
}

export default ToolsDropdown;