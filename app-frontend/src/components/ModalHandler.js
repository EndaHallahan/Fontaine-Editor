import React, {Component, useState} from "react";
import { useSelector, useDispatch } from 'react-redux';

import { closeModal } from "../store/slices/modalSlice";
import SettingsModal from "./SettingsModal";

const modalComponents = {
    SettingsModal
};

const ModalHandler = (props) => {
	const dispatch = useDispatch();
	const modalType = useSelector(state => state.modalReducer.curModal);
	const modalProps = useSelector(state => state.modalReducer.curModalProps);
	const closeCurrentModal = () => {dispatch(closeModal());}

    let renderedModal = null;

    if (modalType) {
    	const ModalComponent = modalComponents[modalType];
        renderedModal = <ModalComponent onRequestClose={closeCurrentModal} {...modalProps}/>;
    }

    return <span>{renderedModal}</span>
}

export default ModalHandler;