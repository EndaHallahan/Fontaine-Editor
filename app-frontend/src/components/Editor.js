import React, { Component, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { queueDocumentChanges, updateWorkingDoc } from "../store/slices/workspaceSlice";
import MultiDocSlate from "./MultiDocSlate";

const Editor = (props) => {
	const dispatch = useDispatch();
	const queueDocChanges = (id, changes) => dispatch(queueDocumentChanges({docId: id, changes: changes}));
	const updateDoc = (id, newDoc) => dispatch(updateWorkingDoc({id, newDoc}));
	return(
		<MultiDocSlate 
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