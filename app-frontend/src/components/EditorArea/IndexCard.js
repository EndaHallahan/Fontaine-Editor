import React, { Component } from 'react';
import { Icon } from '@iconify/react';
import gridIcon from '@iconify/icons-feather/grid';

import { Input, TextArea } from "../StatefulInputs";

class IndexCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}
	render() {
		let {docIndex, card, onCardChange, inspectDoc, isInspected, ...other} = this.props;
		return (
			<div 
				{...other}
				className={
					(this.props.card.children ? "index-card has-contents" : "index-card")
					+ (this.props.isInspected ? " inspected" : "")
				}
				onClick={() => this.props.inspectDoc(this.props.card.id)}
			>
				<h3>
					<Input
						value={this.props.card.title}
						onChange={e => {
							const title = e.target.value;
	                    	this.props.onCardChange({...this.props.card, title}, this.props.docIndex);
						}}
					/>
				</h3>
				<TextArea
					placeholder="Write a summary..."
					onChange={e => {
						const summary = e.target.value;
                    	this.props.onCardChange({...this.props.card, summary}, this.props.docIndex);
					}}
					value={this.props.card.summary}
				/>
				<span title="Hold to drag"><Icon icon={gridIcon} /></span>
			</div>
		);
	}
}

export default IndexCard;