import React, { Component, Fragment } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux'
import { QuillDeltaToHtmlConverter as deltaToHtml } from "quill-delta-to-html";

import { queueDocumentChanges, updateWorkingDoc } from "../store/slices/workspaceSlice";

class MultiDocQuill extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeEditor: null
		}
		this.setActiveEditor = this.setActiveEditor.bind(this);
	}
	setActiveEditor(id) {
		this.setState({
			...this.state,
			activeEditor: id
		})
	}
	render() {
		return(
			<div id="editor-area" onBlur={() => this.setActiveEditor(0)}>
				<CustomToolbar />
				<div className="quill-editor-area">
					{
						this.props.docList.map(id => 
							<ToggleableQuillArea
								key = {id}
								docId = {id}
								updateDoc = {this.props.updateDoc}
								queueDocChanges = {this.props.queueDocChanges}
								value={this.props.docSet[id]}
								active={id === this.state.activeEditor}
								setActive={this.setActiveEditor}
							/>
						)
					}
				</div>
			</div>
		);
		
	}
}

const CustomToolbar = () => (
  <div id="quill-toolbar" className="ql-toolbar ql-snow">
    <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
      <option value="1"></option>
      <option value="2"></option>
      <option selected></option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <select className="ql-color">
      <option value="red"></option>
      <option value="green"></option>
      <option value="blue"></option>
      <option value="orange"></option>
      <option value="violet"></option>
      <option value="#d0d1d2"></option>
      <option selected></option>
    </select>
  </div>
)

class ToggleableQuillArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			deltaContents: this.props.value ? this.props.value.ops : null,
		}
		this.setContents = this.setContents.bind(this);
	}
	setContents(deltas) {
		this.setState({
			...this.state,
			deltaContents: deltas
		});
	}
	render() {
		if (!this.props.active) {
			let html = null;
			if (this.state.deltaContents) {
				let converter = new deltaToHtml(this.state.deltaContents, {});
				html = converter.convert()
			}
			return (
				<div className="ql-container">
					<div className="doc-title">{JSON.stringify(this.props.value)}</div>
					<div
						className="quill-editor-placeholder ql-editor"
						onClick={() => this.props.setActive(this.props.docId)}
						dangerouslySetInnerHTML={{__html: html}}
					/>
				</div>
			);
		} else {
			return(
				<ReactQuill 
					theme="snow" 
					defaultValue={this.state.deltaContents} 	
					onChange={(html, delta, source, editor) => {	
						this.props.updateDoc(this.props.docId, editor.getContents().ops);
						this.props.queueDocChanges(this.props.docId, source.ops);
						this.setContents(editor.getContents().ops);
					}}
					modules= {
						{toolbar: "#quill-toolbar"}
					}
				/>
			);
		}
	}
}

export default MultiDocQuill;