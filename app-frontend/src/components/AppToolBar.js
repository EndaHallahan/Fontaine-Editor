import React, { Component, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import KeyboardFocusableButton from "./KeyboardFocusableButton";

const AppToolbar = (props) => {
	const dispatch = useDispatch();
	return(
		<AppToolbarChild 
			
		/>
	);
}

class AppToolbarChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			freeForm: false,
		}
	}
	render() {
		return (
			<div id="app-toolbar">
				<span>
					
				</span>
				
				<span>
					
				</span>

				<span>
					
				</span>
			</div>
		);
	}
}

export default AppToolbar;