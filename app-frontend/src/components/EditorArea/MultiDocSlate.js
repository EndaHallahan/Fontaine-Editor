import React, { Component, Fragment, useEffect, useMemo, useState, useCallback} from 'react';
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { useSelector, useDispatch } from 'react-redux'
import { HotKeys } from 'react-hotkeys';

import { queueDocumentChanges, updateWorkingDoc } from "../../store/slices/workspaceSlice";
import { Element, Leaf } from "../../utils/editor/renderElement";
import EditorToolbar from "./EditorToolbar";
import EditorFooter from "./EditorFooter";
import SlateInstance from "./SlateInstance";

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
		this.props.inspectDoc(id);
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
				<EditorToolbar 
					editor={this.editors[this.state.activeEditor]}
					editorEle={this.activeEditorRef.current ? this.activeEditorRef.current.firstChild: null}
				/>
				<div className="editor-body">
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
									split={this.props.split}
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