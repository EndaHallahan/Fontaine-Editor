import React, { Component, Fragment } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux'

import { queueDocumentChanges, updateWorkingDoc } from "../store/slices/workspaceSlice";
import MultiDocQuill from "./MultiDocQuill";

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
	const updateDoc = (id, newDoc) => dispatch(updateWorkingDoc({id, newDoc}));
	return(
		<MultiDocQuill 
			doc = {props.doc}
			docSet = {props.docSet}
			docList = {props.docList}
			docId = {props.docId}
			updateDoc = {updateDoc}
			queueDocChanges = {queueDocChanges}
		/>
	);
}

export default Editor;