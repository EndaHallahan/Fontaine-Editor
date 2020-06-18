import React from "react";
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import loaderIcon from '@iconify/icons-feather/loader';
import alertOctagon from '@iconify/icons-feather/alert-octagon';
import checkIcon from '@iconify/icons-feather/check';
import alertCircle from '@iconify/icons-feather/alert-circle';

const StatusDisplay = (props) => {
	const messages = useSelector(state => state.statusReducer.messages);

	return (
		<div 
			className="status-display"
			data-status={messages[0] ? messages[0].status : "none"}
			title={messages[0] || "Nothing to report."}
		>
			<span>{messages[0] ? messages[0].message : null}</span>
			<span className="divider"></span>
			<span>
				{
					{
						"loading": <Icon icon={loaderIcon} className="spinner"/>,
						"okay": <Icon icon={checkIcon} />,
						"error": <Icon icon={alertOctagon} />,
						"alert": <Icon icon={alertCircle} />,
						"none": null,
					}[messages[0] ? messages[0].status : "none"]
				}
			</span>
			
		</div>
	);
}

export default StatusDisplay;