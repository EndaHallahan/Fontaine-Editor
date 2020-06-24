import React from 'react';
import Modal from 'react-modal';
import Draggable from 'react-draggable';

import { Icon } from '@iconify/react';
import xCircle from '@iconify/icons-feather/x-circle';

import KeyboardFocusableButton from "./KeyboardFocusableButton";

Modal.setAppElement('#root');

const styleOverrides = {
  overlay: {
    position: 'fixed',
    zIndex: '99',
    height: '100vh',
    width: '100vw',
    padding: 'initial',
    margin: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    border: 'none',
    background: 'transparent',
    borderRadius: '0',
    pointerEvents: "none",
  },
  content: {
    position: 'static',
    padding: '0px',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    background: 'transparent',
    outline: 'none',
    border: "none",
    overflow: 'auto',
    pointerEvents: "auto",
  }
};

const CustomSubwindow = (props) => {
	const {title, contentLabel, modalClass, onRequestClose, onAfterOpen, children, ...childProps} = props;
	return(
		<Modal
			isOpen={true}
	      	style={styleOverrides}
	      	shouldCloseOnOverlayClick={false}
	    >
	    	<Draggable 
	    		handle=".modal-header"
	    		bounds="body"
	    	>
	    	<div 
	    		className={"subwindow " + modalClass || null} 
	    		{...childProps}
	    		
	    	>
	    	<div className="modal-header">
	    		{title}
	    		<span className="close-button" >
	      		<KeyboardFocusableButton 
	       			onClick={onRequestClose}
	       		>
	       			<Icon icon={xCircle} />
	     			</KeyboardFocusableButton>
	     		</span>
	    	</div>
		    	<div className="modal-body">
		   			{children}
		   		</div>
	   		</div>
	   		</Draggable>
	    </Modal>
	);
}

export default CustomSubwindow;