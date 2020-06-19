import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
	name: "history",
	initialState: {
		histories: {}
	},
	reducers: {
		updateHistory(state, action) {
			const {docId, history} = action.payload;
			state.histories[docId] = history;
		}
	}
});

export const { 
	updateHistory,
} = historySlice.actions;

export default historySlice.reducer;