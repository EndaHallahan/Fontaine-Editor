import React, { Component } from 'react';
import KeyboardFocusableButton from "./KeyboardFocusableButton";
import Modal from 'react-modal';

import { Icon, InlineIcon } from '@iconify/react';
import xCircle from '@iconify/icons-feather/x-circle';

import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from "../store/slices/modalSlice";

import VerticalTabularMenu from "./VerticalTabularMenu";

Modal.setAppElement('#root');

class SettingsModal extends Component {
	constructor(props) {
		super(props);
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
	       			windows={[
	       				{tabName:"General", render: () => <span>General Tab</span>},
	       				{tabName:"Editor", render: () => <span>Editor Tab</span>},
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