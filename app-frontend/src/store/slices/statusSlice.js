import { createSlice } from '@reduxjs/toolkit';

const statusSlice = createSlice({
	name: "status",
	initialState: {
		messages: [],
	},
	reducers: {
		sendMessage(state, action) {
			const {message, status} = action.payload;
			state.messages = [{message, status}, ...state.messages];
		},
	}
});

export const { 
	sendMessage,
} = statusSlice.actions;

export default statusSlice.reducer;