import React from 'react';

const KeyboardFocusableButton = (props) => {
	const {domRef, className, value, children, ...childProps} = props;
	return(
		<button 
			ref={props.domRef} 
			{...childProps} 
			className={"keyboard-focusable-button " + (props.className ? props.className : "")}
		>
			<div tabIndex="-1">{props.value || props.children}</div>
		</button>
	);
}

export default KeyboardFocusableButton;