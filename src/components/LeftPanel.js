import React, { Component } from 'react';
import FolderTree from "./FolderTree"

class LeftPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true
		}
	}
	render() {
		return(
			<div id="left-panel">
				<FolderTree />
			</div>
		);
		
	}
}

export default LeftPanel;