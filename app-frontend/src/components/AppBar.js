import React, { Component } from 'react';
import KeyboardFocusableButton from "./KeyboardFocusableButton";
import {MenuList, MenuItem, MenuButton, Dropdown, SubMenuItem} from "react-menu-list";

import { Icon, InlineIcon } from '@iconify/react';
import saveIcon from '@iconify/icons-feather/save';
import settingsIcon from '@iconify/icons-feather/settings';

const LI = (props) => {
  	return (
	    <MenuItem
	    	className="dropdown-menu-item"
	    	highlightedClassName="highlighted"
			onItemChosen={e => {
				console.log(`selected ${props.children}, byKeyboard: ${String(e.byKeyboard)}`);
			}}
		    {...props}
	    >
	    	<span className="icon">
	    		<Icon icon={props.icon} />
	    	</span>
	    	<span>{props.title || props.children}</span>
	    	<span className="shortcut">{props.shortcut}</span>
		</MenuItem>
  );
}

const CustomDropdown = ({title, children, dropClass}) => {
	return (
		<MenuButton
			className={"dropdown-menu-button"}
			openedClassName="opened"
			ButtonComponent={KeyboardFocusableButton}
			menu={
				<div className={"dropdown-menu-wrapper " + (dropClass || "")}>
					<MenuList>
						{children}
					</MenuList>
				</div>
			}
		>{title}</MenuButton>
	);
}

const FileDropdown = (props) => {
	return (
		<CustomDropdown
			title="File"
			dropClass="appbar-dropdown"
		>
			<LI
				title="New Project"
				shortcut="Ctrl+N"
			/>
			<LI
				title="Open Project..."
				shortcut="Ctrl+O"
			/>
			<hr/>
			<LI
				icon={saveIcon}
				title="Save"
				shortcut="Ctrl+S"
			/>
			<LI>Save As...</LI>
			<hr/>
			<LI>Compile Settings</LI>
			<LI>Compile...</LI>
		</CustomDropdown>
	);
}

const EditDropdown = (props) => {
	return (
		<CustomDropdown
			title="Edit"
			dropClass="appbar-dropdown"
		>
			<LI>New Project</LI>
			<LI>Open...</LI>
			<hr/>
			<LI>Save</LI>
			<LI>Save As...</LI>
			<hr/>
			<LI>Compile Settings</LI>
			<LI>Compile...</LI>
		</CustomDropdown>
	);
}

const ViewDropdown = (props) => {
	return (
		<CustomDropdown
			title="View"
			dropClass="appbar-dropdown"
		>
			<LI>New Project</LI>
			<LI>Open...</LI>
			<hr/>
			<LI>Save</LI>
			<LI>Save As...</LI>
			<hr/>
			<LI>Compile Settings</LI>
			<LI>Compile...</LI>
		</CustomDropdown>
	);
}

const ToolsDropdown = (props) => {
	return (
		<CustomDropdown
			title="Tools"
			dropClass="appbar-dropdown"
		>
			<hr/>
			<LI
				icon={settingsIcon}
				title="Settings..."
			/>
		</CustomDropdown>
	);
}

const HelpDropdown = (props) => {
	return (
		<CustomDropdown
			title="Help"
			dropClass="appbar-dropdown"
		>
			<LI>About Fontaine</LI>
		</CustomDropdown>
	);
}

class HeaderAreaChild extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<div id="appbar">
				<h1>Fontaine</h1>
				<FileDropdown/>
				<EditDropdown/>
				<ViewDropdown/>
				<ToolsDropdown/>
				<HelpDropdown/>
			</div>
		);
	}
}

const HeaderArea = (props) => {
	return(
		<HeaderAreaChild />
	);
}

export default HeaderArea;