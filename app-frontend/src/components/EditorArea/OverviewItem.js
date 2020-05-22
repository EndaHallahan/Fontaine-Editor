import React, { Component } from 'react';
import { Icon, InlineIcon } from '@iconify/react';
import gridIcon from '@iconify/icons-feather/grid';

import { Input, TextArea } from "../StatefulInputs";

class OverviewItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}
	render() {
		let {docIndex, card, onCardChange, inspectDoc, isInspected, ...other} = this.props;
		return (
			<tr
				{...other}
			>
				<td>{card.title}</td>
				<td>{card.summary}</td>
				<td>{card.status || ""}</td>
				{
					this.props.mdFields.map(field => {
						if (card.tags) {
							let outTag = null;
							for (let tag of card.tags) {
								if (tag.startsWith(field + ":")) {
									outTag = tag.split(":")[1];
									break;
								}
							}
							return (
								<td>{outTag}</td>
							)
						} else {
							return (
								<td>{null}</td>
							)
						}
					})
				}
			</tr>
		);
	}
}

export default OverviewItem;