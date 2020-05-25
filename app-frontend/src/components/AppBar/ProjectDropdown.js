import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { Icon, InlineIcon } from '@iconify/react';
import gitCommit from '@iconify/icons-feather/git-commit';


import { openModal } from "../../store/slices/modalSlice";
import KeyboardFocusableButton from "../KeyboardFocusableButton";
import CustomDropdown from "../CustomDropdown";
import LI from "./LI";

const ProjectDropdown = (props) => {
	const dispatch = useDispatch();
	return (
		<CustomDropdown
			title="Project"
			dropClass="appbar-dropdown"
		>
			<LI
				icon={gitCommit}
				title="Threads..."
				onItemChosen={e => {
					dispatch(openModal({modalType: "ThreadsModal", modalProps: null}));
				}}
			/>
		</CustomDropdown>
	);
}

export default ProjectDropdown;