import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
	name: "history",
	initialState: {
		histories: {}
	},
	reducers: {
		updateHistory(state, action) {
			const {docId, history} = action.payload;
			const {undos, redos} = history;
			console.log("UPDATING HISTORY")
			state.histories[docId] = {undos, redos};
		}
	}
});

export const { 
	updateHistory,
} = historySlice.actions;

export default historySlice.reducer;