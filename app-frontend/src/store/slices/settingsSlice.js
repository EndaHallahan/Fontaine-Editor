import { createSlice } from '@reduxjs/toolkit';
import _ from "lodash";

const settingsSlice = createSlice({
	name: "settings",
	initialState: {
		settings: {}
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
		}
	}
});

export const { 
	setSetting,
	setSettings,
	resetDefaults,
} = settingsSlice.actions;

export default settingsSlice.reducer;