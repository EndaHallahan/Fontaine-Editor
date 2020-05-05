import { createSlice } from '@reduxjs/toolkit';
import delta from "quill-delta";

const editorSlice = createSlice({
	name: "editor",
	initialState: {
		docChangeQueues: {}
	},
	reducers: {
		queueDocumentChanges(state, action) {
			const {docId, changes} = action.payload;
			console.log(action.payload)
			if (!state.docChangeQueues[docId]) {
				state.docChangeQueues[docId] = changes;
			} else {
				state.docChangeQueues[docId] = state.docChangeQueues[docId].concat(changes);
			}
			console.log(state.docChangeQueues)
		}
	}
});

export const { queueDocumentChanges } = editorSlice.actions;

export default editorSlice.reducer;