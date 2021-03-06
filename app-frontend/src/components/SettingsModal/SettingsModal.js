import React, { Component } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setSetting, setSettings, resetDefaults } from "../../store/slices/settingsSlice";

import TabularMenu from "../TabularMenu";
import CustomModal from "../CustomModal";

const SettingsModal = (props) => {
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
	          	contentLabel="Settings Popup"
	          	title="Settings and Customization"
	        >
	       		<TabularMenu
	       			startTab={0}
	       			windows={[
	       				{tabName:"General", render: () => 
	       					<div>
	       						General Tab 
	       					</div>
	       				},
	       			]}
	       		/>
	        </CustomModal>
		);
	}
}

export default SettingsModal;