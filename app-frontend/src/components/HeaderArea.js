import React, { Component } from 'react';
import KeyboardFocusableButton from "./KeyboardFocusableButton";

class HeaderAreaChild extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<div id="header-area">
				<h1>Fontaine</h1>
				<KeyboardFocusableButton 
					value="File"
				/>
				<KeyboardFocusableButton 
					value="Edit"
				/>
				<KeyboardFocusableButton 
					value="View"
				/>
				<KeyboardFocusableButton 
					value="Settings"
				/>
			</div>
		);
	}
}

const HeaderArea = (props) => {
	return(
		<HeaderAreaChild />
	);
}

export default HeaderArea;