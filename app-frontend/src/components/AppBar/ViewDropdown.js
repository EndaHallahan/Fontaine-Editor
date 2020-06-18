import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import check from '@iconify/icons-feather/check';
import layoutIcon from '@iconify/icons-feather/layout';
import maximizeIcon from '@iconify/icons-feather/maximize';

import { 
	toggleRightPanel, 
	toggleLeftPanel,
	toggleSplitEditor,
	toggleSplitOrientation,
	setDistractionFree,
} from "../../store/slices/uiSlice";
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
			<hr />
			<LI
				icon={splitEditorOpen ? check : null}
				title="Split Editor"
				shortcut="Ctrl+Alt+S"
				onItemChosen={e => {
					dispatch(toggleSplitEditor());
				}}
			/>
			<LI
				icon={layoutIcon}
				title="Split Orientation"
				shortcut="Ctrl+'"
				onItemChosen={e => {
					dispatch(toggleSplitOrientation());
				}}
			/>
			<hr/>
			<LI
				icon={maximizeIcon}
				title="Distraction-Free Mode"
				shortcut="Alt+F11"
				onItemChosen={e => {
					dispatch(setDistractionFree({open: true}));
				}}
			/>
		</CustomDropdown>
	);
}

export default ViewDropdown;