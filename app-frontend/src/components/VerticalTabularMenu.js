import React, { Component } from 'react';
import KeyboardFocusableButton from "./KeyboardFocusableButton";

class VerticalTabularMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: this.props.startTab || 0,
		}
		this.setActiveTab = this.setActiveTab.bind(this);
	}
	setActiveTab(id) {
		this.setState({
			...this.state,
			activeTab: id
		});
	}
	render() {
		return (
			<div className="vertical-tabular-menu">
				<div className="vtl-tab-bar">
					{
						this.props.windows.map((tab, i) => 	
							<KeyboardFocusableButton 
								key={i}
								onClick={() => this.setActiveTab(i)}
							>
								<div 
									className={this.state.activeTab === i ? "vtl-tab active" : "vtl-tab"}
								>
									{tab.tabName}
								</div>
							</KeyboardFocusableButton>
						)
					}
				</div>
				<div className="vtl-window">
					{this.props.windows[this.state.activeTab].render()}
				</div>
			</div>
		);
	}
}

export default VerticalTabularMenu;	