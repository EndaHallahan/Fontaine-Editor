import React, { Component } from 'react';

import TabularMenu from "../TabularMenu";
import CustomModal from "../CustomModal";

import ThemeOptions from "./ThemeOptions";
import EditorOptions from "./EditorOptions";
import CompilerSelect from "./CompilerSelect";

const CompileModal = (props) => {
	return (
		<CompileModalChild
			onRequestClose={props.onRequestClose}
			documentInterface={props.documentInterface}
		/>
	);
}

class CompileModalChild extends Component {
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
	          	contentLabel="Compile"
	          	title="Compile"
	        >
	       		{/*<TabularMenu
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
	       		/>*/}
	       		<CompilerSelect documentInterface={this.props.documentInterface}/>
	        </CustomModal>
		);
	}
}

export default CompileModal;