import React, { Component, Fragment } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux'
import { QuillDeltaToHtmlConverter as deltaToHtml } from "quill-delta-to-html";

import { queueDocumentChanges, updateWorkingDoc } from "../store/slices/workspaceSlice";

import { 
	MdFormatBold,
	MdFormatItalic,
	MdFormatUnderlined,
	MdStrikethroughS,
	MdFormatListBulleted,
	MdFormatListNumbered
} from "react-icons/md";

import Icon from '@mdi/react';
import { 
	mdiFormatSuperscript,
	mdiFormatSubscript 
} from '@mdi/js';

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

const toolbarOptions = [
  	['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  	['blockquote', 'code-block'],

	[{ 'header': 1 }, { 'header': 2 }],               // custom button values
	[{ 'list': 'ordered'}, { 'list': 'bullet' }],
	[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
	[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
	[{ 'direction': 'rtl' }],                         // text direction

	[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
	[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

	[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
	[{ 'font': [] }],
	[{ 'align': [] }],

	['clean']                                         // remove formatting button
];

const CustomToolbar = () => (
  <div id="quill-toolbar">
   <span className="ql-formats">
	    <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
	      	<option value="1"></option>
	      	<option value="2"></option>
	      	<option selected></option>
	    </select>
	    <select className="ql-size">
	    </select>
    </span>
    <span className="ql-formats">
	    <button className="ql-bold"><MdFormatBold /></button>
	    <button className="ql-italic"><MdFormatItalic /></button>
	    <button className="ql-underline"><MdFormatUnderlined /></button>
	    <button className="ql-strike"><MdStrikethroughS /></button> 
    </span>
    <span className="ql-formats">
    	<button className="ql-script" value="sup"><Icon path={mdiFormatSuperscript}/></button>
    	<button className="ql-script" value="sup"><Icon path={mdiFormatSubscript} /></button>
    </span>
    <span className="ql-formats">
    	<button className="ql-list" value="ordered"><MdFormatListNumbered /></button>
    	<button className="ql-list" value="bullet"><MdFormatListBulleted /></button>
    </span>
    <span className="ql-formats">
    	<select className="ql-color"></select>
    	<select className="ql-background"></select>
    </span>
    
  </div>
)

const colorIcon = `
<svg viewBox="0 0 18 18"> 
	<line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15" style="stroke: red;"></line> 
	<svg y="-2.5" x="-3" width="24.000000000000004" height="24.000000000000004" xmlns="http://www.w3.org/2000/svg">
		  <path class=".ql-stroke" d="m9.5,12.8l5,0l0.9,2.2l2.1,0l-4.75,-11l-1.5,0l-4.75,11l2.1,0l0.9,-2.2zm2.5,-6.82l1.87,5.02l-3.74,0l1.87,-5.02z"/>
	</svg>
</svg>`

const backgroundIcon = `
<svg viewBox="0 0 18 18"> 
	<line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15" style="stroke: red;"></line>
	<svg style="width:24px;height:24px" viewBox="0 0 24 24">
	    <path fill="currentColor" d="M19,11.5C19,11.5 17,13.67 17,15A2,2 0 0,0 19,17A2,2 0 0,0 21,15C21,13.67 19,11.5 19,11.5M5.21,10L10,5.21L14.79,10M16.56,8.94L7.62,0L6.21,1.41L8.59,3.79L3.44,8.94C2.85,9.5 2.85,10.47 3.44,11.06L8.94,16.56C9.23,16.85 9.62,17 10,17C10.38,17 10.77,16.85 11.06,16.56L16.56,11.06C17.15,10.47 17.15,9.5 16.56,8.94Z" />
	</svg>
</svg>

`

let icons = Quill.import('ui/icons');
icons.bold = null;
icons.italic = null;
icons.underline = null;
icons.strike = null;
icons.color = colorIcon;
icons.background = backgroundIcon;
icons.list.ordered = null;
icons.list.bullet = null;
icons.list.checked = null;


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