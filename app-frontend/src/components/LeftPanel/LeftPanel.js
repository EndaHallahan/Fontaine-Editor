import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import { Resizable } from "re-resizable";

import FolderTree from "./FolderTree";

class LeftPanelChild extends Component {
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
					right:true, 
					bottom:false, 
					left:false, 
					topRight:false, 
					bottomRight:false, 
					bottomLeft:false, 
					topLeft:false 
				}}
				className={this.props.open ? "panel" : "panel closed"}
				id="left-panel"
			>
				<FolderTree 
					documentInterface={this.props.documentInterface}
				/>
			</Resizable>
		);
		
	}
}

const LeftPanel = (props) => {
	const panelOpen = useSelector(state => state.uiReducer.leftPanelOpen);
	return(
		<LeftPanelChild
			open={panelOpen}
			documentInterface={props.documentInterface}
		/>
	);
}

export default LeftPanel;