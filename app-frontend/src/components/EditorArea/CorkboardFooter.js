import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setSetting } from "../../store/slices/settingsSlice";
import { Icon } from '@iconify/react';
import zoomOut from '@iconify/icons-feather/zoom-out';
import zoomIn from '@iconify/icons-feather/zoom-in';


import ModeSelector from "./ModeSelector";

const CorkboardFooter = (props) => {
	const dispatch = useDispatch();
	const currentSettings = useSelector(state => state.settingsReducer.settings);
	const updateSetting = (setting, newValue) => {dispatch(setSetting({setting, newValue}));}

	return(
		<div className="editor-area-footer corkboard-footer">
			<span>
				<Icon icon={zoomOut} />
				<input 
					type="range" 
					min="5" 
					max="25" 
					defaultValue={currentSettings.corkBoardZoom}
					onChange={(e) => {updateSetting("corkBoardZoom", e.target.value)}}
				/>
				<Icon icon={zoomIn} />
			</span>
			<span></span>
			<span><ModeSelector split={props.split}/></span>
		</div>
	);
}

export default CorkboardFooter;