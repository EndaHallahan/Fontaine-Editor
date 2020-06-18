import React, { Component } from 'react';

import TabularMenu from "../TabularMenu";
import CustomModal from "../CustomModal";

import ThemeOptions from "./ThemeOptions";
import EditorOptions from "./EditorOptions";

const ThemesModal = (props) => {
	return (
		<SettingsModalChild
			onRequestClose={props.onRequestClose}
			documentInterface={props.documentInterface}
		/>
	);
}

class SettingsModalChild extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render() {
		return(
			<CustomModal
				modalClass="medium tall"
				onRequestClose={this.props.onRequestClose}
	          	onAfterOpen={this.props.afterOpenModal}
	          	contentLabel="Themes and Customization Popup"
	          	title="Themes and Customization"
	        >
	       		<TabularMenu
	       			startTab={0}
	       			windows={[
	       				{tabName:"Themes", render: () => 
	       					<ThemeOptions 
	       						{...this.props}
	       					/>
	       				},
	       				{tabName:"Interface", render: () => 
	       					<div>
	       						Interface
	       					</div>
	       				},
	       				{tabName:"Editor", render: () => 
	       					<EditorOptions 
	       						{...this.props}
	       					/>
	       				},
	       			]}
	       		/>
	        </CustomModal>
		);
	}
}

export default ThemesModal;