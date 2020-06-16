import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadSettings } from "../store/slices/settingsSlice";

const SettingsHandler = (props) => {
	const dispatch = useDispatch();
	const settings = useSelector(state => state.settingsReducer.settings);
	const theme = useSelector(state => state.settingsReducer.theme);
	const themeOverrides = useSelector(state => state.settingsReducer.themeOverrides);

	let root = document.documentElement;

	let combinedTheme = {...theme, ...themeOverrides};

	const initSettings = async () => {
		await dispatch(loadSettings(props.documentInterface));
	}

	const saveSettings = async () => {
		await dispatch(loadSettings(props.documentInterface));
	}

	useEffect(() => {
		initSettings();
	}, []);

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