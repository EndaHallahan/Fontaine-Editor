import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const SettingsHandler = (props) => {
	const settings = useSelector(state => state.settingsReducer.settings);
	const theme = useSelector(state => state.settingsReducer.theme);
	const themeOverrides = useSelector(state => state.settingsReducer.themeOverrides);

	let root = document.documentElement;

	let combinedTheme = {...theme, ...themeOverrides};

	useEffect(() => {
		let themeKeys = Object.keys(combinedTheme);
		root.style.cssText = "";
		themeKeys.forEach(key => {
			root.style.setProperty(`--${key}`, combinedTheme[key]);
		});
	}, [theme, themeOverrides]);

	return null;
}

export default SettingsHandler;