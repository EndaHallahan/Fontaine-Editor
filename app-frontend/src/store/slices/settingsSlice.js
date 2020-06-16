import { createSlice } from '@reduxjs/toolkit';
import _ from "lodash";

import { sendMessage } from "./statusSlice";

const settingsSlice = createSlice({
	name: "settings",
	initialState: {
		settings: {},
		theme: {},
		themeOverrides: {},
		currentTheme: "Default",
		themeChanged: false
	},
	reducers: {
		/* Settings */
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
		/* Themes & Theming */
		setTheme(state, action) {
			let {themeName, themeObj} = action.payload;
			state.currentTheme = themeName;
			state.theme = themeObj;
			state.themeChanged = false;
		},
		setThemeSetting(state, action) {
			let {setting, newValue} = action.payload;
			state.themeOverrides[setting] = newValue;
			state.themeChanged = true;
		},
		setThemeSettings(state, action) {
			let {settingsObj} = action.payload;
			_.merge(state.themeOverrides, settingsObj);
			state.themeChanged = true;
		},
		resetSpecificThemeSettings(state, action) {
			let {settingsList} = action.payload;
			settingsList.forEach(setting => {
				delete state.themeOverrides[setting];
			});
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
	resetSpecificThemeSettings,
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