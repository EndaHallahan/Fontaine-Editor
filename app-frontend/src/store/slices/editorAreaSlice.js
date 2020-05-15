import { createSlice } from '@reduxjs/toolkit';

/* 
Available Modes:
	"editor"
	"corkboard"
*/

const editorAreaSlice = createSlice({
	name: "editorArea",
	initialState: {
		mode: "editor"
	},
	reducers: {
		setMode(state, action) {
			let {mode} = action.payload;
			state.mode = mode;
		},
	}
});

export const { 
	setMode,
} = editorAreaSlice.actions;

export default editorAreaSlice.reducer;