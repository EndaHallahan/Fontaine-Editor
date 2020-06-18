import React, { Component } from 'react';
import { SketchPicker } from "react-color";

class ColourPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			selectedColour: this.props.colour || "#ffffff"
		}
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	handleClick() {
    	this.setState({ 
    		...this.state,
    		open: !this.state.open 
    	})
  	}
  	handleChange(colour) {
  		this.props.onColourChange(colour);
  		this.setState({ 
    		...this.state,
    		selectedColour: colour.hex
    	})
  	}
  	componentWillReceiveProps(nextProps) {
		if(this.props !== nextProps) {
			this.setState({
				...this.state,
			  	selectedColour: nextProps.colour || "#ffffff"
			});
		}
	}
	render() {
		return (
			<div className="colour-picker">
        		<button onClick={this.handleClick}>
        			<div style={{backgroundColor: this.state.selectedColour}} />
        		</button>
        		{ 
        			this.state.open ? 
        			<div className="picker-wrapper">
          				<div className="picker-cover" onClick={ this.handleClick }/>
          				<SketchPicker 
          					onChangeComplete={this.handleChange}
          					color={this.props.colour}
          					{...this.props}
          				/>
        			</div> : null 
    			}
      	</div>
		);
	}
}

export default ColourPicker;