import React from 'react';

//import { openModal } from "../../store/slices/modalSlice";
import CustomDropdown from "../CustomDropdown";
import LI from "./LI";

const EditDropdown = (props) => {
	return (
		<CustomDropdown
			title="Edit"
			dropClass="appbar-dropdown"
		>
			<LI>Undo</LI>
			<LI>Redo</LI>
		</CustomDropdown>
	);
}

export default EditDropdown;