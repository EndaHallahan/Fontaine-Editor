import React, { Component } from 'react';

import { useDispatch } from 'react-redux'; 
import { openModal } from "../../store/slices/modalSlice";

import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomDropdown from "../CustomDropdown";

import LI from "./LI";
import FileDropdown from "./FileDropdown";
import EditDropdown from "./EditDropdown";
import ViewDropdown from "./ViewDropdown";
import ProjectDropdown from "./ProjectDropdown";
import ToolsDropdown from "./ToolsDropdown";
import HelpDropdown from "./HelpDropdown";

class HeaderAreaChild extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<div id="appbar">
				<h1>Fontaine</h1>
				<FileDropdown documentInterface={this.props.documentInterface}/>
				<EditDropdown/>
				<ViewDropdown/>
				<ProjectDropdown/>
				<ToolsDropdown/>
				<HelpDropdown/>
			</div>
		);
	}
}

const HeaderArea = (props) => {
	return(
		<HeaderAreaChild documentInterface={props.documentInterface} />
	);
}

export default HeaderArea;