import React, { Component } from 'react';
import KeyboardFocusableButton from "./KeyboardFocusableButton";

class TabularMenu extends Component {
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
			<div className={this.props.horizontal ? "tabular-menu horizontal" : "tabular-menu vertical"}>
				<div className="tab-bar">
					{
						this.props.windows.map((tab, i) => 	
							<KeyboardFocusableButton 
								key={i}
								onClick={() => this.setActiveTab(i)}
							>
								<div 
									className={this.state.activeTab === i ? "tab active" : "tab"}
								>
									{tab.tabName}
								</div>
							</KeyboardFocusableButton>
						)
					}
				</div>
				<div className="window">
					{this.props.windows[this.state.activeTab].render()}
				</div>
			</div>
		);
	}
}

export default TabularMenu;	