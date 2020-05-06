import React, { Component } from 'react';

class EditableTitle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			contents: this.props.value
		}
		this.toggleEditing = this.toggleEditing.bind(this);
	}
	toggleEditing() {
		this.setState({
			...this.state,
			editing: !this.state.editing
		});
	}
	render() {
		if (!this.state.editing) {
			return (
				<span 
					className="editable-title"
					onClick={event => this.props.onClick(event)}
					onDoubleClick={this.toggleEditing}
				>
					{this.props.value}
				</span>
			);
		} else {
			return(
				<EditableTitleInput 
					value={this.props.value}
	              	onChange={event => this.props.onChange(event)}
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
              	value={this.props.value}
              	onChange={this.props.onChange}
              	onBlur={this.props.exit}
              	onKeyDown={this.handleKeyDown}
              	ref={this.input}
            />
		);
	}
}

export default EditableTitle;