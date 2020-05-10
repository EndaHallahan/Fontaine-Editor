import React, { Component, Fragment } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux'

import { queueDocumentChanges, updateWorkingDoc } from "../store/slices/workspaceSlice";
import MultiDocQuill from "./MultiDocQuill";

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