import React, { Component } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setSetting, setSettings, resetDefaults } from "../../store/slices/settingsSlice";
import { Icon, InlineIcon } from '@iconify/react';
import zoomOut from '@iconify/icons-feather/zoom-out';
import zoomIn from '@iconify/icons-feather/zoom-in';

import ModeSelector from "./ModeSelector";

const StoryMapFooter = (props) => {
	const dispatch = useDispatch();
	const currentSettings = useSelector(state => state.settingsReducer.settings);
	const updateSetting = (setting, newValue) => {dispatch(setSetting({setting, newValue}));}

	return(
		<div className="editor-area-footer story-map-footer">
			<span>
				<Icon icon={zoomOut} />
				<input 
					type="range" 
					min="2" 
					max="10" 
					defaultValue={currentSettings.storyMapZoom}
					onChange={(e) => {updateSetting("storyMapZoom", e.target.value)}}
				/>
				<Icon icon={zoomIn} />
			</span>
			<span></span>
			<span><ModeSelector split={props.split}/></span>
		</div>
	);
}

export default StoryMapFooter;