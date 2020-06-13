import { createSlice } from '@reduxjs/toolkit';
import _ from "lodash";

import { sendMessage } from "./statusSlice";

const settingsSlice = createSlice({
	name: "settings",
	initialState: {
		settings: {},
		theme: {},
		currentTheme: "Default",
		themeChanged: false
	},
	reducers: {
		setSetting(state, action) {
			let {setting, newValue} = action.payload;
			state.settings[setting] = newValue;
		},
		setSettings(state, action) {
			let {settingsObj} = action.payload;
			_.merge(state.settings, settingsObj);
		},
		resetDefaults(state, action) {
			console.log("Resetting!")
			state.settings = {};
		},
		setTheme(state, action) {
			let {themeName, themeObj} = action.payload;
			state.currentTheme = themeName;
			state.theme = themeObj;
			state.themeChanged = false;
		},
		setThemeSetting(state, action) {
			let {setting, newValue} = action.payload;
			state.themes[setting] = newValue;
			state.themeChanged = true;
		},
		setThemeSettings(state, action) {
			let {settingsObj} = action.payload;
			_.merge(state.theme, settingsObj);
			state.themeChanged = true;
		},
		resetThemeDefaults(state, action) {
			console.log("Resetting!")
			state.theme = {};
			state.currentTheme = "Default";
			state.themeChanged = false;
		},
	}
});

export const { 
	setSetting,
	setSettings,
	resetDefaults,
	setTheme,
	setThemeSetting,
	setThemeSettings,
	resetThemeDefaults,
} = settingsSlice.actions;

export default settingsSlice.reducer;

/* Thunks */

export const changeTheme = (themeName, interfaceObj) => async (dispatch, getState) => {
	try {
		console.log("NAME", themeName)
		if (themeName === "Default") {
			dispatch(setTheme({themeName, themeObj: {}}));
		} else {
			const themeData = await interfaceObj.getTheme(themeName);
			dispatch(setTheme({themeName, themeObj: themeData.theme}));
		}
	} catch (err) {
		console.error(err);
		dispatch(sendMessage({message: "An error occurred: " + err, status: "error"}));
	}
}