import React, { Component } from 'react';
import KeyboardFocusableButton from "./KeyboardFocusableButton";
import Modal from 'react-modal';

import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from "../store/slices/modalSlice";

Modal.setAppElement('#root');

class SettingsModal extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<Modal
				isOpen={true}
	          	onAfterOpen={this.props.afterOpenModal}
	          	onRequestClose={this.props.onRequestClose}
	          	contentLabel="Example Modal"
	        >
	        AAAAAAAAAAAAAAAAAAAAAAAArgabarga
	        </Modal>
		);
	}
}

export default SettingsModal;