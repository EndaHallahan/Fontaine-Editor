import React, { Component } from 'react';
import { useSelector } from 'react-redux';

const SettingsHandler = (props) => {
	const settings = useSelector(state => state.settingsReducer.settings);
	console.log(JSON.stringify(settings));

	/* CSSS Variables */
	
	let root = document.documentElement;

	if (settings.editorBackgroundColour) {
		root.style.setProperty("--editor-background-colour", settings.editorBackgroundColour)
	}

	if (settings.editorTextColour) {
		root.style.setProperty("--editor-text-colour", settings.editorTextColour)
	}

	return null;
}

export default SettingsHandler;