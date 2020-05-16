import React, { Component } from 'react';
import { useSelector } from 'react-redux'
import { Resizable } from "re-resizable";

import Inspector from "./Inspector";

class RightPanelChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: this.props.width || 200
		}
	}
	render() {
		return(
			<Resizable
				size={{width: this.state.width, height: "100%"}}
				minWidth={150}
				maxWidth={500}
				onResizeStop={(e, direction, ref, d) => {
				    this.setState({
				    	...this.state,
				     	width: this.state.width + d.width
				    }); 
				}}
				enable={{ 
					top:false, 
					right:false, 
					bottom:false, 
					left:true, 
					topRight:false, 
					bottomRight:false, 
					bottomLeft:false, 
					topLeft:false 
				}}
				className={this.props.open ? "panel" : "panel closed"}
				id="right-panel"
			>
				<Inspector />
			</Resizable>
		);
	}
}

const RightPanel = (props) => {
	const panelOpen = useSelector(state => state.uiReducer.rightPanelOpen);
	return(
		<RightPanelChild
			open={panelOpen}
		/>
	);
}

export default RightPanel;