import React, { Component } from "react";

class CollapsableDiv extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: this.props.defaultOpen ? true : false
		}
		this.toggleOpen = this.toggleOpen.bind(this);
	}
	toggleOpen() {
		this.setState({
			...this.state,
			open: !this.state.open
		})
	}
	render() {
		return (
			<div className="collapsable-div">
				<div 
					className={this.state.open ? "collapsable-header open" : "collapsable-header"}
					onClick={this.toggleOpen}
				>
					{this.props.title}
				</div>
				<div 
					className={this.state.open ? "open" : "closed"}
					style={{height: this.state.open ? (
						this.props.openHeight !== null ? this.props.openHeight || "auto" : null
					) : 0}}
					{...this.props}
				>
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default CollapsableDiv;