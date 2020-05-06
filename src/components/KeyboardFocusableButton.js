import React, { Component } from 'react';

class KeyboardFocusableButton extends Component {
	render() {
		return(
			<button
				className={"keyboard-focusable-button " + (this.props.className ? this.props.className : "")}
				onClick={this.props.onClick}
				disabled={this.props.disabled}
				title={this.props.title}
			>
				<span tabIndex="-1">{this.props.value}</span>
			</button>
		);
	}
}

export default KeyboardFocusableButton;