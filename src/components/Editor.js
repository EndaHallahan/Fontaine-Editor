import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux'

import { queueDocumentChanges, updateWorkingDoc } from "../store/slices/workspaceSlice"

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
		/>
	);
}

export default Editor;