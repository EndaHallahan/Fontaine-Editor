import React, { Component } from 'react';

import { Icon, InlineIcon } from '@iconify/react';
import xCircle from '@iconify/icons-feather/x-circle';

import { useSelector, useDispatch } from 'react-redux';
import { setSetting, setSettings, resetDefaults } from "../../store/slices/settingsSlice";

import TabularMenu from "../TabularMenu";
import ColourPicker from "../ColourPicker"; 
import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomModal from "../CustomModal";

import EditorOptions from "./EditorOptions";

const ThemesModal = (props) => {
	const dispatch = useDispatch();
	const currentSettings = useSelector(state => state.settingsReducer.settings);
	const updateSetting = (setting, newValue) => {dispatch(setSetting({setting, newValue}));}
	const updateSettings = (settingsObj) => {dispatch(setSettings({settingsObj}));}
	const resetToDefaults = (settingsObj) => {dispatch(resetDefaults());}
	return (
		<SettingsModalChild
			currentSettings={currentSettings}
			updateSetting={updateSetting}
			updateSettings={updateSettings}
			resetToDefaults={resetToDefaults}
			onRequestClose={props.onRequestClose}
		/>
	);
}

class SettingsModalChild extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render() {
		return(
			<CustomModal
				modalClass="medium tall"
				onRequestClose={this.props.onRequestClose}
	          	onAfterOpen={this.props.afterOpenModal}
	          	contentLabel="Themes and Customization Popup"
	          	title="Themes and Customization"
	        >
	       		<TabularMenu
	       			startTab={1}
	       			windows={[
	       				{tabName:"Themes", render: () => 
	       					<div>
	       						Themes
	       					</div>
	       				},
	       				{tabName:"Interface", render: () => 
	       					<div>
	       						Interface
	       					</div>
	       				},
	       				{tabName:"Editor", render: () => 
	       					<EditorOptions 
	       						{...this.props}
	       					/>
	       				},
	       			]}
	       		/>
	        </CustomModal>
		);
	}
}

export default ThemesModal;