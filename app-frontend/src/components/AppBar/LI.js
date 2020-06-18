import React from 'react';
import { MenuItem } from "react-menu-list";

import { Icon } from '@iconify/react';

const LI = (props) => {
  	return (
	    <MenuItem
	    	className="dropdown-menu-item"
	    	highlightedClassName="highlighted"
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

export default LI;