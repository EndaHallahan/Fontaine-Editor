import { createSlice } from '@reduxjs/toolkit';

/* 
Available Editor Modes:
	"editor"
	"corkboard"
*/

const uiSlice = createSlice({
	name: "ui",
	initialState: {
		leftPanelOpen: true,
		rightPanelOpen: false,

		editorMode: "editor",

		splitEditorOpen: true,
		splitEditorMode: "editor",
	},
	reducers: {
		setEditorMode(state, action) {
			let {mode} = action.payload;
			state.editorMode = mode;
		},
		toggleLeftPanel(state, action) {
			state.leftPanelOpen = !state.leftPanelOpen;
		},
		toggleRightPanel(state, action) {
			state.rightPanelOpen = !state.rightPanelOpen;
		},
	}
});

export const { 
	setEditorMode,
	toggleLeftPanel,
	toggleRightPanel,
} = uiSlice.actions;

export default uiSlice.reducer;