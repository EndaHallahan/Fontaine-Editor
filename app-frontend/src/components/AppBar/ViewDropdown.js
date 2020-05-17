import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { Icon, InlineIcon } from '@iconify/react';
import check from '@iconify/icons-feather/check';
import toggleRight from '@iconify/icons-feather/toggle-right';

import { 
	toggleRightPanel, 
	toggleLeftPanel,
	toggleSplitEditor,
} from "../../store/slices/uiSlice";
import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomDropdown from "../CustomDropdown";
import LI from "./LI";

const ViewDropdown = (props) => {
	const dispatch = useDispatch();
	const leftPanelOpen = useSelector(state => state.uiReducer.leftPanelOpen);
	const rightPanelOpen = useSelector(state => state.uiReducer.rightPanelOpen);
	const splitEditorOpen = useSelector(state => state.uiReducer.splitEditorOpen);
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
			<LI
				icon={splitEditorOpen ? check : null}
				title="Split Editor"
				shortcut="Ctrl+Alt+S"
				onItemChosen={e => {
					dispatch(toggleSplitEditor());
				}}
			/>
			<hr/>
		</CustomDropdown>
	);
}

export default ViewDropdown;