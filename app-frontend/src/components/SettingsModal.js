import React, { Component } from 'react';
import KeyboardFocusableButton from "./KeyboardFocusableButton";
import Modal from 'react-modal';

import { Icon, InlineIcon } from '@iconify/react';
import xCircle from '@iconify/icons-feather/x-circle';

import { useSelector, useDispatch } from 'react-redux';
import { setSetting, setSettings } from "../store/slices/settingsSlice";

import VerticalTabularMenu from "./VerticalTabularMenu";
import ColourPicker from "./ColourPicker";

Modal.setAppElement('#root');

const SettingsModal = (props) => {
	const dispatch = useDispatch();
	const currentSettings = useSelector(state => state.settingsReducer.settings);
	const updateSetting = (setting, newValue) => {dispatch(setSetting({setting, newValue}));}
	const updateSettings = (settingsObj) => {
		console.log(settingsObj)
		dispatch(setSettings({settingsObj}));
	}
	return (
		<SettingsModalChild
			currentSettings={currentSettings}
			updateSetting={updateSetting}
			updateSettings={updateSettings}
			onRequestClose={props.onRequestClose}
		/>
	);
}

class SettingsModalChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pendingChanges: {},
			areChanges: false
		}
		this.changeSetting = this.changeSetting.bind(this);
		this.setChanges = this.setChanges.bind(this);
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
	render() {
		return(
			<CustomModal
				modalClass="medium"
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
	       					<div>
	       						<div 
	       							className="editor-preview slate-wrapper"
	       							style={{
	       								backgroundColor: this.state.pendingChanges.editorBackgroundColour,
	       								color: this.state.pendingChanges.editorTextColour

	       							}}
	       						>
	       							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia porttitor erat vel luctus. Maecenas eleifend turpis sed eros convallis lobortis.</p>
	       							<p>Sed commodo mattis imperdiet. Curabitur tincidunt ac turpis sit amet vestibulum. Nunc elementum rhoncus arcu eu pretium. Nulla dapibus nibh rhoncus est hendrerit, nec ornare neque rhoncus. Nunc vulputate commodo semper. Morbi mattis euismod neque vel venenatis. Ut pulvinar enim ac tortor eleifend ultricies.</p>
	       							<p> Nunc varius ut urna a fermentum. Nullam vitae pharetra lectus. Quisque porta, metus sit amet aliquam vulputate, ex nulla sollicitudin dolor, sed imperdiet diam dui et diam. Mauris convallis, sapien ut consectetur scelerisque, elit mauris finibus metus, non placerat elit est ut neque.</p>
	       						</div>
	       						<div className="options-list">

	       							<div>
	       								<span>Paper Colour</span>
			       						<ColourPicker
			       							className="open-reverse"
			       							color={
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
	       								<span>Text Colour</span>
			       						<ColourPicker
			       							className="open-reverse"
			       							color={
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

		       						<button 
		       							disabled={!this.state.areChanges}
		       							onClick={this.setChanges}
		       						>Confirm</button>
		       					</div>
	       					</div>
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