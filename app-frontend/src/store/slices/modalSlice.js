import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
	name: "modal",
	initialState: {
		curModal: "CompileModal",
		curModalProps: null,
	},
	reducers: {
		openModal(state, action) {
			const {modalType, modalProps} = action.payload;
			state.curModal = modalType;
			state.curModalProps = modalProps;
		},
		closeModal(state, action) {
			state.curModal = null;
			state.curModalProps = null;
		}
	}
});

export const { 
	openModal,
	closeModal,
} = modalSlice.actions;

export default modalSlice.reducer;