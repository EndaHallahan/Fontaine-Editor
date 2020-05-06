import React, { Component } from 'react';
import { Resizable } from "re-resizable";
import FolderTree from "./FolderTree";

class LeftPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
			width: this.props.width || 200
		}
	}
	render() {
		return(
			<Resizable
				size={{width: this.state.width, height: "100%"}}
				minWidth={150}
				onResizeStop={(e, direction, ref, d) => {
				    this.setState({
				    	...this.state,
				     	width: this.state.width + d.width
				    }); 
				}}
				enable={{ 
					top:false, 
					right:true, 
					bottom:false, 
					left:false, 
					topRight:false, 
					bottomRight:false, 
					bottomLeft:false, 
					topLeft:false 
				}}
				id="left-panel"
			>
				<FolderTree />
			</Resizable>
		);
		
	}
}

export default LeftPanel;