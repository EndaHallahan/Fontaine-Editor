import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Icon, InlineIcon } from '@iconify/react';
import loaderIcon from '@iconify/icons-feather/loader';
import alertOctagon from '@iconify/icons-feather/alert-octagon';
import checkIcon from '@iconify/icons-feather/check';
import alertCircle from '@iconify/icons-feather/alert-circle';

//import { setMessage } from "../store/slices/statusSlice";

const StatusDisplay = (props) => {
	//const dispatch = useDispatch();
	const messages = useSelector(state => state.statusReducer.messages);
	const status = useSelector(state => state.statusReducer.status);

	return (
		<div 
			className="status-display"
			data-status={status}
			title={messages[0] || "Nothing to report."}
		>
			<span>{messages[0] || null}</span>
			<span className="divider"></span>
			<span>
				{
					{
						"loading": <Icon icon={loaderIcon} className="spinner"/>,
						"okay": <Icon icon={checkIcon} />,
						"error": <Icon icon={alertOctagon} />,
						"alert": <Icon icon={alertCircle} />,
						"none": null,
					}[status]
				}
			</span>
			
		</div>
	);
}

export default StatusDisplay;