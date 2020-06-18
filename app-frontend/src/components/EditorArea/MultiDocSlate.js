import React, { Component } from 'react';

import EditorToolbar from "./EditorToolbar";
import EditorFooter from "./EditorFooter";
import SlateInstance from "./SlateInstance";

class MultiDocSlate extends Component {
	constructor(props) {
		super(props);
		this.editors = {}; // Mutable references! Keep out of state! 
		this.state = {
			activeEditor: null,
			toolbarTouch: false, // Workaround to rerender the toolbar on minor editor changes (like selections).
		}
		this.setActiveEditor = this.setActiveEditor.bind(this);
		this.createHoistedEditor = this.createHoistedEditor.bind(this);
		this.touchToolbar = this.touchToolbar.bind(this);
	}
	setActiveEditor(id) {
		this.setState({
			...this.state,
			activeEditor: id
		});
		this.props.inspectDoc(id);
	}
	createHoistedEditor(id, editor) {
		this.editors[id] = editor;
	}
	touchToolbar() {
		this.setState({
			...this.state,
			toolbarTouch: !this.state.toolbarTouch
		})
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
				<EditorToolbar 
					editor={this.editors[this.state.activeEditor]}
					touch={this.state.toolbartouch}
				/>
				<div className="editor-body">
					{
						this.props.docList.map((id, i) => {
							return(
								<SlateInstance
									createHoistedEditor = {this.createHoistedEditor}
									key = {id}
									docId = {id}
									updateDoc = {this.props.updateDoc}
									queueDocChanges = {this.props.queueDocChanges}
									value={this.props.docSet[id]}
									active={id === this.state.activeEditor}
									setActive={this.setActiveEditor}
									split={this.props.split}
									touchToolbar={this.touchToolbar}
								/>
							);
						})
					}
				</div>
				<EditorFooter split={this.props.split}/>
			</div>
		);
	}
}



export default MultiDocSlate;