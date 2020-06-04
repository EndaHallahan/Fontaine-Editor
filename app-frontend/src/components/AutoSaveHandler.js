import React from "react",
import { useSelector, useDispatch } from 'react-redux';

const AutoSaveHandler = (props) => {
	const autoSaveEnabled = !useSelector(state => state.settingsReducer.settings.autoSaveDisabled);
	const autoSaveEnabled = useSelector(state => state.workspaceReducer.loaded);
}

export default AutoSaveHandler;