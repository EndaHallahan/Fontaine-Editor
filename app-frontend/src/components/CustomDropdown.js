import React from 'react';
import {MenuList, MenuButton } from "react-menu-list";

import KeyboardFocusableButton from "./KeyboardFocusableButton";

const CustomDropdown = ({title, children, dropClass, className}) => {
	return (
		<MenuButton
			className={"dropdown-menu-button " + ( className || "")}
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