import React from 'react';

import FileDropdown from "./FileDropdown";
import EditDropdown from "./EditDropdown";
import ViewDropdown from "./ViewDropdown";
import ProjectDropdown from "./ProjectDropdown";
import ToolsDropdown from "./ToolsDropdown";
import HelpDropdown from "./HelpDropdown";

const HeaderArea = (props) => {
	return(
		<div id="appbar">
			<h1>Fontaine</h1>
			<FileDropdown documentInterface={props.documentInterface}/>
			<EditDropdown/>
			<ViewDropdown/>
			<ProjectDropdown/>
			<ToolsDropdown/>
			<HelpDropdown/>
		</div>
	);
}

export default HeaderArea;