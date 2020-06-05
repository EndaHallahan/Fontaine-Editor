import { createSlice } from '@reduxjs/toolkit';

const statusSlice = createSlice({
	name: "status",
	initialState: {
		messages: [],
		status: "none",
	},
	reducers: {
		setMessage(state, action) {
			const {message} = action.payload;
			state.messages = [message, ...state.messages];
		},
		setStatus(state, action) {
			const {status} = action.payload;
			state.status = status;
		},
	}
});

export const { 
	setMessage,
	setStatus,
} = statusSlice.actions;

export default statusSlice.reducer;