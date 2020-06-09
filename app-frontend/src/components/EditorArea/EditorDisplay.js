import React, { Component, Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import MultiDocSlate from "./MultiDocSlate";
import Corkboard from "./Corkboard";
import Overview from "./Overview";
import StoryMap from "./StoryMap";
import KeyboardFocusableButton from "../KeyboardFocusableButton";

const EditorDisplay = (props) => {
	console.log("split", props.split)
	console.log("inNode", props.nodeIn)
	if (props.nodeIn && props.nodeIn.type === "import") {
		return (
			<ImportDisplay 
				nodeIn={props.nodeIn}
				documentInterface={props.documentInterface}
			/>
		);
	} else if (props.nodeIn) {
		return (
			<Fragment>
				{{
		          	"editor": (
		          		<MultiDocSlate 
							doc = {props.docCache[props.curDocId]}
							docSet = {props.docCache}
							docList = {props.curDocList}
							docId = {props.curDocId}
							updateDoc = {props.updateDoc}
							inspectDoc={props.inspectDoc}
							queueDocChanges = {props.queueDocChanges}
							split={props.split || false}
						/>
		          	),
		          	"corkboard": (
		          		<Corkboard
							treeData={props.docTree}
							curDoc={props.curDocId}
							curDocRow={props.curDocRow}
							getDoc={props.getDoc}
							inspectDoc={props.inspectDoc}
							inspDocId={props.inspDocId}
							newDoc={props.newDoc}
							onTreeChange={props.updateTree}
							docList = {props.curDocList}
							replaceCurRow={props.replaceCurRow}
							split={props.split || false}
						/>
		          	),
		          	"overview": (
		          		<Overview
							treeData={props.docTree}
							curDoc={props.curDocId}
							curDocRow={props.curDocRow}
							getDoc={props.getDoc}
							inspectDoc={props.inspectDoc}
							inspDocId={props.inspDocId}
							newDoc={props.newDoc}
							onTreeChange={props.updateTree}
							docList = {props.curDocList}
							replaceCurRow={props.replaceCurRow}
							mdFields={props.metadataFields}
							split={props.split || false}
						/>
		          	),
		          	"storymap": (
		          		<StoryMap
							treeData={props.docTree}
							curDoc={props.curDocId}
							curDocRow={props.curDocRow}
							getDoc={props.getDoc}
							inspectDoc={props.inspectDoc}
							inspDocId={props.inspDocId}
							newDoc={props.newDoc}
							onTreeChange={props.updateTree}
							docList = {props.curDocList}
							replaceCurRow={props.replaceCurRow}
							threads={props.threads}
							split={props.split || false}
						/>
		          	),
		        }[props.editorMode]}
		    </Fragment>
		);
	} else {
		return null;
	}
}

const ImportDisplay = (props) => {
	const [imported, setImported] = useState({name: null, cont: null});
	const getImportFile = async () => {
		let cont = await props.documentInterface.getImport(props.nodeIn.fileName, props.nodeIn.importType);
		setImported({name: props.nodeIn.title, cont});
	}
	useEffect(() => {
		getImportFile();
	}, [props.nodeIn])
	if (imported.cont && imported.name === props.nodeIn.title) {
		return (
			<div className="import-display">
				{{ // Probably should move the url stuff to the Interface. Won't need encoding on the web (hopefully).
					"image": (
						<img src={
							`data:${props.nodeIn.mimeType};base64, ${imported.cont}`
						} />
					),
					"video": (
						<video controls>
							<source type={props.nodeIn.mimeType} src={
								`data:${props.nodeIn.mimeType};base64, ${imported.cont}`
							} />
							Your browser is older than video! Please update your browser, you absolute dinosaur!
						</video>
					),
					"audio": (
						<audio controls>
							<source type={props.nodeIn.mimeType} src={
								`data:${props.nodeIn.mimeType};base64, ${imported.cont}`
							} />
							Your browser is older than audio! Please update your browser, you absolute dinosaur!
						</audio>
					),
					"pdf": (
						// This'll work for small PDFs, but not large ones b/c of length limits on data URLs.
						// Look into using Blobs and URL.createObjectURL.
						// May be best to switch everything to blobs.
						<iframe src={
							`data:${props.nodeIn.mimeType};base64, ${imported.cont}`
						}></iframe>
					),
					"raw": (
						<div>{imported.cont}</div>
					),
				}[props.nodeIn.importType]}
			</div>
		);
	} else {
		return null;
	}
}

export default EditorDisplay;