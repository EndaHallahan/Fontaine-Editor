import React from "react";
import { useSelector, useDispatch } from 'react-redux';

import { closeModal } from "../store/slices/modalSlice";
import SettingsModal from "./SettingsModal";
import ThemesModal from "./ThemesModal";
import ThreadsModal from "./ThreadsModal";

const modalComponents = {
    SettingsModal,
    ThemesModal,
    ThreadsModal
};

const ModalHandler = (props) => {
	const dispatch = useDispatch();
	const modalType = useSelector(state => state.modalReducer.curModal);
	const modalProps = useSelector(state => state.modalReducer.curModalProps);
	const closeCurrentModal = () => {dispatch(closeModal());}

    let renderedModal = null;

    if (modalType) {
    	const ModalComponent = modalComponents[modalType];
        renderedModal = (
            <ModalComponent 
                onRequestClose={closeCurrentModal} 
                documentInterface={props.documentInterface}
                {...modalProps}
            />
        );
    }

    return <span>{renderedModal}</span>
}

export default ModalHandler;