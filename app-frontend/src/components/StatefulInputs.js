import React, { Component } from 'react';

class Input extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contents: this.props.value
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.input = React.createRef();
	}
	handleChange(e) {		
		this.setState({
			...this.state,
			contents: e.target.value
		});
	}
	handleKeyDown(e) {
		if (e.keyCode === 27 || e.keyCode === 13) {
	      	this.input.current.blur();
	    }
	}
	componentWillUnmount() {
		this.input.current.blur();
	}
	render() {
		return(
			<input
				{...this.props}
				value={this.state.contents}
				onChange={this.handleChange}
				onBlur={this.props.onChange}
				onKeyDown={this.handleKeyDown}
				ref={this.input}
			/>
		);
	}
}

class TextArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contents: this.props.children
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.input = React.createRef();
	}
	handleChange(e) {		
		this.setState({
			...this.state,
			contents: e.target.value
		});
	}
	handleKeyDown(e) {
		if (e.keyCode === 27) {
	      	this.input.current.blur();
	    }
	}
	componentWillUnmount() {
		this.input.current.blur();
	}
	render() {
		return(
			<textarea
				{...this.props}
				onChange={this.handleChange}
				onBlur={this.props.onChange}
				onKeyDown={this.handleKeyDown}
				ref={this.input}
				value={this.state.contents}
				
			>
			</textarea>
		);
	}
}

export {Input, TextArea};