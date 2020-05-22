import { createSlice } from '@reduxjs/toolkit';

/* 
Available Editor Modes:
	"editor"
	"corkboard"
	"overview"
*/

const uiSlice = createSlice({
	name: "ui",
	initialState: {
		leftPanelOpen: true,
		rightPanelOpen: true,

		editorMode: "overview",

		splitEditorOpen: false,
		splitEditorMode: "corkboard",
		splitOrientation: "vertical",

		distractionFreeOpen: false,

		inspectorTab: 0,
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
		toggleSplitOrientation(state, action) {
			state.splitOrientation = state.splitOrientation === "vertical" ? "horizontal" : "vertical";
		},
		setSplitEditorOpen(state, action) {
			let {open} = action.payload;
			state.splitEditorOpen = open;
		},
		setSplitEditorMode(state, action) {
			let {mode} = action.payload;
			state.splitEditorMode = mode;
		},
		toggleDistractionFree(state, action) {
			state.distractionFreeOpen = !state.distractionFreeOpen;
		},
		setDistractionFree(state, action) {
			let {open} = action.payload
			state.distractionFreeOpen = open;
		},
		setInspectorTab(state, action) {
			let {tab} = action.payload;
			state.inspectorTab = tab;
		},
	}
});

export const { 
	setEditorMode,
	toggleLeftPanel,
	toggleRightPanel,
	toggleSplitEditor,
	toggleSplitOrientation,
	setSplitEditorOpen,
	setSplitEditorMode, 
	toggleDistractionFree,
	setDistractionFree,
	setInspectorTab,
} = uiSlice.actions;

export default uiSlice.reducer;