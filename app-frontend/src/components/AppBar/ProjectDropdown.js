import React from 'react';
import { useDispatch } from 'react-redux';
import gitCommit from '@iconify/icons-feather/git-commit';


import { openModal } from "../../store/slices/modalSlice";
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