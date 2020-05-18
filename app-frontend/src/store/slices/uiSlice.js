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
		toggleSplitEditor(state, action) {
			state.splitEditorOpen = !state.splitEditorOpen;
		},
		setSplitEditorOpen(state, action) {
			let {open} = action.payload;
			state.splitEditorOpen = open;
		},
		setSplitEditorMode(state, action) {
			let {mode} = action.payload;
			state.splitEditorMode = mode;
		},
	}
});

export const { 
	setEditorMode,
	toggleLeftPanel,
	toggleRightPanel,
	toggleSplitEditor,
	setSplitEditorOpen,
	setSplitEditorMode,
} = uiSlice.actions;

export default uiSlice.reducer;