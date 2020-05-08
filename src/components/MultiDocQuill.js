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
			<div id="editor-area" /*onBlur={() => this.setActiveEditor(0)}*/>
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

function getCaretCharacterOffsetWithin(element) {
    let offset = 0;
    let length = 0;
    let doc = element.ownerDocument || element.document;
    let win = doc.defaultView || doc.parentWindow;
    let sel = win.getSelection();
    if (sel.rangeCount > 0) {
        let range = win.getSelection().getRangeAt(0);
        let preCaretRange = range.cloneRange();
        let selectedRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        offset = preCaretRange.toString().length;
        length = selectedRange.toString().length;
    }
    return {offset, length};
}

class ToggleableQuillArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			deltaContents: this.props.value ? this.props.value.ops : null,
			selection: null
		}
		this.setContents = this.setContents.bind(this);
		this.getSelectionWithinPlaceholder = this.getSelectionWithinPlaceholder.bind(this);
		this.activate = this.activate.bind(this);
		this.editorArea = React.createRef();
	}
	setContents(deltas) {
		this.setState({
			...this.state,
			deltaContents: deltas
		});
	}
	getSelectionWithinPlaceholder() {
		let ele = this.editorArea.current;
		let offset = 0;
	    let length = 0;
	    let doc = ele.ownerDocument || ele.document;
	    let win = doc.defaultView || doc.parentWindow;
	    let sel = win.getSelection();
	    if (sel.rangeCount > 0) {
	        let range = win.getSelection().getRangeAt(0);
	        let preCaretRange = range.cloneRange();
	        let selectedRange = range.cloneRange();
	        preCaretRange.selectNodeContents(ele);
	        preCaretRange.setEnd(range.startContainer, range.startOffset);
	        offset = preCaretRange.toString().length;
	        length = selectedRange.toString().length;
	    }
	    return {offset, length};
	}
	activate() {
		this.setState({
			...this.state,
			selection: this.getSelectionWithinPlaceholder()
		}, () => this.props.setActive(this.props.docId))
	}
	render() {
		if (!this.props.active) {
			let html = null;
			if (this.state.deltaContents) {
				let converter = new deltaToHtml(this.state.deltaContents, {multiLineParagraph:true}); 
				converter.afterRender((groupType, html) => {
					return html.replace(/<br\/>/g, "&#8203<br/>");
				})
				html = converter.convert()
			}
			return (
				<div className="ql-container">
					<div className="doc-title">{JSON.stringify(this.props.value)}</div>
					<div
						className="quill-editor-placeholder ql-editor"
						onClick={this.activate}
						dangerouslySetInnerHTML={{__html: html}}
						ref={this.editorArea}
					/>
				</div>
			);
		} else {
			return(
				<ReactQuillEx 
					theme="snow" 
					defaultValue={this.state.deltaContents} 	
					onChange={(html, delta, source, editor) => {	
						this.props.updateDoc(this.props.docId, editor.getContents().ops);
						this.props.queueDocChanges(this.props.docId, source.ops);
						this.setContents(editor.getContents().ops);
					}}
					modules={
						{toolbar: "#quill-toolbar"}
					}
					cursorStart={this.state.selection}
				/>
			);
		}
	}
}

class ReactQuillEx extends Component {
	constructor(props) {
		super(props);
		this.editor = React.createRef();
	}
	componentDidMount() {
		this.editor.current.focus();
		if (this.props.cursorStart) {
			this.editor.current.getEditor().setSelection(this.props.cursorStart.offset, this.props.cursorStart.length)		
		}
	}
	render() {
		return (<ReactQuill ref={this.editor} {...this.props}/>);
	}
}

export default MultiDocQuill;