import React, { Component } from 'react';
import KeyboardFocusableButton from "./KeyboardFocusableButton";
import Modal from 'react-modal';

import { Icon, InlineIcon } from '@iconify/react';
import xCircle from '@iconify/icons-feather/x-circle';

import { useSelector, useDispatch } from 'react-redux';
import { setSetting, setSettings, resetDefaults } from "../store/slices/settingsSlice";

import VerticalTabularMenu from "./VerticalTabularMenu";
import ColourPicker from "./ColourPicker";

Modal.setAppElement('#root');

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

class EditorOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pendingChanges: {},
			areChanges: false
		}
		this.changeSetting = this.changeSetting.bind(this);
		this.setChanges = this.setChanges.bind(this);
		this.resetChanges = this.resetChanges.bind(this);
		this.resetToDefaults = this.resetToDefaults.bind(this);
	}
	changeSetting(setting, value) {
		this.setState({
			...this.state,
			areChanges: true,
			pendingChanges: {
				...this.state.pendingChanges,
				[setting]: value
			}
		})
	}
	setChanges() {
		this.props.updateSettings(this.state.pendingChanges);
		this.setState({
			...this.state,
			areChanges: false,
			pendingChanges: {}
		})
	}
	resetChanges() {
		this.setState({
			...this.state,
			areChanges: false,
			pendingChanges: {}
		})
	}
	resetToDefaults() {
		this.props.resetToDefaults();
		this.resetChanges();
	}
	render() {
		console.log(this.state.pendingChanges)
		return (
			<div className="editor-settings-tab">
				<div 
					className="editor-preview"
					style={{
						backgroundColor: this.state.pendingChanges.editorContainerColour
					}}
				>
					<div
						style={{
							backgroundColor: this.state.pendingChanges.editorBackgroundColour,
							color: this.state.pendingChanges.editorTextColour,
							boxShadow: this.state.pendingChanges.editorDropShadow !== undefined 
								? this.state.pendingChanges.editorDropShadow ? "10px 10px 8px black" 
									: "none"
								: null,

						}}
					>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia porttitor erat vel luctus. Maecenas eleifend turpis sed eros convallis lobortis.</p>
						<p>Sed commodo mattis imperdiet. Curabitur tincidunt ac turpis sit amet vestibulum. Nunc elementum rhoncus arcu eu pretium. Nulla dapibus nibh rhoncus est hendrerit, nec ornare neque rhoncus. Nunc vulputate commodo semper. Morbi mattis euismod neque vel venenatis. Ut pulvinar enim ac tortor eleifend ultricies.</p>
						<p> Nunc varius ut urna a fermentum. Nullam vitae pharetra lectus. Quisque porta, metus sit amet aliquam vulputate, ex nulla sollicitudin dolor, sed imperdiet diam dui et diam. Mauris convallis, sapien ut consectetur scelerisque, elit mauris finibus metus, non placerat elit est ut neque.</p>
					</div>
				</div>
				<div className="options-list">

					<div>
						<span>Paper Colour</span>
						<ColourPicker
							className="open-reverse"
							colour={
								this.state.pendingChanges.editorBackgroundColour 
								|| this.props.currentSettings.editorBackgroundColour
								|| "#ffffff"
							}
							onColourChange={(color) => {
								this.changeSetting("editorBackgroundColour", color.hex);
							}}
							disableAlpha={true}
						/>
					</div>

					<div>
						<span>Background Colour</span>
						<ColourPicker
							className="open-reverse"
							colour={
								this.state.pendingChanges.editorContainerColour 
								|| this.props.currentSettings.editorContainerColour
								|| "#555555"
							}
							onColourChange={(color) => {
								this.changeSetting("editorContainerColour", color.hex);
							}}
							disableAlpha={true}
						/>
					</div>

					<div>
						<span>Default Text Colour</span>
						<ColourPicker
							className="open-reverse"
							colour={
								this.state.pendingChanges.editorTextColour 
								|| this.props.currentSettings.editorTextColour
								|| "#000000"
							}
							onColourChange={(color) => {
								this.changeSetting("editorTextColour", color.hex);
							}}
							disableAlpha={true}
						/>
					</div>

					<div>
						<span>Show Drop Shadow</span>
						<input 
							type="checkbox"
							checked={
								this.state.pendingChanges.editorDropShadow !== undefined 
								? this.state.pendingChanges.editorDropShadow 
								: this.props.currentSettings.editorDropShadow !== undefined 
									? this.props.currentSettings.editorDropShadow 
									: true
							}
							onChange={((e) => {
								this.changeSetting("editorDropShadow", e.target.checked);
							})}
						/>
					</div>
				</div>
				<span className="confirm-wrapper">
					<span>
						<KeyboardFocusableButton 
							onClick={this.resetToDefaults}
							className="defaults-button border warning"
						>Reset Defaults</KeyboardFocusableButton>
					</span>
					<span className="right"> 
						<KeyboardFocusableButton 
							disabled={!this.state.areChanges}
							onClick={this.resetChanges}
							className="reset-button border"
						>Clear Changes</KeyboardFocusableButton>
						<KeyboardFocusableButton 
							disabled={!this.state.areChanges}
							onClick={this.setChanges}
							className="confirm-button border"
						>Confirm</KeyboardFocusableButton>
					</span>
				</span>
			</div>
		);
	}
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
	       		<VerticalTabularMenu
	       			startTab={1}
	       			windows={[
	       				{tabName:"General", render: () => 
	       					<div>
	       						General Tab 
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

const CustomModal = (props) => {
	return(
		<Modal
			isOpen={true}
          	className={"modal " + props.modalClass || null}
          	overlayClassName="modal-overlay"
          	{...props}
        >
        	<div class="modal-header">
        		{props.title}
        		<span className="close-button" >
	        		<KeyboardFocusableButton 
		       			onClick={props.onRequestClose}
		       		>
		       			<Icon icon={xCircle} />
	       			</KeyboardFocusableButton>
	       		</span>
        	</div>
        	<div class="modal-body">
       			{props.children}
       		</div>
        </Modal>
	);
}

export default SettingsModal;