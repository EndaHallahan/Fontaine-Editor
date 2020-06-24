import React from 'react';
import Modal from 'react-modal';

import { Icon } from '@iconify/react';
import xCircle from '@iconify/icons-feather/x-circle';

import KeyboardFocusableButton from "./KeyboardFocusableButton";

Modal.setAppElement('#root');

const CustomModal = (props) => {
	return(
		<Modal
			isOpen={true}
	      	className={"modal " + props.modalClass || null}
	      	overlayClassName="modal-overlay"
	      	{...props}
	    >
	    	<div className="modal-header">
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

export default CustomModal;