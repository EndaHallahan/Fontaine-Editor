import React, { Component } from 'react';

const KeyboardFocusableButton = (props) => {
	return(
		<button 
			ref={props.domRef} 
			{...props} 
			className={"keyboard-focusable-button " + (props.className ? props.className : "")}
		>
			<div tabIndex="-1">{props.value || props.children}</div>
		</button>
	);
}

export default KeyboardFocusableButton;