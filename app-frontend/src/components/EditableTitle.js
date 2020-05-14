import React, { Component } from 'react';
import KeyboardFocusableButton from "./KeyboardFocusableButton";

class EditableTitle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			contents: this.props.value
		}
		this.toggleEditing = this.toggleEditing.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	toggleEditing() {
		if (this.state.editing) {
			this.props.onClose(this.state.contents)
		}
		this.setState({
			...this.state,
			editing: !this.state.editing
		});
	}
	handleChange(e) {
		const txt = e.target.value || "Untitled"		
		this.setState({
			...this.state,
			contents: txt
		});
	}
	render() {
		if (!this.state.editing) {
			return (
				<KeyboardFocusableButton 
					value={this.props.value}
					className="editable-title"
					onClick={event => this.props.onClick(event)}
					onDoubleClick={this.toggleEditing}
				/>
			);
		} else {
			return(
				<EditableTitleInput 
					value={this.props.value}
	              	onChange={this.handleChange}
	              	exit={this.toggleEditing}
				/>
			);
		}
	}
}

class EditableTitleInput extends Component {
	constructor(props) {
		super(props);
		this.input = React.createRef();
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}
	componentDidMount() {
		this.input.current.focus();
	}
	handleKeyDown(e) {
		if (e.keyCode === 27 || e.keyCode === 13) {
	      	this.props.exit()
	    }
	}
	render() {
		return(
			<input
				className="editable-title"
              	defaultValue={this.props.value}
              	onChange={this.props.onChange}
              	onBlur={this.props.exit}
              	onKeyDown={this.handleKeyDown}
              	ref={this.input}
            />
		);
	}
}

export default EditableTitle;