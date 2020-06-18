import React from 'react';

//import { openModal } from "../../store/slices/modalSlice";
import CustomDropdown from "../CustomDropdown";
import LI from "./LI";

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

export default HelpDropdown;