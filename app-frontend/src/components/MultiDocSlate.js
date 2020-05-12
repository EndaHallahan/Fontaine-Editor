import React, { Component, Fragment, useEffect, useMemo, useState, useCallback } from 'react';
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { useSelector, useDispatch } from 'react-redux'

import { queueDocumentChanges, updateWorkingDoc } from "../store/slices/workspaceSlice";
import { Element, Leaf } from "../utils/editor/renderElement";
import EditorToolbar from "./EditorToolbar";

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
	render() {
		return (
			<div id="editor-area">
				<EditorToolbar 
					editor={this.editors[this.state.activeEditor]}
					editorEle={this.activeEditorRef.current ? this.activeEditorRef.current.firstChild: null}
				/>
				<div className="editor-body">
					{
						this.props.docList.map(id => {
							return(
								<SlateInstance
									//editor = {editors[id]}
									ref={id === this.state.activeEditor ? this.activeEditorRef : null}
									createHoistedEditor = {this.createHoistedEditor}
									key = {id}
									docId = {id}
									updateDoc = {this.props.updateDoc}
									queueDocChanges = {this.props.queueDocChanges}
									value={this.props.docSet[id]}
									active={id === this.state.activeEditor}
									setActive={this.setActiveEditor}
								/>
							);
						})
					}
				</div>
			</div>
		);
	}
}

const SlateInstance = React.forwardRef((props, ref) => {
	const editor = useMemo(() => withReact(createEditor()), []);
	props.createHoistedEditor(props.docId, editor);
	const defaultContents = [{
	  	type: 'paragraph',
	  	children: [{ text: '' }],
	}];
  	const [value, setValue] = useState(props.value && props.value.ops ? props.value.ops : defaultContents);
  	const updateDocument = (value) => {
  		setValue(value);
  		props.updateDoc(props.docId, value);
  	}
  	const renderElement = useCallback(props => <Element {...props} />, [])
  	const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  	return (
  		<div 
  			className="slate-wrapper" 
  			ref={ref}
  			onFocus={() => props.setActive(props.docId)}
    	>
	    	<Slate 
	    		editor={editor} 
	    		value={value} 
	    		onChange={updateDocument}
	    	>
	      		<Editable 
	      			renderElement={renderElement}
        			renderLeaf={renderLeaf}
        			spellCheck
	      		/>
	    	</Slate>
    	</div>
  	)
})

export default MultiDocSlate;