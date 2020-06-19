import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import SlateInstance from "../SlateInstance";
import PopupToolbar from "./PopupToolbar";

class MultiDocSlate extends Component {
	constructor(props) {
		super(props);
		this.editors = {}; // Mutable references! Keep out of state! 
		this.state = {
			activeEditor: null
		}
		this.setActiveEditor = this.setActiveEditor.bind(this);
		this.createHoistedEditor = this.createHoistedEditor.bind(this);
		this.activeEditorRef = React.createRef();
	}
	setActiveEditor(id) {
		this.setState({
			...this.state,
			activeEditor: id
		});
	}
	createHoistedEditor(id, editor) {
		this.editors[id] = editor;
	}
	componentDidUpdate(prevProps) {
		if (prevProps.docId !== this.props.docId) {
			this.setState({
				...this.state,
				activeEditor: null
			});
		}	
	}
	render() {
		return (
			<div className="editor-area">
				<div className="corner tlc" />
				<div className="corner trc" />
				<div className="corner blc" />
				<div className="corner brc" />
					<Scrollbars
						style={{ width: "100%", height: "100%" }}
						className = "editor-body"
						renderTrackVertical={props => <div {...props} className="track-vertical"/>}
        				renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
        				renderView={props => <div {...props} className="editor-wrapper"/>}
					>
						{
							this.props.docList.map((id, i) => {
								return(
									<SlateInstance
										ref={id === this.state.activeEditor ? this.activeEditorRef : null}
										createHoistedEditor = {this.createHoistedEditor}
										key = {id}
										docId = {id}
										updateDoc = {this.props.updateDoc}
										queueDocChanges = {this.props.queueDocChanges}
										value={this.props.docSet[id]}
										active={id === this.state.activeEditor}
										setActive={this.setActiveEditor}
										history={this.props.history}
										updateHistory={this.props.updateHistory}
										toolbarComponent={PopupToolbar}
									/>
								);
							})
						}
					</Scrollbars>
			</div>
		);
	}
}



export default MultiDocSlate;