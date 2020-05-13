import React, { Component } from 'react';
import { useSelector } from 'react-redux';

const SettingsHandler = (props) => {
	const settings = useSelector(state => state.settingsReducer.settings);
	//console.log(JSON.stringify(settings));

	/* CSSS Variables */
	
	let root = document.documentElement;

	if (settings.editorBackgroundColour !== undefined) {
		root.style.setProperty("--editor-background-colour", settings.editorBackgroundColour)
	} else {
		root.style.setProperty("--editor-background-colour", null)
	}

	if (settings.editorContainerColour !== undefined) {
		root.style.setProperty("--editor-container-colour", settings.editorContainerColour)
	} else {
		root.style.setProperty("--editor-container-colour", null)
	}

	if (settings.editorTextColour !== undefined) {
		root.style.setProperty("--editor-text-colour", settings.editorTextColour)
	} else {
		root.style.setProperty("--editor-text-colour", null)
	}

	if (settings.editorDropShadow !== undefined) {
		console.log(settings.editorDropShadow ? "10px 10px 8px black" : "none")
		root.style.setProperty("--editor-drop-shadow", settings.editorDropShadow 
			? "10px 10px 8px black"
			: "none"
		)
	} else {
		root.style.setProperty("--editor-drop-shadow", null)
	}

	return null;
}

export default SettingsHandler;