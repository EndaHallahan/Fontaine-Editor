import React, { Component } from 'react';
import {MenuList, MenuItem, MenuButton, Dropdown, SubMenuItem} from "react-menu-list";

import KeyboardFocusableButton from "./KeyboardFocusableButton";

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

export default CustomDropdown;