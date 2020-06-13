import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const SettingsHandler = (props) => {
	const settings = useSelector(state => state.settingsReducer.settings);
	const theme = useSelector(state => state.settingsReducer.theme);

	let root = document.documentElement;

	useEffect(() => {
		let themeKeys = Object.keys(theme);
		root.style.cssText = "";
		themeKeys.forEach(key => {
			root.style.setProperty(`--${key}`, theme[key]);
		});
	}, [theme]);

	
	//console.log(JSON.stringify(settings));

	/* MOVE THESE TO THEME */

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
		root.style.setProperty("--editor-drop-shadow", settings.editorDropShadow 
			? "10px 10px 8px black"
			: "none"
		)
	} else {
		root.style.setProperty("--editor-drop-shadow", null)
	}

	if (settings.corkBoardZoom !== undefined) {
		root.style.setProperty("--corkboard-card-width", settings.corkBoardZoom + "rem")
	} else {
		root.style.setProperty("--corkboard-card-width", null)
	}

	if (settings.storyMapZoom !== undefined) {
		root.style.setProperty("--story-map-zoom", settings.storyMapZoom + "rem")
	} else {
		root.style.setProperty("--story-map-zoom", null)
	}

	return null;
}

export default SettingsHandler;