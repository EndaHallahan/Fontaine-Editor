import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { Icon, InlineIcon } from '@iconify/react';
import check from '@iconify/icons-feather/check';
import toggleRight from '@iconify/icons-feather/toggle-right';

import { toggleRightPanel, toggleLeftPanel } from "../../store/slices/uiSlice";
import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomDropdown from "../CustomDropdown";
import LI from "./LI";

const ViewDropdown = (props) => {
	const dispatch = useDispatch();
	const leftPanelOpen = useSelector(state => state.uiReducer.leftPanelOpen);
	const rightPanelOpen = useSelector(state => state.uiReducer.rightPanelOpen);
	return (
		<CustomDropdown
			title="View"
			dropClass="appbar-dropdown"
		>
			<LI
				icon={leftPanelOpen ? check : null}
				title="Navigator"
				shortcut="Ctrl+Alt+B"
				onItemChosen={e => {
					dispatch(toggleLeftPanel());
				}}
			/>
			<LI
				icon={rightPanelOpen ? check : null}
				title="Inspector"
				shortcut="Ctrl+Alt+D"
				onItemChosen={e => {
					dispatch(toggleRightPanel());
				}}
			/>
			<hr/>
		</CustomDropdown>
	);
}

export default ViewDropdown;