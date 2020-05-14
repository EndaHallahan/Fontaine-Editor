import { createSlice } from '@reduxjs/toolkit';

/* 
Modes:
	"editor"
	"corkboard"
*/

const editorAreaSlice = createSlice({
	name: "editorArea",
	initialState: {
		mode: "corkboard"
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