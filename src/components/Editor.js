import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux'

import { queueDocumentChanges, updateWorkingDoc } from "../store/slices/workspaceSlice";

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

const Editor = (props) => {
	const dispatch = useDispatch();
	const queueDocChanges = (id, changes) => dispatch(queueDocumentChanges({docId: id, changes: changes}));
	const updateDoc = (newDoc) => dispatch(updateWorkingDoc({newDoc: newDoc}));
	return(
		<ReactQuill 
			theme="snow" 
			value={props.doc} 	
			onChange={(html, delta, source, editor) => {
				updateDoc(editor.getContents().ops);
				queueDocChanges(props.docId, delta.ops);
			}}	
			scrollingContainer=".ql-container"	
			modules= {
				{toolbar: toolbarOptions}
			}
		/>
	);
}

export default Editor;